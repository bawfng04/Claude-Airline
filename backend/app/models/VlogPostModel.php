<?php
// backend/app/models/VlogPostModel.php

class VlogPostModel extends Database {

    private $table = 'vlog_posts';
    private $commentsTable = 'vlog_comments';
    private $usersTable = 'USERS'; // Match exact table name from schema

    /**
     * Get published vlog posts with optional search and pagination.
     * Includes author name and introduction.
     */
    public function getPublishedPosts($limit, $offset, $searchTerm = null) {
        // Select user's FULLNAME and the new introduction column
        $sql = "SELECT vp.*, CONCAT(u.GIVEN_NAME, ' ', u.FAMILY_NAME) as author_name
                FROM {$this->table} vp
                LEFT JOIN {$this->usersTable} u ON vp.user_id = u.ID
                WHERE vp.status = 'published'";

        if ($searchTerm) {
            // Also search in introduction
            $sql .= " AND (vp.title LIKE :searchTerm OR vp.introduction LIKE :searchTerm OR vp.content LIKE :searchTerm)";
        }
        $sql .= " ORDER BY vp.created_at DESC LIMIT :limit OFFSET :offset";

        $this->query($sql);
        if ($searchTerm) { $this->bind(':searchTerm', '%' . $searchTerm . '%'); }
        $this->bind(':limit', $limit, PDO::PARAM_INT);
        $this->bind(':offset', $offset, PDO::PARAM_INT);
        return $this->resultSet();
    }

    /**
     * Get the total count of published vlog posts with optional search.
     */
    public function getTotalPublishedPostsCount($searchTerm = null) {
        $sql = "SELECT COUNT(*) as total FROM {$this->table} WHERE status = 'published'";
        if ($searchTerm) {
            // Also search in introduction
            $sql .= " AND (title LIKE :searchTerm OR introduction LIKE :searchTerm OR content LIKE :searchTerm)";
        }
        $this->query($sql);
        if ($searchTerm) { $this->bind(':searchTerm', '%' . $searchTerm . '%'); }
        $row = $this->single();
        return $row['total'] ?? 0;
    }

    /**
     * Get a single published vlog post by its slug.
     * Includes author name and introduction.
     */
    public function getPostBySlug($slug) {
        // Select user's FULLNAME and the new introduction column
        $sql = "SELECT vp.*, CONCAT(u.GIVEN_NAME, ' ', u.FAMILY_NAME) as author_name
                FROM {$this->table} vp
                LEFT JOIN {$this->usersTable} u ON vp.user_id = u.ID
                WHERE vp.slug = :slug AND vp.status = 'published'";
        $this->query($sql);
        $this->bind(':slug', $slug);
        return $this->single();
    }

    // --- Admin Methods ---

    /**
     * Get all vlog posts for admin view. Includes author name and introduction.
     */
    public function getAllPostsForAdmin($limit = 1000, $offset = 0) {
        // Select user's FULLNAME and the new introduction column
        $sql = "SELECT vp.*, CONCAT(u.GIVEN_NAME, ' ', u.FAMILY_NAME) as author_name
            FROM {$this->table} vp
            LEFT JOIN {$this->usersTable} u ON vp.user_id = u.ID
            ORDER BY vp.updated_at DESC LIMIT :limit OFFSET :offset";
        $this->query($sql);
        $this->bind(':limit', $limit, PDO::PARAM_INT);
        $this->bind(':offset', $offset, PDO::PARAM_INT);
        return $this->resultSet();
    }

    /**
     * Get a single vlog post by ID (for admin editing). Includes introduction.
     */
    public function getPostById($id) {
        // Select all columns including introduction
        $sql = "SELECT * FROM {$this->table} WHERE id = :id";
        $this->query($sql);
        $this->bind(':id', $id);
        return $this->single();
    }

    /**
     * Add a new vlog post. Includes introduction.
     */
    public function addPost($data) {
        if (empty($data['user_id'])) { throw new Exception("Author (user_id) is required."); }

        // Add introduction to the INSERT statement
        $sql = "INSERT INTO {$this->table} (title, slug, introduction, content, featured_image_url, user_id, status)
                VALUES (:title, :slug, :introduction, :content, :featured_image_url, :user_id, :status)";
        $this->query($sql);
        $this->bind(':title', $data['title']);
        $this->bind(':slug', $data['slug']);
        $this->bind(':introduction', $data['introduction']); // Bind new field
        $this->bind(':content', $data['content']);
        $this->bind(':featured_image_url', $data['featured_image_url']);
        $this->bind(':user_id', $data['user_id'], PDO::PARAM_INT);
        $this->bind(':status', $data['status']);
        return $this->execute();
    }

