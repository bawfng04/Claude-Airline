<?php

class VlogCommentModel extends Database {

    private $table = 'vlog_comments';
    private $usersTable = 'USERS';
    private $postsTable = 'vlog_posts';
    private $postModelInstance; 

    private function getPostModel() {
        if ($this->postModelInstance === null) {
            require_once __DIR__ . '/VlogPostModel.php'; 
            $this->postModelInstance = new VlogPostModel();
        }
        return $this->postModelInstance;
    }

    public function getApprovedCommentsByPostId($postId) {
        $sql = "SELECT vc.*, CONCAT(u.GIVEN_NAME, ' ', u.FAMILY_NAME) as user_name, u.image as user_avatar_url
                FROM {$this->table} vc
                LEFT JOIN {$this->usersTable} u ON vc.user_id = u.ID
                WHERE vc.post_id = :post_id AND vc.is_approved = 1
                ORDER BY vc.created_at ASC";
        $this->query($sql);
        $this->bind(':post_id', $postId);
        return $this->resultSet();
    }

    public function addComment($postId, $userId, $comment, $rating = null, $guestName = null, $isApproved = 0) {
        $sanitizedComment = htmlspecialchars(strip_tags($comment), ENT_QUOTES, 'UTF-8');
        $sanitizedGuestName = ($userId === null && $guestName !== null) ? htmlspecialchars(strip_tags($guestName), ENT_QUOTES, 'UTF-8') : null;

        $sql = "INSERT INTO {$this->table} (post_id, user_id, guest_name, comment, rating, is_approved)
                VALUES (:post_id, :user_id, :guest_name, :comment, :rating, :is_approved)"; 
        $this->query($sql);
        $this->bind(':post_id', $postId, PDO::PARAM_INT);
        $this->bind(':user_id', $userId, $userId === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
        $this->bind(':guest_name', $sanitizedGuestName, $sanitizedGuestName === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $this->bind(':comment', $sanitizedComment);
        $this->bind(':rating', $rating, ($rating === null || $rating === 0) ? PDO::PARAM_NULL : PDO::PARAM_INT);
        $this->bind(':is_approved', $isApproved, PDO::PARAM_INT);
        
        if ($this->execute()) {
            if ($isApproved == 1 && ($rating !== null && $rating > 0)) {
                $this->getPostModel()->updatePostRatings($postId);
            }
            return true;
        }
        return false;
    }

    public function updateUserComment($commentId, $userId, $commentText) {
        $sanitizedComment = htmlspecialchars(strip_tags($commentText), ENT_QUOTES, 'UTF-8');
        $sql = "UPDATE {$this->table} SET comment = :comment
                WHERE id = :comment_id AND user_id = :user_id AND is_approved = 1";
        $this->query($sql);
        $this->bind(':comment', $sanitizedComment);
        $this->bind(':comment_id', $commentId, PDO::PARAM_INT);
        $this->bind(':user_id', $userId, PDO::PARAM_INT);
        
        if ($this->execute()) {
            return $this->rowCount() > 0;
        }
        return false;
    }

    public function getAllCommentsForAdmin($limit = 1000, $offset = 0) {
        $sql = "SELECT
                        vc.*,
                        CONCAT(u.GIVEN_NAME, ' ', u.FAMILY_NAME) as user_name, 
                        u.image as user_avatar_url,
                        vp.title as post_title,
                        vp.slug as post_slug
                FROM {$this->table} vc
                LEFT JOIN {$this->usersTable} u ON vc.user_id = u.ID 
                JOIN {$this->postsTable} vp ON vc.post_id = vp.id
                ORDER BY vc.is_approved ASC, vc.created_at DESC 
                LIMIT :limit OFFSET :offset";
        $this->query($sql);
        $this->bind(':limit', $limit, PDO::PARAM_INT);
        $this->bind(':offset', $offset, PDO::PARAM_INT);
        return $this->resultSet();
    }

    public function getCommentById($id) {
        $sql = "SELECT * FROM {$this->table} WHERE id = :id";
        $this->query($sql);
        $this->bind(':id', $id);
        return $this->single();
    }

    public function approveComment($commentId) {
        $sql = "UPDATE {$this->table} SET is_approved = 1 WHERE id = :id"; 
        $this->query($sql);
        $this->bind(':id', $commentId);
        if ($this->execute() && $this->rowCount() > 0) {
            $comment = $this->getCommentById($commentId);
            if ($comment && $comment['post_id']) {
                $this->getPostModel()->updatePostRatings($comment['post_id']);
            }
            return true;
        }
        return false;
    }

    public function disapproveComment($commentId) {
        $sql = "UPDATE {$this->table} SET is_approved = 0 WHERE id = :id"; 
        $this->query($sql);
        $this->bind(':id', $commentId);
        if ($this->execute() && $this->rowCount() > 0) {
            $comment = $this->getCommentById($commentId);
            if ($comment && $comment['post_id']) {
                $this->getPostModel()->updatePostRatings($comment['post_id']);
            }
            return true;
        }
        return false; 
    }

    public function deleteComment($commentId) {
        $comment = $this->getCommentById($commentId);
        $postId = $comment ? $comment['post_id'] : null;
        $sql = "DELETE FROM {$this->table} WHERE id = :id";
        $this->query($sql);
        $this->bind(':id', $commentId);
        if ($this->execute()) {
            if ($postId) {
                $this->getPostModel()->updatePostRatings($postId);
            }
            return true;
        }
        return false;
    }

    public function likeComment($commentId) {
        $sql = "UPDATE {$this->table} SET likes = likes + 1 WHERE id = :id";
        $this->query($sql);
        $this->bind(':id', $commentId);
        if ($this->execute()) {
            return $this->rowCount() > 0;
        }
        return false;
    }
}