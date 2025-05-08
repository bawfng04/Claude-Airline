<?php

define('BASE_URL', 'http://localhost'); 

class VlogPost extends Controller {

    private $postModel;
    private $uploadDir = 'uploads/vlog/'; 
    private $publicDir;

    public function __construct() {
        $this->postModel = $this->model('VlogPostModel');
        $this->publicDir = realpath(__DIR__ . '/../../public/');
        $absoluteUploadDir = $this->publicDir . DIRECTORY_SEPARATOR . $this->uploadDir;
        if (!file_exists($absoluteUploadDir)) {
            @mkdir($absoluteUploadDir, 0775, true);
        }
        if (session_status() === PHP_SESSION_NONE) { session_start(); }
    }

    public function index() {
        try {
            $posts = $this->postModel->getAllPostsForAdmin();
            $data = [
                'pageTitle' => 'Vlog Posts Management',
                'vlogPosts' => $posts ?: []
            ];
            $this->view('vlog_posts_manage', $data);
        } catch (Exception $e) {
            error_log('Error loading vlog posts for admin: ' . $e->getMessage());
            die('Error loading vlog posts.');
        }
    }

    public function save() {

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { 
            header('Location: ' . BASE_URL . '/vlogPost'); 
            exit; 
        }

        $postId = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
        $title = filter_input(INPUT_POST, 'title', FILTER_SANITIZE_SPECIAL_CHARS);
        $main_content_input = $_POST['main_content'] ?? ''; 
        $main_content = trim($main_content_input); 
        $introduction = filter_input(INPUT_POST, 'introduction', FILTER_SANITIZE_SPECIAL_CHARS); 
        $status = filter_input(INPUT_POST, 'status', FILTER_SANITIZE_SPECIAL_CHARS);
        $removeCurrentImage = filter_input(INPUT_POST, 'remove_featured_image', FILTER_VALIDATE_BOOLEAN);
        $userId = filter_input(INPUT_POST, 'user_id', FILTER_VALIDATE_INT); 

        $data = [
            'title' => trim($title ?? ''),
            'introduction' => trim($introduction ?? ''),
            'main_content' => $main_content,
            'status' => ($status === 'published' || $status === 'draft') ? $status : 'draft'
        ];

        if (empty($data['title']) || empty($data['status'])) {
            $_SESSION['flash_error'] = 'Title and Status are required.';
            header('Location: ' . BASE_URL . '/vlogPost'); exit;
        }
        if (!$postId && empty($userId)) { 
            $_SESSION['flash_error'] = 'Author ID is required for new posts.';
            header('Location: ' . BASE_URL . '/vlogPost'); exit;
        }

        $needsSlugUpdate = false;
        $existingPost = null; 
        if ($postId) { 
            $existingPost = $this->postModel->getPostById($postId);
            if ($existingPost && $existingPost['title'] !== $data['title']) { $needsSlugUpdate = true; }
        } else { $needsSlugUpdate = true; } 

        if ($needsSlugUpdate) {
            $slug = $this->generateSlug($data['title']); $originalSlug = $slug; $counter = 1;
            while ($this->postModel->slugExists($slug, $postId ?: null)) { $slug = $originalSlug . '-' . $counter++; }
            $data['slug'] = $slug;
        }

        $currentImagePath = $postId ? ($existingPost['featured_image'] ?? null) : null;
        $newImagePathRelative = null;

        try {
            if (isset($_FILES['featured_image']) && $_FILES['featured_image']['error'] === UPLOAD_ERR_OK) {
                $newImagePathRelative = $this->handleImageUpload('featured_image');
                $data['featured_image'] = $newImagePathRelative; 
            } elseif ($postId && $removeCurrentImage) {
                $data['featured_image'] = null; 
            } elseif (!$postId) {
                $data['featured_image'] = null; 
            }

            $galleryProcessed = false; 
            if (isset($_POST['gallery_images_json'])) {
                $galleryProcessed = true;
                $galleryJsonString = $_POST['gallery_images_json'];
                $decodedGallery = json_decode($galleryJsonString, true);
                $validatedGalleryUrls = [];

                if (json_last_error() === JSON_ERROR_NONE && is_array($decodedGallery)) {
                    foreach ($decodedGallery as $url) {
                        if (is_string($url) && !empty($url)) {
                            if (filter_var($url, FILTER_VALIDATE_URL) || (strpos($url, '/') === 0 && !strpos($url, '//') && !strpos($url, '..'))) {
                                $validatedGalleryUrls[] = filter_var($url, FILTER_SANITIZE_URL); 
                            } else {
                                error_log("Invalid gallery URL skipped: " . $url);
                            }
                        }
                    }
                    $data['gallery_images'] = $validatedGalleryUrls; 
                } else {
                    $data['gallery_images'] = []; 
                }
            } else {
                if (!$postId) {
                    $data['gallery_images'] = [];
                    $galleryProcessed = true; 
                }
            }
            
            $success = false;
            if ($postId) { 
                if (!empty($userId)) {
                $data['user_id'] = $userId; 
                }
                if (!$galleryProcessed) {
                unset($data['gallery_images']); 
                }
                $success = $this->postModel->updatePost($postId, $data);
            } else { 
                $data['user_id'] = $userId; 
                if (empty($data['user_id'])) throw new Exception("Author user ID is required for new posts."); 
                if (!isset($data['gallery_images'])) {
                    $data['gallery_images'] = [];
                }
                $success = $this->postModel->addPost($data);
            }

            if ($success) {
                $imageWasReplaced = $newImagePathRelative !== null;
                $imageWasRemoved = $postId && $removeCurrentImage && array_key_exists('featured_image', $data) && $data['featured_image'] === null;
                if ($currentImagePath && ($imageWasReplaced || $imageWasRemoved)) {
                    $fullPath = $this->publicDir . $currentImagePath; 
                    if (file_exists($fullPath) && is_file($fullPath)) { 
                        @unlink($fullPath);
                    }
                }
                $_SESSION['flash_success'] = 'Vlog post saved successfully.';
            } else {
                $lastError = $this->postModel->getLastError(); 
                error_log("Failed to save vlog post (ID: {$postId}). DB Error: " . print_r($lastError, true));
                $_SESSION['flash_error'] = 'Failed to save vlog post. ' . ($lastError ? print_r($lastError, true) : '');
                if ($newImagePathRelative && file_exists($this->publicDir . $newImagePathRelative)) {
                    @unlink($this->publicDir . $newImagePathRelative);
                }
            }

        } catch (Exception $e) {
            error_log('Exception during post save: ' . $e->getMessage());
            $_SESSION['flash_error'] = 'Error saving post: ' . $e->getMessage();
            if ($newImagePathRelative && file_exists($this->publicDir . $newImagePathRelative)) {
                @unlink($this->publicDir . $newImagePathRelative);
            }
        }
        header('Location: ' . BASE_URL . '/vlogPost'); 
        exit;
    }

    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: ' . BASE_URL . '/vlogPost'); exit; }
        $postId = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
        if (!$postId) { $_SESSION['flash_error'] = 'Invalid Post ID.'; header('Location: ' . BASE_URL . '/vlogPost'); exit; }