    /**
     * Update an existing vlog post. Includes introduction.
     */
    public function updatePost($id, $data) {
        $setClauses = [];
        if (isset($data['title'])) $setClauses[] = 'title = :title';
        if (isset($data['slug'])) $setClauses[] = 'slug = :slug';
        if (isset($data['introduction'])) $setClauses[] = 'introduction = :introduction'; // Add introduction
        if (isset($data['content'])) $setClauses[] = 'content = :content';
        if (array_key_exists('featured_image_url', $data)) $setClauses[] = 'featured_image_url = :featured_image_url';
        if (isset($data['status'])) $setClauses[] = 'status = :status';
        // if (isset($data['user_id'])) $setClauses[] = 'user_id = :user_id'; // If allowing author change

        if (empty($setClauses)) return true;

        $sql = "UPDATE {$this->table} SET " . implode(', ', $setClauses) . " WHERE id = :id";
        $this->query($sql);

        // Bind values
        $this->bind(':id', $id);
        if (isset($data['title'])) $this->bind(':title', $data['title']);
        if (isset($data['slug'])) $this->bind(':slug', $data['slug']);
        if (isset($data['introduction'])) $this->bind(':introduction', $data['introduction']); // Bind new field
        if (isset($data['content'])) $this->bind(':content', $data['content']);
        if (array_key_exists('featured_image_url', $data)) $this->bind(':featured_image_url', $data['featured_image_url']);
        if (isset($data['status'])) $this->bind(':status', $data['status']);
        // if (isset($data['user_id'])) $this->bind(':user_id', $data['user_id'], PDO::PARAM_INT);

        return $this->execute();
    }

    /**
     * Delete a vlog post by ID.
     * Returns true on success, false on failure.
     * @param int $id The ID of the post to delete.
     * @return bool
     */
    public function deletePost($id) {
        $sql = "DELETE FROM {$this->table} WHERE id = :id";
        $this->query($sql);
        $this->bind(':id', $id);
        // execute() returns true on success, false on failure (or throws exception caught by Database class)
        return $this->execute();
    }

    /**
     * Check if a slug already exists in the vlog_posts table.
     * Optionally allows excluding a specific post ID (useful when updating).
     * @param string $slug The slug to check.
     * @param int|null $excludeId The ID of the post to exclude from the check (optional).
     * @return bool True if the slug exists (excluding the optional ID), false otherwise.
     */
    public function slugExists($slug, $excludeId = null) {
        $sql = "SELECT COUNT(*) as count FROM {$this->table} WHERE slug = :slug";
        // If an excludeId is provided, add a condition to ignore that post
        if ($excludeId !== null) {
            $sql .= " AND id != :excludeId";
        }
        $this->query($sql);
        $this->bind(':slug', $slug);
        // Bind the excludeId only if it was provided
        if ($excludeId !== null) {
            $this->bind(':excludeId', $excludeId, PDO::PARAM_INT);
        }
        $row = $this->single(); // Get the result row
        // Return true if the count is greater than 0, meaning the slug exists
        return ($row && $row['count'] > 0);
    }

    /**
     * Calculate the average rating and count for a specific post from approved comments.
     * Returns an array ['average' => float, 'count' => int].
     * @param int $postId The ID of the post to get ratings for.
     * @return array
     */
    public function getAverageRating($postId) {
        // Query to calculate average and count of non-null ratings for approved comments
        $sql = "SELECT AVG(rating) as average_rating, COUNT(rating) as rating_count
                FROM {$this->commentsTable}
                WHERE post_id = :post_id
                AND is_approved = 1 -- Check for approved comments (using 1 for TRUE)
                AND rating IS NOT NULL
                AND rating > 0"; // Only include ratings greater than 0 in average/count
        $this->query($sql);
        $this->bind(':post_id', $postId);
        $row = $this->single(); // Fetch the calculated results

        // Return average and count if ratings exist, otherwise return 0s
        if ($row && $row['rating_count'] > 0) {
            return [
                'average' => round((float)$row['average_rating'], 1), // Round to one decimal place
                'count' => (int)$row['rating_count']
            ];
        } else {
            // Return default values if no valid ratings found
            return ['average' => 0.0, 'count' => 0];
        }
    }

    public function getLastError() {
        return $this->error;
    }
}
