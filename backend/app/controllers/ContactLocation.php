<?php
class ContactLocation extends Controller {
    private $ContactLocationModel;

    public function __construct() {
        $this->ContactLocationModel = $this->model('ContactLocationModel');
    }

    private function sanitizeInput($data) {
        $sanitized = [];
        foreach($data as $key => $value) {
            $sanitized[$key] = htmlspecialchars(strip_tags($value));
        }
        return $sanitized;
    }

    private function validateLocationData($data) {
        $required_fields = [
            'location_name',
            'des_type',
            'address_string',
            'phone_number',
            'working_hours',
            'email',
            'location_embed_code'
        ];

        $missing_fields = [];
        foreach ($required_fields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                $missing_fields[] = $field;
            }
        }

        if (!empty($missing_fields)) {
            throw new Exception("Missing required fields: " . implode(', ', $missing_fields));
        }

        // Validate address_string
        if (strlen($data['address_string']) < 5) {
            throw new Exception("Address string must be at least 5 characters long");
        }

        // Validate phone_number
        if (!preg_match('/^\+?[0-9]{10,15}$/', $data['phone_number'])) {
            throw new Exception("Phone number must be a valid format (10-15 digits)");
        }

        return true;
    }

    public function index() {
        try {
            $location = $this->ContactLocationModel->getAllContactLocations();
            if (!$location) {
                $this->jsonResponse(404, 'No locations found', null);
                return;
            }
            $this->jsonResponse(200, 'Success', $location);
        } catch(Exception $e) {
            $this->jsonResponse(500, 'Error', $e->getMessage());
        }
    }

    public function getById($id) {
        try {
            $location = $this->ContactLocationModel->getAllContactLocationsById($id);
            if($location) {
                $this->jsonResponse(200, 'Success', $location);
            } else {
                $this->jsonResponse(404, 'Location not found', null);
            }
        } catch(Exception $e) {
            $this->jsonResponse(500, 'Error', $e->getMessage());
        }
    }

    public function create() {
        try {

            $data = json_decode(file_get_contents("php://input"), true);
            if(!$data) {
                $this->jsonResponse(400, 'Bad Request: Invalid JSON', null);
                return;
            }

            // Log received data for debugging
            error_log("Received create data: " . json_encode($data));

            // Sanitize input
            $data = $this->sanitizeInput($data);

            try {
                $this->validateLocationData($data);
            } catch (Exception $e) {
                $this->jsonResponse(400, 'Validation error: ' . $e->getMessage(), null);
                return;
            }

            $result = $this->ContactLocationModel->addContactLocation(
                $data['location_name'],
                $data['des_type'],
                $data['address_string'],
                $data['phone_number'],
                $data['working_hours'],
                $data['email'],
                $data['location_embed_code']
            );

            if($result) {
                $this->jsonResponse(201, 'Created successfully!', null);
            } else {
                $this->jsonResponse(500, 'Failed to create location', null);
            }
        } catch(Exception $e) {
            $this->jsonResponse(500, 'Error', $e->getMessage());
        }
    }

    public function delete($id = null) {
        // If $id is not provided via routing, check the query string
        if (!$id) {
            $id = $_GET['id'] ?? null;
        }
        if (!$id) {
            $this->jsonResponse(400, 'Missing location id', null);
            return;
        }
        try {
            // Kiểm tra location tồn tại
            $location = $this->ContactLocationModel->getAllContactLocationsById($id);
            if (!$location) {
                $this->jsonResponse(404, 'Location not found', null);
                return;
            }

            $result = $this->ContactLocationModel->deleteContactLocation($id);
            if ($result) {
                $this->jsonResponse(200, 'Deleted successfully!', null);
            } else {
                $this->jsonResponse(500, 'Failed to delete location', null);
            }
        } catch (Exception $e) {
            $this->jsonResponse(500, 'Error', $e->getMessage());
        }
    }

    public function update($id) {
        try {
            // Kiểm tra location tồn tại
            $location = $this->ContactLocationModel->getAllContactLocationsById($id);
            if(!$location) {
                $this->jsonResponse(404, 'Location not found', null);
                return;
            }

            $data = json_decode(file_get_contents("php://input"), true);
            if(!$data) {
                $this->jsonResponse(400, 'Bad Request: Invalid JSON', null);
                return;
            }

            // Log received data for debugging
            error_log("Received update data: " . json_encode($data));

            // Sanitize input
            $data = $this->sanitizeInput($data);

            try {
                $this->validateLocationData($data);
            } catch (Exception $e) {
                $this->jsonResponse(400, 'Validation error: ' . $e->getMessage(), null);
                return;
            }

            $result = $this->ContactLocationModel->modifyContactLocation(
                $id,
                $data['location_name'],
                $data['des_type'],
                $data['address_string'],
                $data['phone_number'],
                $data['working_hours'],
                $data['email'],
                $data['location_embed_code']
            );

            if($result) {
                $this->jsonResponse(200, 'Updated successfully!', null);
            } else {
                $this->jsonResponse(500, 'Failed to update location', null);
            }
        } catch(Exception $e) {
            $this->jsonResponse(500, 'Error', $e->getMessage());
        }
    }
}