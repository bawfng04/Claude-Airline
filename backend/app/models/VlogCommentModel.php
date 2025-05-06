<?php
// backend/app/models/VlogCommentModel.php

class VlogCommentModel extends Database {

    private $table = 'vlog_comments';
    private $usersTable = 'USERS'; // Match exact table name from schema
    private $postsTable = 'vlog_posts'; // Added for join in admin list

    /**
     * Get approved comments for a specific vlog post ID.
     * Includes the commenter's name (from USERS or guest_name).
     */
    public function getApprovedCommentsByPostId($postId) {
        // Select concatenated name from USERS table or use guest_name
        $sql = "SELECT vc.*, CONCAT(u.GIVEN_NAME, ' ', u.FAMILY_NAME) as user_name
                FROM {$this->table} vc
                LEFT JOIN {$this->usersTable} u ON vc.user_id = u.ID -- Match USERS.ID column
                WHERE vc.post_id = :post_id AND vc.is_approved = 1 -- Use 1 for TRUE
                ORDER BY vc.created_at ASC";
        $this->query($sql);
        $this->bind(':post_id', $postId);
        return $this->resultSet();
    }

    /**
     * Add a new comment. Handles both logged-in and anonymous users.
     */
    public function addComment($postId, $userId, $comment, $rating = null, $guestName = null /*, $guestEmail = null */) {
        $sanitizedComment = htmlspecialchars(strip_tags($comment), ENT_QUOTES, 'UTF-8');
        $sanitizedGuestName = $userId === null ? htmlspecialchars(strip_tags($guestName ?? ''), ENT_QUOTES, 'UTF-8') : null;
        // Removed guestEmail logic for simplicity based on schema update

        // Ensure guestName is NULL if userId is provided
        if ($userId !== null) {
            $sanitizedGuestName = null;
        }

        $sql = "INSERT INTO {$this->table} (post_id, user_id, guest_name, comment, rating, is_approved)
                VALUES (:post_id, :user_id, :guest_name, :comment, :rating, 0)"; // Use 0 for FALSE
        $this->query($sql);
        $this->bind(':post_id', $postId);
        $this->bind(':user_id', $userId, $userId === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
        $this->bind(':guest_name', $sanitizedGuestName, $sanitizedGuestName === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $this->bind(':comment', $sanitizedComment);
        $this->bind(':rating', $rating, ($rating === null || $rating === 0) ? PDO::PARAM_NULL : PDO::PARAM_INT);
        return $this->execute();
    }


    // --- Admin Methods ---

    /**
     * Get all comments for admin view. Includes usernames OR guest names, and post titles/slugs.
     */
    public function getAllCommentsForAdmin($limit = 1000, $offset = 0) {
        // Select concatenated name from USERS table or use guest_name
        $sql = "SELECT
                    vc.*,
                    CONCAT(u.GIVEN_NAME, ' ', u.FAMILY_NAME) as user_name, -- Get name from USERS
                    vp.title as post_title,
                    vp.slug as post_slug
                FROM {$this->table} vc
                LEFT JOIN {$this->usersTable} u ON vc.user_id = u.ID -- Match USERS.ID column
                JOIN {$this->postsTable} vp ON vc.post_id = vp.id
                ORDER BY vc.created_at DESC LIMIT :limit OFFSET :offset";
        $this->query($sql);
        $this->bind(':limit', $limit, PDO::PARAM_INT);
        $this->bind(':offset', $offset, PDO::PARAM_INT);
        return $this->resultSet();
    }

    /**
     * Get a single comment by ID (for admin actions).
     */
    public function getCommentById($id) {
        $sql = "SELECT * FROM {$this->table} WHERE id = :id";
        $this->query($sql);
        $this->bind(':id', $id);
        return $this->single();
    }

    /**
     * Approve a comment.
     */
    public function approveComment($commentId) {
        $sql = "UPDATE {$this->table} SET is_approved = 1 WHERE id = :id"; // Use 1 for TRUE
        $this->query($sql);
        $this->bind(':id', $commentId);
        return $this->execute();
    }

    /**
     * Disapprove a comment (set it back to pending).
     */
    public function disapproveComment($commentId) {
        $sql = "UPDATE {$this->table} SET is_approved = 0 WHERE id = :id"; // Use 0 for FALSE (pending)
        $this->query($sql);
        $this->bind(':id', $commentId);
        if ($this->execute()) { // Check if execute was successful
            return $this->rowCount() > 0; // Return true if a row was affected
        }
        return false; // Return false on failure
    }

    /**
     * Delete a comment by ID.
     */
    public function deleteComment($commentId) {
        $sql = "DELETE FROM {$this->table} WHERE id = :id";
        $this->query($sql);
        $this->bind(':id', $commentId);
        return $this->execute();
    }
}
