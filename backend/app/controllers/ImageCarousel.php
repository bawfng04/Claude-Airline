<?php

class ImageCarousel extends Controller {
    private $imageCarouselModel;
    private $uploadDir = 'uploads/carousel/';
    private $publicDir = __DIR__ . '/../../public/';

    public function __construct() {
        $this->imageCarouselModel = $this->model('ImageCarouselModel');
        $absoluteUploadDir = $this->publicDir . $this->uploadDir;
        if (!file_exists($absoluteUploadDir)) {
            mkdir($absoluteUploadDir, 0777, true);
        }
    }

    private function handleImageUpload($fileInputName = 'carousel_image') {
        if (isset($_FILES[$fileInputName]) && $_FILES[$fileInputName]['error'] === UPLOAD_ERR_OK) {
            $fileTmpPath = $_FILES[$fileInputName]['tmp_name']; // Temporary file path
            $fileName = basename($_FILES[$fileInputName]['name']); // Original file name
            $fileNameCmps = explode(".", $fileName); // Split file name by dot
            $fileExtension = strtolower(end($fileNameCmps));

            $newFileName = uniqid('carousel_', true) . '.' . $fileExtension;
            $allowedfileExtensions = ['jpg', 'gif', 'png', 'jpeg', 'webp'];

            if (in_array($fileExtension, $allowedfileExtensions)) {
                $dest_path = $this->publicDir . $this->uploadDir . $newFileName;

                if(move_uploaded_file($fileTmpPath, $dest_path)) {
                    return '/' . $this->uploadDir . $newFileName;
                } else {
                    error_log("Failed to move uploaded file to: " . $dest_path);
                    throw new Exception('Error moving uploaded file.');
                }
            } else {
                throw new Exception('Upload failed. Allowed file types: ' . implode(',', $allowedfileExtensions));
            }
        } elseif (isset($_FILES[$fileInputName]) && $_FILES[$fileInputName]['error'] !== UPLOAD_ERR_NO_FILE) {
            throw new Exception('File upload error code: ' . $_FILES[$fileInputName]['error']);
        }
        // Không có file mới được upload
        return null;
    }

    private function validateCarouselData($data, $isUpdate = false) {
        $required_fields = [
            'carousel_alt',
            'carousel_caption'
        ];

        $missing_fields = [];
        foreach ($required_fields as $field) {
            if (!isset($data[$field]) || $data[$field] === '') {
                 $missing_fields[] = $field;
            }
        }
        // chỉ kiểm tra file upload nếu create
        if (!$isUpdate && (!isset($_FILES['carousel_image']) || $_FILES['carousel_image']['error'] === UPLOAD_ERR_NO_FILE)) {
             $missing_fields[] = 'carousel_image';
        }

        if (!empty($missing_fields)) {
            throw new Exception("Missing required fields: " . implode(', ', $missing_fields));
        }
        return true;
    }

    public function index() {
        try {
            $images = $this->imageCarouselModel->getAllImages();
            $this->jsonResponse(200, 'Success', $images);
        } catch(Exception $e) {
            error_log("Error fetching carousel images: " . $e->getMessage());

            $this->jsonResponse(500, 'Error fetching carousel images');
        }
    }

    public function getById($id) {
         if(!filter_var($id, FILTER_VALIDATE_INT)) {
            $this->jsonResponse(400, 'Invalid image ID');
            return;
        }
        try {
            $image = $this->imageCarouselModel->getImageById($id);
            if($image) {
                $this->jsonResponse(200, 'Success', $image);
            } else {
                $this->jsonResponse(404, 'Image not found');
            }
        } catch(Exception $e) {
            error_log("Error fetching image by ID ($id): " . $e->getMessage());
            $this->jsonResponse(500, 'Error fetching image');
        }
    }

    public function create() {

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->jsonResponse(405, 'Method Not Allowed');
            return;
        }

        $data = $_POST;
        $imagePath = null; // Initialize path for uploaded image


