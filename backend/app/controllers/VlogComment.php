<?php
require_once __DIR__ . '/../helpers/JwtHelper.php';
require_once __DIR__ . '/../middlewares/authMiddleware.php';

class VlogComment extends Controller {

    private $commentModel;
    private $postModel;

    public function __construct() {
        $this->commentModel = $this->model('VlogCommentModel');
        $this->postModel = $this->model('VlogPostModel');
        if (session_status() === PHP_SESSION_NONE) { session_start(); }
    }

    public function index() {
        try {
            $comments = $this->commentModel->getAllCommentsForAdmin();
            $data = [
                'pageTitle' => 'Vlog Comments Management',
                'vlogComments' => $comments ?: []
            ];
            $this->view('vlog_comments_manage', $data);
        } catch (Exception $e) {
            die('Error loading vlog comments: ' . $e->getMessage());
        }
    }

    public function approve($commentId = null) {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $commentId = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
        }

        if (!filter_var($commentId, FILTER_VALIDATE_INT) || $commentId <= 0) {
            $_SESSION['flash_error'] = 'Invalid Comment ID for approval.';
            header('Location: ' . base_url('vlogComment')); exit;
        }

        try {
            if ($this->commentModel->approveComment($commentId)) {
                $_SESSION['flash_success'] = 'Comment approved successfully.';
            } else {
                $_SESSION['flash_error'] = 'Failed to approve comment.';
            }
        } catch (Exception $e) {
            $_SESSION['flash_error'] = 'Error approving comment: ' . $e->getMessage();
        }
        header('Location: ' . base_url('vlogComment'));
        exit;
    }
    
    public function disapprove($commentId = null) {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $commentId = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
        }

        if (!filter_var($commentId, FILTER_VALIDATE_INT) || $commentId <= 0) {
            $_SESSION['flash_error'] = 'Invalid Comment ID for disapproval.';
            header('Location: ' . base_url('vlogComment')); 
            exit;
        }

        try {
            if ($this->commentModel->disapproveComment($commentId)) {
                $_SESSION['flash_success'] = 'Comment disapproved and set to pending.';
            } else {
                $_SESSION['flash_error'] = 'Failed to disapprove comment.';
            }
        } catch (Exception $e) {
            $_SESSION['flash_error'] = 'Error disapproving comment: ' . $e->getMessage();
        }
        header('Location: ' . base_url('vlogComment'));
        exit;
    }

    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: ' . base_url('vlogComment')); exit; }
        $commentId = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
        if (!$commentId) { $_SESSION['flash_error'] = 'Invalid Comment ID for deletion.'; header('Location: ' . base_url('vlogComment')); exit; }

        try {
            if ($this->commentModel->deleteComment($commentId)) {
                $_SESSION['flash_success'] = 'Comment deleted successfully.';
            } else {
                $_SESSION['flash_error'] = 'Failed to delete comment.';
            }
        } catch (Exception $e) {
            $_SESSION['flash_error'] = 'Error deleting comment: ' . $e->getMessage();
        }
        header('Location: ' . base_url('vlogComment'));
        exit;
    }

    public function listApproved($postId = null) {
        if (!filter_var($postId, FILTER_VALIDATE_INT) || $postId <= 0) { return $this->jsonResponse(400, 'Invalid Post ID.'); }
        try {
            $comments = $this->commentModel->getApprovedCommentsByPostId($postId);
            $this->jsonResponse(200, 'Success', $comments ?: []);
        } catch (Exception $e) { $this->jsonResponse(500, 'Error fetching comments', ['error' => $e->getMessage()]); }
    }

    public function createComment($postId = null) {
        if (!filter_var($postId, FILTER_VALIDATE_INT) || $postId <= 0) {
            return $this->jsonResponse(400, 'Invalid Post ID.');
        }
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return $this->jsonResponse(405, 'Method Not Allowed.');
        }

        $data = json_decode(file_get_contents('php://input'), true);

        if (json_last_error() !== JSON_ERROR_NONE || empty($data['comment']) || trim($data['comment']) === '') {
            return $this->jsonResponse(400, 'Comment text cannot be empty or invalid JSON.');
        }
        $rating = null;
        if (isset($data['rating'])) {
            $ratingValue = $data['rating'];
            if ($ratingValue !== null && $ratingValue !== 0) {
                $rating = filter_var($ratingValue, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 5]]);
                if ($rating === false) { return $this->jsonResponse(400, 'Invalid rating value (must be 1-5 or null/0).'); }
            } elseif ($ratingValue === 0) { $rating = 0; }
        }

        $userId = null;
        $guestName = null;
        $isApproved = 0; 

        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['HTTP_X_AUTHORIZATION'] ?? null);
        if ($authHeader) {
            try {
                $authPayload = authMiddleware(false); 
                if ($authPayload && isset($authPayload->id)) {
                    $userId = $authPayload->id;
                    $isApproved = 1; 
                    $guestName = null; 
                }
            } catch (Exception $e) {
            }
        }

        if ($userId === null) { 
            if (empty($data['guest_name']) || trim($data['guest_name']) === '') {
                return $this->jsonResponse(400, 'Guest name is required for anonymous comments.');
            }
            $guestName = trim($data['guest_name']);
        }
        
        try {
            if ($this->commentModel->addComment($postId, $userId, $data['comment'], $rating, $guestName, $isApproved)) {
                 $message = $isApproved ? 'Comment posted successfully.' : 'Comment submitted for approval.';
                $this->jsonResponse(201, $message);
            } else { throw new Exception('Failed to save comment.'); }
        } catch (Exception $e) {
            $this->jsonResponse(500, 'Error submitting comment: ' . $e->getMessage());
        }
    }

    public function updateComment($commentId = null) {
        if (!filter_var($commentId, FILTER_VALIDATE_INT) || $commentId <= 0) {
            return $this->jsonResponse(400, 'Invalid Comment ID.');
        }
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            return $this->jsonResponse(405, 'Method Not Allowed.');
        }

        $data = json_decode(file_get_contents('php://input'), true);
        if (json_last_error() !== JSON_ERROR_NONE || !isset($data['comment']) || trim($data['comment']) === '') {
            return $this->jsonResponse(400, 'Comment text cannot be empty or invalid JSON.');
        }

        $userId = null;
        try {
            $authPayload = authMiddleware(); 
            if ($authPayload && isset($authPayload->id)) {
                $userId = $authPayload->id;
            } else {
                return $this->jsonResponse(401, 'Authentication required.');
            }
        } catch (Exception $e) {
            return $this->jsonResponse(401, 'Authentication failed: ' . $e->getMessage());
        }

        try {
            $commentToUpdate = $this->commentModel->getCommentById($commentId);
            if (!$commentToUpdate) {
                return $this->jsonResponse(404, 'Comment not found.');
            }
            if ($commentToUpdate['user_id'] != $userId) {
                return $this->jsonResponse(403, 'You are not authorized to edit this comment.');
            }
            if (!$commentToUpdate['is_approved']) {
                return $this->jsonResponse(403, 'Cannot edit an unapproved comment.');
            }

            if ($this->commentModel->updateUserComment($commentId, $userId, $data['comment'])) {
                $this->jsonResponse(200, 'Comment updated successfully.');
            } else {
                throw new Exception('Failed to update comment in database.');
            }
        } catch (Exception $e) {
            $this->jsonResponse(500, 'Error updating comment: ' . $e->getMessage());
        }
    }
    
    public function getCommentForEdit($commentId = null) {
        if (!filter_var($commentId, FILTER_VALIDATE_INT) || $commentId <= 0) {
            return $this->jsonResponse(400, 'Invalid Comment ID.');
        }
         $userId = null;
        try {
            $authPayload = authMiddleware();
            if ($authPayload && isset($authPayload->id)) {
                $userId = $authPayload->id;
            } else {
                return $this->jsonResponse(401, 'Authentication required.');
            }
        } catch (Exception $e) {
            return $this->jsonResponse(401, 'Authentication failed: ' . $e->getMessage());
        }

        try {
            $comment = $this->commentModel->getCommentById($commentId);
            if (!$comment) {
                return $this->jsonResponse(404, 'Comment not found.');
            }
            if ($comment['user_id'] != $userId || !$comment['is_approved']) {
                 return $this->jsonResponse(403, 'You are not authorized to fetch this comment for editing or it is not approved.');
            }
            $this->jsonResponse(200, 'Comment fetched', ['comment' => $comment['comment']]);
        } catch (Exception $e) {
            $this->jsonResponse(500, 'Error fetching comment: ' . $e->getMessage());
        }
    }

    public function adminList() {
        try {
            $comments = $this->commentModel->getAllCommentsForAdmin(); 
            $this->jsonResponse(200, 'Admin comments fetched', $comments ?: []);
        } catch (Exception $e) {
            $this->jsonResponse(500, 'Error fetching admin comments', ['error_message' => $e->getMessage()]);
        }
    }

    public function adminApprove($commentId = null) {
        if (!filter_var($commentId, FILTER_VALIDATE_INT) || $commentId <= 0) {
            return $this->jsonResponse(400, 'Invalid Comment ID.');
        }
        try {
            if ($this->commentModel->approveComment($commentId)) { 
                $this->jsonResponse(200, 'Comment approved successfully.');
            } else {
                $this->jsonResponse(500, 'Failed to approve comment.');
            }
        } catch (Exception $e) {
            $this->jsonResponse(500, 'Error approving comment: ' . $e->getMessage());
        }
    }

    public function adminDelete($commentId = null) {
        if (!filter_var($commentId, FILTER_VALIDATE_INT) || $commentId <= 0) {
            return $this->jsonResponse(400, 'Invalid Comment ID.');
        }
        try {
            if ($this->commentModel->deleteComment($commentId)) { 
                $this->jsonResponse(200, 'Comment deleted successfully.');
            } else {
                $this->jsonResponse(500, 'Failed to delete comment.');
            }
        } catch (Exception $e) {
            $this->jsonResponse(500, 'Error deleting comment: ' . $e->getMessage());
        }
    }

    public function like($commentId = null) {
        if (!filter_var($commentId, FILTER_VALIDATE_INT) || $commentId <= 0) {
            return $this->jsonResponse(400, 'Invalid Comment ID.');
        }
        if ($this->commentModel->likeComment($commentId)) {
            $this->jsonResponse(200, 'Comment liked successfully.');
        } else {
            $this->jsonResponse(500, 'Failed to like comment or already liked/error.');
        }
    }
}