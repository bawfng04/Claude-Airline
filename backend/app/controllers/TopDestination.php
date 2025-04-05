<?php
    class TopDestination extends Controller {
        private $topDestinationModel;

            public function __construct() {
                $this->topDestinationModel = $this->model('TopDestinationModel');
            }

            //helper
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
                    //check filed có tồn tại và không rỗng
                    if (!isset($data[$field]) || empty($data[$field])) {
                        return false;
                    }
                }

                // Validate price là số
                if (!is_numeric($data['destination_price'])) {
                    return false;
                }

                // Validate dates
                if (!strtotime($data['destination_begin']) || !strtotime($data['destination_end'])) {
                    return false;
                }

                return true;
            }


            // lấy hết top-destination
            public function index() {
                try{
                    $destination = $this->topDestinationModel->getAllTopDestination();
                    $this->jsonResponse(200, 'Success', $destination);
                }
                catch(Exception $e){
                    $this->jsonResponse(500, 'Error', $e->getMessage());
                }
            }

            // lấy theo id
            public function getById($id) {
                try{
                    $destination = $this->topDestinationModel->getAllTopDestinationById($id);
                    if($destination){
                        $this->jsonResponse(200, 'Success', $destination);
                    }else{
                        $this->jsonResponse(404, 'Not Found', null);
                    }
                }
                catch(Exception $e){
                    $this->jsonResponse(500, 'Error', $e->getMessage());
                }
            }

            // thêm mới top-destination
            public function create(){
                try{
                    $data = json_decode(file_get_contents("php://input"), true); // lấy dữ liệu từ request body
                    if(!$data){
                        $this->jsonResponse(400, 'Bad Request', null);
                        return;
                    }

                    if($this->validateDestinationData($data) == false){
                        $this->jsonResponse(400, 'Bad Request', null);
                        return;
                    }

                    $result = $this->topDestinationModel->addTopDestination(
                        $data['destination_image'] ?? $image, // nếu không có dữ liệu ảnh thì dùng ảnh mặc định
                        $data['destination_name'],
                        $data['destination_country'],
                        $data['destination_price'],
                        $data['destination_description'],
                        $data['destination_begin'],
                        $data['destination_end'],
                        $data['destination_offer'],
                        $data['destination_category']
                    );

                    if($result){
                        $this->jsonResponse(201, 'Created sucessfully!', null);
                    }
                    else{
                        $this->jsonResponse(500, 'Failed to create new destination', null);
                    }
                }
                catch(Exception $e){
                $this->jsonResponse(500, 'Error', $e->getMessage());
            }
        }

        public function delete($id){
            try{
                $result = $this->topDestinationModel->deleteTopDestination($id);
                if($result){
                    $this->jsonResponse(200, 'Deleted successfully!', null);
                }
                else{
                    $this->jsonResponse(500, 'Failed to delete destination', null);
                }
            }
            catch(Exception $e){
                $this->jsonResponse(500, 'Error', $e->getMessage());
            }
        }

    }