        try {
            $imagePath = $this->handleImageUpload('carousel_image');
            if ($imagePath === null) {
                 throw new Exception("Carousel image file is required for creation.");
            }
            $data['carousel_image'] = $imagePath;

            $this->validateCarouselData($data, false); // create -> false

            $result = $this->imageCarouselModel->addImage(
                $data['carousel_image'],
                $data['carousel_alt'],
                $data['carousel_caption']
            );
            if ($result) {
                $this->jsonResponse(201, 'Carousel image created successfully');
            } else {
                 if ($imagePath && file_exists($this->publicDir . ltrim($imagePath, '/'))) {
                    unlink($this->publicDir . ltrim($imagePath, '/'));
                }
                throw new Exception('Failed to save carousel image data to database.');
            }
        } catch (Exception $e) {

             if ($imagePath && file_exists($this->publicDir . ltrim($imagePath, '/'))) {
                unlink($this->publicDir . ltrim($imagePath, '/'));
            }
            error_log("Error creating carousel image: " . $e->getMessage());
            $this->jsonResponse(400, 'Error creating carousel image', $e->getMessage());
        }
    }

    public function update($id) {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->jsonResponse(405, 'Method Not Allowed');
            return;
        }

         if(!filter_var($id, FILTER_VALIDATE_INT)) {
            $this->jsonResponse(400, 'Invalid image ID');
            return;
        }

        $data = $_POST;
        $newImagePath = null;
        $oldImagePath = null;

        try {
            $existingImage = $this->imageCarouselModel->getImageById($id);
            if (!$existingImage) {
                throw new Exception("Carousel image with ID $id not found.");
            }
            $oldImagePath = $existingImage['carousel_image'];

            $newImagePath = $this->handleImageUpload('carousel_image');

            $finalImagePath = $newImagePath ?? $oldImagePath;
            $data['carousel_image'] = $finalImagePath;

            $this->validateCarouselData($data, true);

            $result = $this->imageCarouselModel->updateImage(
                $id,
                $data['carousel_image'],
                $data['carousel_alt'],
                $data['carousel_caption']
            );

            if ($result) {
                if ($newImagePath !== null && $oldImagePath && file_exists($this->publicDir . ltrim($oldImagePath, '/'))) {
                    if (!unlink($this->publicDir . ltrim($oldImagePath, '/'))) {
                         error_log("Could not delete old image file after update: " . $this->publicDir . ltrim($oldImagePath, '/'));
                    }
                }
                $this->jsonResponse(200, 'Carousel image updated successfully');
            } else {
                 if ($newImagePath !== null && file_exists($this->publicDir . ltrim($newImagePath, '/'))) {
                    unlink($this->publicDir . ltrim($newImagePath, '/'));
                }
                 throw new Exception('Failed to update carousel image data in database, or no changes made.');
            }
        } catch (Exception $e) {
             if ($newImagePath !== null && file_exists($this->publicDir . ltrim($newImagePath, '/'))) {
                unlink($this->publicDir . ltrim($newImagePath, '/'));
            }
            error_log("Error updating carousel image ($id): " . $e->getMessage());
            $this->jsonResponse(400, 'Error updating carousel image', $e->getMessage());
        }
    }

    public function delete($id) {

         if(!filter_var($id, FILTER_VALIDATE_INT)) {
            $this->jsonResponse(400, 'Invalid image ID');
            return;
        }

        try {
            $image = $this->imageCarouselModel->getImageById($id);
            if (!$image) {
                $this->jsonResponse(404, 'Image not found');
                return;
            }
            $imagePathToDelete = $image['carousel_image'];

            $result = $this->imageCarouselModel->deleteImage($id);

            if ($result) {
                $fullPathToDelete = $this->publicDir . ltrim($imagePathToDelete, '/');
                if ($imagePathToDelete && file_exists($fullPathToDelete)) {
                    if (!unlink($fullPathToDelete)) {
                        error_log("DB record deleted, but failed to delete image file: " . $fullPathToDelete);
                         $this->jsonResponse(200, 'Image record deleted, but file deletion failed.');
                    } else {
                        $this->jsonResponse(200, 'Image deleted successfully');
                    }
                } else {
                     $this->jsonResponse(200, 'Image record deleted. Associated file not found or path empty.');
                }
            } else {
                throw new Exception('Failed to delete image record from database.');
            }
        } catch (Exception $e) {
            error_log("Error deleting carousel image ($id): " . $e->getMessage());
            $this->jsonResponse(500, 'Error deleting image', $e->getMessage());
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
        $this->view('image_carousel', $data);
    }

}