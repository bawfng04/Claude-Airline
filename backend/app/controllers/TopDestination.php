<?php
class TopDestination extends Controller {
    private $topDestinationModel;
    private $default_image = 'default.jpg';

    public function __construct() {
        $this->topDestinationModel = $this->model('TopDestinationModel');
    }

    private function sanitizeInput($data) {
        $sanitized = [];
        foreach($data as $key => $value) {
            $sanitized[$key] = htmlspecialchars(strip_tags($value));
        }
        return $sanitized;
    }

    private function validateDestinationData($data) {
        $required_fields = [
            'destination_image',
            'destination_name',
            'destination_country',
            'destination_price',
            'destination_description',
            'destination_begin',
            'destination_end',
            'destination_offer',
            'destination_category'
        ];

        foreach ($required_fields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                return false;
            }
        }

        // Validate price là số và lớn hơn 0
        if (!is_numeric($data['destination_price']) || $data['destination_price'] <= 0) {
            return false;
        }

        // Validate dates
        $begin = strtotime($data['destination_begin']);
        $end = strtotime($data['destination_end']);
        $today = strtotime('today');

        if (!$begin || !$end) {
            return false;
        }

        // Kiểm tra ngày bắt đầu < ngày kết thúc
        if ($begin >= $end) {
            return false;
        }

        // Kiểm tra ngày không nằm trong quá khứ
        if ($begin < $today) {
            return false;
        }

        return true;
    }

    public function index() {
        try {
            $destination = $this->topDestinationModel->getAllTopDestination();
            $this->jsonResponse(200, 'Success', $destination);
        } catch(Exception $e) {
            $this->jsonResponse(500, 'Error', $e->getMessage());
        }
    }

    public function getById($id) {
        try {
            $destination = $this->topDestinationModel->getAllTopDestinationById($id);
            if($destination) {
                $this->jsonResponse(200, 'Success', $destination);
            } else {
                $this->jsonResponse(404, 'Destination not found', null);
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

            // Sanitize input
            $data = $this->sanitizeInput($data);

            if(!$this->validateDestinationData($data)) {
                $this->jsonResponse(400, 'Bad Request: Invalid data', null);
                return;
            }

            $result = $this->topDestinationModel->addTopDestination(
                $data['destination_image'] ?? $this->default_image,
                $data['destination_name'],
                $data['destination_country'],
                $data['destination_price'],
                $data['destination_description'],
                $data['destination_begin'],
                $data['destination_end'],
                $data['destination_offer'],
                $data['destination_category']
            );

            if($result) {
                $this->jsonResponse(201, 'Created successfully!', null);
            } else {
                $this->jsonResponse(500, 'Failed to create new destination', null);
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
            $this->jsonResponse(400, 'Missing destination id', null);
            return;
        }
        try {
            // Kiểm tra destination tồn tại
            $destination = $this->topDestinationModel->getAllTopDestinationById($id);
            if (!$destination) {
                $this->jsonResponse(404, 'Destination not found', null);

                return;
            }

            $result = $this->topDestinationModel->deleteTopDestination($id);
            if ($result) {
                $this->jsonResponse(200, 'Deleted successfully!', null);
            } else {
                $this->jsonResponse(500, 'Failed to delete destination', null);
            }
        } catch (Exception $e) {
            $this->jsonResponse(500, 'Error', $e->getMessage());
        }
    }

    public function update($id) {
        try {
            // Kiểm tra destination tồn tại
            $destination = $this->topDestinationModel->getAllTopDestinationById($id);
            if(!$destination) {
                $this->jsonResponse(404, 'Destination not found', null);
                return;
            }

            $data = json_decode(file_get_contents("php://input"), true);
            if(!$data) {
                $this->jsonResponse(400, 'Bad Request: Invalid JSON', null);
                return;
            }

            // Sanitize input
            $data = $this->sanitizeInput($data);

            if(!$this->validateDestinationData($data)) {
                $this->jsonResponse(400, 'Bad Request: Invalid data', null);
                return;
            }

            $result = $this->topDestinationModel->modifyTopDestination(
                $id,
                $data['destination_image'] ?? $this->default_image,
                $data['destination_name'],
                $data['destination_country'],
                $data['destination_price'],
                $data['destination_description'],
                $data['destination_begin'],
                $data['destination_end'],
                $data['destination_offer'],
                $data['destination_category']
            );

            if($result) {
                $this->jsonResponse(200, 'Updated successfully!', null);
            } else {
                $this->jsonResponse(500, 'Failed to update destination', null);
            }
        } catch(Exception $e) {
            $this->jsonResponse(500, 'Error', $e->getMessage());
        }
    }
}