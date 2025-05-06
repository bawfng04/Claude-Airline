<?php

define('BASE_URL', 'http://localhost');

class VlogComment extends Controller {

    private $commentModel;
    private $postModel;

    public function __construct() {
        $this->commentModel = $this->model('VlogCommentModel');
        $this->postModel = $this->model('VlogPostModel');
        if (session_status() === PHP_SESSION_NONE) { session_start(); }
    }

    /**
     * Renamed from manage(): Loads the admin management view for vlog comments.
     * Default action for this controller.
     * Accessed via URL: /vlogComment or /vlogComment/index
     */
    public function index() {
        // if (!$this->isAdmin()) { header('Location: ' . BASE_URL . '/admin/login'); exit; }

        try {
            $comments = $this->commentModel->getAllCommentsForAdmin();
            $data = [
                'pageTitle' => 'Vlog Comments Management',
                'vlogComments' => $comments ?: []
            ];
            $this->view('vlog_comments_manage', $data); // Load the PHP view
        } catch (Exception $e) {
            die('Error loading vlog comments: ' . $e->getMessage());
        }
    }

    /**
     * Handles approving a comment.
     * Accessed via URL: /vlogComment/approve/{commentId} (if using GET link)
     * OR /vlogComment/approve (if using POST form)
     */
    public function approve($commentId = null) {
        // if (!$this->isAdmin()) { header('Location: ' . BASE_URL . '/admin/login'); exit; }

        // Get ID from POST if form used, otherwise from URL segment if GET link used
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $commentId = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
        }

        if (!filter_var($commentId, FILTER_VALIDATE_INT) || $commentId <= 0) {
            $_SESSION['flash_error'] = 'Invalid Comment ID for approval.';
            header('Location: ' . BASE_URL . '/vlogComment'); exit;
        }

