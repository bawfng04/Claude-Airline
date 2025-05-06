<?php

define('BASE_URL', 'http://localhost');

class VlogPost extends Controller {

    private $postModel;
    private $uploadDir = 'uploads/vlog/'; // Relative to public directory
    private $publicDir;

    public function __construct() {
        $this->postModel = $this->model('VlogPostModel');
        $this->publicDir = realpath(__DIR__ . '/../../public/');
        $absoluteUploadDir = $this->publicDir . DIRECTORY_SEPARATOR . $this->uploadDir;
        if (!file_exists($absoluteUploadDir)) {
            @mkdir($absoluteUploadDir, 0775, true);
        }
        // Start session if not already started (needed for auth checks & flash messages)
        if (session_status() === PHP_SESSION_NONE) { session_start(); }
    }

    /**
     * Renamed from manage(): Loads the admin management view for vlog posts.
     * Default action for this controller.
     * Accessed via URL: /vlogPost or /vlogPost/index
     */
    public function index() {

        try {
            $posts = $this->postModel->getAllPostsForAdmin(); // Fetch data for the view
            $data = [
                'pageTitle' => 'Vlog Posts Management',
                'vlogPosts' => $posts ?: [] // Pass posts to the view
            ];
            // Load the PHP view file
            $this->view('vlog_posts_manage', $data); // Assumes view loader exists in base Controller
        } catch (Exception $e) {
            // Handle error loading data - maybe show an error view
            // You could pass an error message to a generic error view
            die('Error loading vlog posts: ' . $e->getMessage());
        }
    }

    /**
     * Handles saving (adding or updating) a vlog post from the admin modal form.
     * Accessed via URL: /vlogPost/save (Form POST target)
     */
    public function save() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: ' . BASE_URL . '/vlogPost'); exit; }

        $postId = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
        $title = filter_input(INPUT_POST, 'title', FILTER_SANITIZE_SPECIAL_CHARS);
        $content = $_POST['content']; // Needs proper HTML sanitization/purification!
        $status = filter_input(INPUT_POST, 'status', FILTER_SANITIZE_SPECIAL_CHARS);
        $removeCurrentImage = filter_input(INPUT_POST, 'remove_featured_image', FILTER_VALIDATE_BOOLEAN);

        $data = [ 'title' => trim($title), 'content' => $content, 'status' => ($status === 'published' || $status === 'draft') ? $status : 'draft' ];

        // --- Validation ---
        if (empty($data['title']) || empty($data['content']) || empty($data['status'])) {
            $_SESSION['flash_error'] = 'Title, Content, and Status are required.'; // Example flash message
            header('Location: ' . BASE_URL . '/vlogPost'); exit;
        }

        // --- Slug Generation ---
        $needsSlugUpdate = false;
        if ($postId) { // Editing
            $existingPost = $this->postModel->getPostById($postId);
            if ($existingPost && $existingPost['title'] !== $data['title']) { $needsSlugUpdate = true; }
        } else { $needsSlugUpdate = true; } // Creating

        if ($needsSlugUpdate) {
            $slug = $this->generateSlug($data['title']); $originalSlug = $slug; $counter = 1;
            while ($this->postModel->slugExists($slug, $postId ?: null)) { $slug = $originalSlug . '-' . $counter++; }
            $data['slug'] = $slug;
        }

        // --- Image Handling ---
        $currentImagePath = $postId ? ($this->postModel->getPostById($postId)['featured_image_url'] ?? null) : null;
        $newImagePathRelative = null;

