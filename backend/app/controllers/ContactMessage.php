<?php

class ContactMessage extends Controller {
    private $contactMessageModel;

    public function __construct() {
        $this->contactMessageModel = $this->model('ContactMessageModel');
    }

    private function sanitizeInput($data) {
        $sanitized = [];
        foreach ($data as $key => $value) {
            $sanitized[$key] = htmlspecialchars(strip_tags(trim($value)));
        }
        return $sanitized;
    }

    private function validateMessageData($data) {
        $required_fields = ['name', 'email', 'subject', 'message'];
        $missing_fields = [];

        foreach ($required_fields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                $missing_fields[] = $field;
            }
        }

        if (!empty($missing_fields)) {
            throw new Exception("Missing required fields: " . implode(', ', $missing_fields));
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Invalid email format.");
        }

        return true;
    }

    public function create() {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            try {
                $data = json_decode(file_get_contents("php://input"), true);

                if (!$data) {
                    $this->jsonResponse(400, 'Bad Request: Invalid JSON', null);
                    return;
                }

                $data = $this->sanitizeInput($data);
                $this->validateMessageData($data);

                $result = $this->contactMessageModel->addMessage(
                    $data['name'],
                    $data['email'],
                    $data['phone'] ?? null, // sdt không bắt buộc
                    $data['subject'],
                    $data['message']
                );

                if ($result) {
                    $this->jsonResponse(201, 'Message sent successfully!', null);
                } else {
                    $this->jsonResponse(500, 'Failed to send message.', null);
                }
            } catch (Exception $e) {
                $this->jsonResponse(400, 'Validation error: ' . $e->getMessage(), null);
            }
        } else {
            $this->jsonResponse(405, 'Method Not Allowed', null);
        }
    }

    public function index() {
        try {
            $messages = $this->contactMessageModel->getAllMessages();
            $this->jsonResponse(200, 'Success', $messages);
        } catch (Exception $e) {
            $this->jsonResponse(500, 'Error fetching messages', $e->getMessage());
        }
    }

    public function show($id) {
        try {
            $message = $this->contactMessageModel->getMessageById($id);
            if ($message) {
                $this->jsonResponse(200, 'Success', $message);
            } else {
                $this->jsonResponse(404, 'Message not found', null);
            }
        } catch (Exception $e) {
            $this->jsonResponse(500, 'Error fetching message', $e->getMessage());
        }
    }

    public function updateStatus($id) {
        if ($_SERVER['REQUEST_METHOD'] == 'PUT' || $_SERVER['REQUEST_METHOD'] == 'PATCH') {
            try {
                $data = json_decode(file_get_contents("php://input"), true);
                if (!isset($data['status']) || !in_array($data['status'], ['unread', 'read', 'replied'])) {
                    $this->jsonResponse(400, 'Invalid status provided. Must be one of: unread, read, replied.', null);
                    return;
                }

                $message = $this->contactMessageModel->getMessageById($id);
                if (!$message) {
                    $this->jsonResponse(404, 'Message not found', null);
                    return;
                }

                $result = $this->contactMessageModel->updateMessageStatus($id, $data['status']);
                if ($result) {
                    $this->jsonResponse(200, 'Message status updated successfully!', null);
                } else {
                    $this->jsonResponse(500, 'Failed to update message status.', null);
                }
            } catch (Exception $e) {
                $this->jsonResponse(500, 'Error updating status', $e->getMessage());
            }
        } else {
            $this->jsonResponse(405, 'Method Not Allowed', null);
        }
    }

    public function delete($id = null) {
        if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
            if (!$id) {
                $id = $_GET['id'] ?? null;
            }
            if (!$id) {
                $this->jsonResponse(400, 'Missing message ID.', null);
                return;
            }

            try {
                $message = $this->contactMessageModel->getMessageById($id);
                if (!$message) {
                    $this->jsonResponse(404, 'Message not found', null);
                    return;
                }

                $result = $this->contactMessageModel->deleteMessage($id);
                if ($result) {
                    $this->jsonResponse(200, 'Message deleted successfully!', null);
                } else {
                    $this->jsonResponse(500, 'Failed to delete message.', null);
                }
            } catch (Exception $e) {
                $this->jsonResponse(500, 'Error deleting message', $e->getMessage());
            }
        } else {
            $this->jsonResponse(405, 'Method Not Allowed', null);
        }
    }

    public function manage(){
        if(!defined('BASE_URL')) {
            define('BASE_URL', base_url());
        }
        if(!defined('BASEURL')) {
            define('BASEURL', base_url());
        }
        $data = [
            'base_url' => base_url(),
        ];
        $this->view('contact_message', $data);
    }

}