        try {
            // Optional: check if comment exists and is pending first
            if ($this->commentModel->approveComment($commentId)) {
                $_SESSION['flash_success'] = 'Comment approved successfully.';
            } else {
                $_SESSION['flash_error'] = 'Failed to approve comment.';
            }
        } catch (Exception $e) {
            $_SESSION['flash_error'] = 'Error approving comment: ' . $e->getMessage();
        }
        header('Location: ' . BASE_URL . '/vlogComment'); // Redirect back to index
        exit;
    }
    
    /**
     * Handles disapproving an approved comment.
     * Sets the comment status back to pending (is_approved = 0).
     * Accessed via URL: /vlogComment/disapprove (if using POST form)
     */
    public function disapprove($commentId = null) {
        // Optional: Add admin check if (!$this->isAdmin()) { header('Location: ' . BASE_URL . '/admin/login'); exit; }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $commentId = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
        }

        if (!filter_var($commentId, FILTER_VALIDATE_INT) || $commentId <= 0) {
            $_SESSION['flash_error'] = 'Invalid Comment ID for disapproval.';
            header('Location: ' . BASE_URL . '/vlogComment'); 
            exit;
        }

        try {
            // You will need to create this method in your VlogCommentModel
            if ($this->commentModel->disapproveComment($commentId)) {
                $_SESSION['flash_success'] = 'Comment disapproved and set to pending.';
            } else {
                $_SESSION['flash_error'] = 'Failed to disapprove comment.';
            }
        } catch (Exception $e) {
            $_SESSION['flash_error'] = 'Error disapproving comment: ' . $e->getMessage();
        }
        header('Location: ' . BASE_URL . '/vlogComment'); // Redirect back to index
        exit;
    }

    /**
     * Handles deleting a comment from the admin modal form.
     * Accessed via URL: /vlogComment/delete (Form POST target)
     */
    public function delete() {
        // if (!$this->isAdmin()) { header('Location: ' . BASE_URL . '/admin/login'); exit; }
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: ' . BASE_URL . '/vlogComment'); exit; }

        $commentId = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);

        if (!$commentId) { $_SESSION['flash_error'] = 'Invalid Comment ID for deletion.'; header('Location: ' . BASE_URL . '/vlogComment'); exit; }

        try {
            if ($this->commentModel->deleteComment($commentId)) {
                $_SESSION['flash_success'] = 'Comment deleted successfully.';
            } else {
                $_SESSION['flash_error'] = 'Failed to delete comment.';
            }
        } catch (Exception $e) {
            $_SESSION['flash_error'] = 'Error deleting comment: ' . $e->getMessage();
        }
        header('Location: ' . BASE_URL . '/vlogComment'); // Redirect back to index
        exit;
    }



    // --- API Methods (Keep if needed for React Client View) ---
    /**
     * API: List approved comments for a specific post ID.
     * GET /vlogComment/listApproved/{postId}
     */
    public function listApproved($postId = null) {
        if (!filter_var($postId, FILTER_VALIDATE_INT) || $postId <= 0) { return $this->jsonResponse(400, 'Invalid Post ID.'); }
        try {
            $comments = $this->commentModel->getApprovedCommentsByPostId($postId);
            $this->jsonResponse(200, 'Success', $comments ?: []); // Return empty array if no comments
        } catch (Exception $e) { $this->jsonResponse(500, 'Error fetching comments', $e->getMessage()); }
    }

    /**
     * User/Guest: Create a new comment. Handles logged-in and anonymous users.
     * Called via URL: /vlogComment/createComment/{postId} (expects POST with JSON body)
     */
    public function createComment($postId = null) {
        if (!filter_var($postId, FILTER_VALIDATE_INT) || $postId <= 0) {
            return $this->jsonResponse(400, 'Invalid Post ID.');
        }
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return $this->jsonResponse(405, 'Method Not Allowed.');
        }

        $data = json_decode(file_get_contents('php://input'), true);

        // --- Basic Validation ---
        if (empty($data['comment']) || trim($data['comment']) === '') {
            return $this->jsonResponse(400, 'Comment text cannot be empty.');
        }
        $rating = null;
        if (isset($data['rating'])) {
            $ratingValue = $data['rating'];
            if ($ratingValue !== null && $ratingValue !== 0) {
                $rating = filter_var($ratingValue, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 5]]);
                if ($rating === false) { return $this->jsonResponse(400, 'Invalid rating value (must be 1-5 or null/0).'); }
            } // Allow 0 or null to pass through if needed, handled by model binding
            elseif ($ratingValue === 0) { $rating = 0; } // Explicitly allow 0 if desired
        }

        // --- Determine User Type ---
        $userId = null;
        $guestName = null;
        $guestEmail = null;

        if (isset($_SESSION['user_id'])) {
            // --- Logged-in User ---
            $userId = $_SESSION['user_id'];
        } else {
            // --- Anonymous User ---
            if (empty($data['guest_name']) || trim($data['guest_name']) === '') {
                return $this->jsonResponse(400, 'Guest name is required for anonymous comments.');
            }
            $guestName = trim($data['guest_name']);
            // Guest Email is optional, validate if provided
            if (!empty($data['guest_email'])) {
                $guestEmail = filter_var(trim($data['guest_email']), FILTER_VALIDATE_EMAIL);
                if ($guestEmail === false) {
                    return $this->jsonResponse(400, 'Invalid guest email format provided.');
                }
            }
        }

        // --- Add Comment ---
        try {
            // Optional: Check if post exists?
            // $post = $this->postModel->getPostById($postId); if (!$post) { ... }

            if ($this->commentModel->addComment($postId, $userId, $data['comment'], $rating, $guestName, $guestEmail)) {
                $this->jsonResponse(201, 'Comment submitted for approval.');
            } else { throw new Exception('Failed to save comment.'); }
        } catch (Exception $e) {
            $this->jsonResponse(500, 'Error submitting comment', $e->getMessage());
        }
    }

    // /**
    //  * Helper for admin check (example)
    //  */
    // private function isAdmin() {
    //     // Replace with your actual admin check logic
    //     return (isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin');
    // }

}