        try {
            if (isset($_FILES['featured_image']) && $_FILES['featured_image']['error'] === UPLOAD_ERR_OK) {
                $newImagePathRelative = $this->handleImageUpload('featured_image');
                $data['featured_image_url'] = $newImagePathRelative;
            } elseif ($postId && $removeCurrentImage) {
                $data['featured_image_url'] = null;
            } elseif ($postId && !$removeCurrentImage) {
                unset($data['featured_image_url']);
            } else { $data['featured_image_url'] = null; }

            // --- Save to DB ---
            $success = false;
            if ($postId) { $success = $this->postModel->updatePost($postId, $data); }
            else {
                $data['author_id'] = $_SESSION['user_id'] ?? null;
                if (empty($data['author_id'])) throw new Exception("Admin user ID not found.");
                $success = $this->postModel->addPost($data);
            }

            if ($success) {
                // --- Delete old image if needed ---
                $imageWasReplaced = $newImagePathRelative !== null;
                $imageWasRemoved = $postId && $removeCurrentImage && array_key_exists('featured_image_url', $data) && $data['featured_image_url'] === null;
                if ($currentImagePath && ($imageWasReplaced || $imageWasRemoved)) {
                    if (file_exists($this->publicDir . $currentImagePath)) { @unlink($this->publicDir . $currentImagePath); }
                }
                $_SESSION['flash_success'] = 'Vlog post saved successfully.'; // Example flash message
            } else {
                $_SESSION['flash_error'] = 'Failed to save vlog post.'; // Example flash message
                if ($newImagePathRelative && file_exists($this->publicDir . $newImagePathRelative)) { @unlink($this->publicDir . $newImagePathRelative); }
            }

        } catch (Exception $e) {
            $_SESSION['flash_error'] = 'Error saving post: ' . $e->getMessage(); // Example flash message
            if ($newImagePathRelative && file_exists($this->publicDir . $newImagePathRelative)) { @unlink($this->publicDir . $newImagePathRelative); }
        }
        header('Location: ' . BASE_URL . '/vlogPost'); // Redirect back to index
        exit;
    }

    /**
     * Handles deleting a vlog post from the admin modal form.
     * Accessed via URL: /vlogPost/delete (Form POST target)
     */
    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: ' . BASE_URL . '/vlogPost'); exit; }
        $postId = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
        if (!$postId) { $_SESSION['flash_error'] = 'Invalid Post ID.'; header('Location: ' . BASE_URL . '/vlogPost'); exit; }

        try {
            $post = $this->postModel->getPostById($postId);
            if ($post) {
                $imagePath = $post['featured_image_url'];
                // Store the result of the delete operation
                $deleted = $this->postModel->deletePost($postId);

                if ($deleted) {
                    if ($imagePath && file_exists($this->publicDir . $imagePath)) { @unlink($this->publicDir . $imagePath); }
                    $_SESSION['flash_success'] = 'Vlog post deleted successfully.';
                } else {
                    // Check if there was a PDO error logged by the Database class
                    // Note: This relies on the Database class storing the error message, which it might not do reliably. Checking logs is better.
                    $dbError = $this->postModel->getLastError(); // Assuming you add a getLastError() method to Database.php
                    $_SESSION['flash_error'] = 'Failed to delete vlog post from database.' . ($dbError ? ' DB Error: '.$dbError : '');
                }
            } else { $_SESSION['flash_error'] = 'Post not found.'; }
        } catch (Exception $e) {
            // This catches exceptions potentially thrown before the model call or if the model re-throws
            error_log('Exception during post deletion: ' . $e->getMessage()); // Log it
            $_SESSION['flash_error'] = 'Error deleting post: ' . $e->getMessage();
        }
        header('Location: ' . BASE_URL . '/vlogPost');
        exit;
    }


    // --- API Methods (Keep if needed for React Client View) ---

    /**
     * API: List published vlog posts
     * GET /vlogPost/listPublished?page=X&limit=Y&search=Z
     */
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

    /**
     * API: Show a single published vlog post by slug.
     * GET /vlogPost/show/{slug}
     */
    public function show($slug = null) {
        if (empty($slug)) { return $this->jsonResponse(400, 'Post slug not specified.'); }
        $sanitizedSlug = filter_var($slug, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        try {
            $post = $this->postModel->getPostBySlug($sanitizedSlug);
            if ($post) {
                $ratingInfo = $this->postModel->getAverageRating($post['id']);
                $post['average_rating'] = $ratingInfo['average'] ?? 0;
                $post['rating_count'] = $ratingInfo['count'] ?? 0;
                $this->jsonResponse(200, 'Success', $post);
            } else { $this->jsonResponse(404, 'Vlog post not found.'); }
        } catch (Exception $e) { $this->jsonResponse(500, 'Error fetching post', $e->getMessage()); }
    }

    // --- Helper Methods ---

    /**
     * Helper to handle image upload.
     * Returns the relative path on success or throws Exception on failure.
     */
    private function handleImageUpload($fileInputName) {
        if (!isset($_FILES[$fileInputName]) || $_FILES[$fileInputName]['error'] !== UPLOAD_ERR_OK) {
             if ($_FILES[$fileInputName]['error'] == UPLOAD_ERR_NO_FILE) return null; // No file is not an error here
            throw new Exception('File upload error: ' . ($_FILES[$fileInputName]['error'] ?? 'Unknown error'));
        }

        $fileTmpPath = $_FILES[$fileInputName]['tmp_name'];
        $fileName = basename($_FILES[$fileInputName]['name']); // Sanitize filename
        $fileSize = $_FILES[$fileInputName]['size'];
        $fileType = $_FILES[$fileInputName]['type'];
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        // Basic validation
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $maxFileSize = 5 * 1024 * 1024; // 5 MB

        if (!in_array($fileExtension, $allowedExtensions)) {
            throw new Exception('Invalid file type. Allowed: ' . implode(', ', $allowedExtensions));
        }
        if ($fileSize > $maxFileSize) {
            throw new Exception('File size exceeds limit (Max 5MB).');
        }
        if (!getimagesize($fileTmpPath)) { // Verify it's actually an image
            throw new Exception('Uploaded file is not a valid image.');
        }


        // Create unique filename
        $newFileName = uniqid('vlog_', true) . '.' . $fileExtension;
        $destPathAbsolute = $this->publicDir . DIRECTORY_SEPARATOR . $this->uploadDir . $newFileName;
        $destPathRelative = '/' . str_replace('\\', '/', $this->uploadDir) . $newFileName; // Relative path for DB/URL


        if (move_uploaded_file($fileTmpPath, $destPathAbsolute)) {
             // Optionally add chmod if needed, though web server should handle permissions ideally
             // chmod($destPathAbsolute, 0644);
            return $destPathRelative;
        } else {
            throw new Exception('Failed to move uploaded file.');
        }
    }

    /**
     * Helper to generate a URL-friendly slug from a title.
     */
    private function generateSlug($title) {
        // Lowercase
        $slug = strtolower($title);
        // Remove non-alphanumeric characters (except hyphens and spaces)
        $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
        // Replace spaces and multiple hyphens with a single hyphen
        $slug = preg_replace('/[\s-]+/', '-', $slug);
        // Trim hyphens from start/end
        $slug = trim($slug, '-');
        // Limit length (optional)
        $slug = substr($slug, 0, 200); // Max 200 chars for slug
        if (empty($slug)) { // Handle empty slugs
            return 'post-' . time();
        }
        return $slug;
    }

}