        try {
            $post = $this->postModel->getPostById($postId);
            if ($post) {
                $imagePath = $post['featured_image']; 
                $deleted = $this->postModel->deletePost($postId);

                if ($deleted) {
                    if ($imagePath && file_exists($this->publicDir . $imagePath)) {
                        @unlink($this->publicDir . $imagePath);
                    }
                    $_SESSION['flash_success'] = 'Vlog post deleted successfully.';
                } else {
                    $_SESSION['flash_error'] = 'Failed to delete vlog post from database.';
                }
            } else { $_SESSION['flash_error'] = 'Post not found.'; }
        } catch (Exception $e) {
            error_log('Exception during post deletion: ' . $e->getMessage());
            $_SESSION['flash_error'] = 'Error deleting post: ' . $e->getMessage();
        }
        header('Location: ' . BASE_URL . '/vlogPost');
        exit;
    }

    public function listPublished() {
        $page = filter_input(INPUT_GET, 'page', FILTER_VALIDATE_INT, ['options' => ['default' => 1, 'min_range' => 1]]);
        $limit = filter_input(INPUT_GET, 'limit', FILTER_VALIDATE_INT, ['options' => ['default' => 6, 'min_range' => 1]]);
        $searchTerm = filter_input(INPUT_GET, 'search', FILTER_SANITIZE_SPECIAL_CHARS);
        $offset = ($page - 1) * $limit;
        try {
            $posts = $this->postModel->getPublishedPosts($limit, $offset, $searchTerm);
            $totalPosts = $this->postModel->getTotalPublishedPostsCount($searchTerm);
            $data = [ 'posts' => $posts ?: [], 'total' => $totalPosts, 'page' => $page, 'limit' => $limit, 'totalPages' => $totalPosts > 0 ? ceil($totalPosts / $limit) : 0 ];
            $this->jsonResponse(200, 'Success', $data);
        } catch (Exception $e) { $this->jsonResponse(500, 'Error fetching posts', $e->getMessage()); }
    }

    public function show($slug = null) {
        if (empty($slug)) { return $this->jsonResponse(400, 'Post slug not specified.'); }
        $sanitizedSlug = filter_var($slug, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        try {
            $post = $this->postModel->getPostBySlug($sanitizedSlug); 
            if ($post) {
                $this->jsonResponse(200, 'Success', $post);
            } else { $this->jsonResponse(404, 'Vlog post not found.'); }
        } catch (Exception $e) { $this->jsonResponse(500, 'Error fetching post', $e->getMessage()); }
    }

    private function handleImageUpload($fileInputName) {
        if (!isset($_FILES[$fileInputName]) || $_FILES[$fileInputName]['error'] !== UPLOAD_ERR_OK) {
            if ($_FILES[$fileInputName]['error'] == UPLOAD_ERR_NO_FILE) return null;
            throw new Exception('File upload error: ' . ($_FILES[$fileInputName]['error'] ?? 'Unknown error'));
        }
        $fileTmpPath = $_FILES[$fileInputName]['tmp_name'];
        $fileName = basename($_FILES[$fileInputName]['name']);
        $fileSize = $_FILES[$fileInputName]['size'];
        $fileType = $_FILES[$fileInputName]['type'];
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $maxFileSize = 5 * 1024 * 1024; 
        if (!in_array($fileExtension, $allowedExtensions)) { throw new Exception('Invalid file type. Allowed: ' . implode(', ', $allowedExtensions)); }
        if ($fileSize > $maxFileSize) { throw new Exception('File size exceeds limit (Max 5MB).'); }
        if (!getimagesize($fileTmpPath)) { throw new Exception('Uploaded file is not a valid image.'); }
        $newFileName = uniqid('vlog_', true) . '.' . $fileExtension;
        $destPathAbsolute = $this->publicDir . DIRECTORY_SEPARATOR . $this->uploadDir . $newFileName;
        $destPathRelative = '/' . str_replace('\\', '/', $this->uploadDir) . $newFileName; 
        if (move_uploaded_file($fileTmpPath, $destPathAbsolute)) { return $destPathRelative; }
        else { throw new Exception('Failed to move uploaded file.'); }
    }

    private function generateSlug($title) {
        $slug = strtolower($title); $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
        $slug = preg_replace('/[\s-]+/', '-', $slug); $slug = trim($slug, '-');
        $slug = substr($slug, 0, 200); if (empty($slug)) { return 'post-' . time(); } return $slug;
    }

}