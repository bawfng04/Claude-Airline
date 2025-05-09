<?php

class VlogPostModel extends Database {

    private $table = 'vlog_posts';
    private $commentsTable = 'vlog_comments';
    private $usersTable = 'USERS';

    public function getPublishedPosts($limit, $offset, $searchTerm = null) {
        $sql = "SELECT vp.*, CONCAT(u.GIVEN_NAME, ' ', u.FAMILY_NAME) as author_name
                FROM {$this->table} vp
                LEFT JOIN {$this->usersTable} u ON vp.user_id = u.ID
                WHERE vp.status = 'published'";

        if (!empty($searchTerm)) {
            // MODIFIED FOR TESTING: Only search in title
            $sql .= " AND (LOWER(vp.title) LIKE :lowerSearchTerm)";
        }
        $sql .= " ORDER BY vp.created_at DESC LIMIT :limit OFFSET :offset";

        $this->query($sql);

        if (!empty($searchTerm)) {
            $this->bind(':lowerSearchTerm', '%' . strtolower($searchTerm) . '%');
        }
        $this->bind(':limit', $limit, PDO::PARAM_INT);
        $this->bind(':offset', $offset, PDO::PARAM_INT);

        error_log("Executing SQL for getPublishedPosts: " . $sql);
        if (!empty($searchTerm)) {
            error_log("With search term: " . $searchTerm . " (bound as: " . '%' . strtolower($searchTerm) . '%' . ")");
        }
        error_log("Limit: " . $limit . ", Offset: " . $offset);


        $results = $this->resultSet();

        if ($results) {
            foreach ($results as &$post) {
                if (!empty($post['gallery_images'])) {
                    $decoded_images = json_decode($post['gallery_images'], true);
                    $post['gallery_images'] = (json_last_error() === JSON_ERROR_NONE && is_array($decoded_images)) ? $decoded_images : [];
                } else {
                    $post['gallery_images'] = [];
                }
            }
            unset($post);
        }
        return $results;
    }

    public function getTotalPublishedPostsCount($searchTerm = null) {
        $sql = "SELECT COUNT(*) as total FROM {$this->table} vp WHERE vp.status = 'published'"; // Alias vp used here

        if (!empty($searchTerm)) {
            // MODIFIED FOR TESTING: Only search in title
            $sql .= " AND (LOWER(vp.title) LIKE :lowerSearchTerm)";
        }
        $this->query($sql);
        if (!empty($searchTerm)) {
            $this->bind(':lowerSearchTerm', '%' . strtolower($searchTerm) . '%');
        }

        error_log("Executing SQL for getTotalPublishedPostsCount: " . $sql);
        if (!empty($searchTerm)) {
            error_log("With search term for count: " . $searchTerm . " (bound as: " . '%' . strtolower($searchTerm) . '%' . ")");
        }

        $row = $this->single();
        return $row['total'] ?? 0;
    }

    public function getPostBySlug($slug) {
        $sql = "SELECT vp.*, CONCAT(u.GIVEN_NAME, ' ', u.FAMILY_NAME) as author_name
                FROM {$this->table} vp
                LEFT JOIN {$this->usersTable} u ON vp.user_id = u.ID
                WHERE vp.slug = :slug AND vp.status = 'published'";
        $this->query($sql);
        $this->bind(':slug', $slug);
        $post = $this->single();

        if ($post) {
             if (!empty($post['gallery_images'])) {
                $decoded_images = json_decode($post['gallery_images'], true);
                $post['gallery_images'] = (json_last_error() === JSON_ERROR_NONE && is_array($decoded_images)) ? $decoded_images : [];
            } else {
                $post['gallery_images'] = [];
            }
            $ratingInfo = $this->getAverageRating($post['id']);
            $post['average_rating'] = $ratingInfo['average'] ?? 0;
            $post['no_of_ratings'] = $ratingInfo['count'] ?? 0;
        }
        return $post;
    }

    public function getAllPostsForAdmin($limit = 1000, $offset = 0) {
        $sql = "SELECT vp.*, CONCAT(u.GIVEN_NAME, ' ', u.FAMILY_NAME) as author_name
            FROM {$this->table} vp
            LEFT JOIN {$this->usersTable} u ON vp.user_id = u.ID
            ORDER BY vp.updated_at DESC LIMIT :limit OFFSET :offset";
        $this->query($sql);
        $this->bind(':limit', $limit, PDO::PARAM_INT);
        $this->bind(':offset', $offset, PDO::PARAM_INT);
        $results = $this->resultSet();

        if ($results) {
            foreach ($results as &$post) {
                if (!empty($post['gallery_images'])) {
                    $decoded_images = json_decode($post['gallery_images'], true);
                     $post['gallery_images'] = (json_last_error() === JSON_ERROR_NONE && is_array($decoded_images)) ? $decoded_images : [];
                } else {
                    $post['gallery_images'] = [];
                }
            }
            unset($post);
        }
        return $results;
    }

    public function getPostById($id) {
        $sql = "SELECT * FROM {$this->table} WHERE id = :id";
        $this->query($sql);
        $this->bind(':id', $id);
        $post = $this->single();

         if ($post) {
             if (!empty($post['gallery_images'])) {
                $decoded_images = json_decode($post['gallery_images'], true);
                $post['gallery_images'] = (json_last_error() === JSON_ERROR_NONE && is_array($decoded_images)) ? $decoded_images : [];
            } else {
                $post['gallery_images'] = [];
            }
        }
        return $post;
    }

    public function addPost($data) {
        if (empty($data['user_id'])) { throw new Exception("Author (user_id) is required."); }

        $galleryJson = null;
        if (isset($data['gallery_images']) && is_array($data['gallery_images'])) {
            $galleryJson = json_encode($data['gallery_images']);
            if ($galleryJson === false) { $galleryJson = '[]'; }
        } else {
            $galleryJson = '[]';
        }

        $sql = "INSERT INTO {$this->table} (title, slug, introduction, main_content, featured_image, gallery_images, user_id, status)
                VALUES (:title, :slug, :introduction, :main_content, :featured_image, :gallery_images, :user_id, :status)";
        $this->query($sql);
        $this->bind(':title', $data['title']);
        $this->bind(':slug', $data['slug']);
        $this->bind(':introduction', $data['introduction']);
        $this->bind(':main_content', $data['main_content']);
        $this->bind(':featured_image', $data['featured_image']);
        $this->bind(':gallery_images', $galleryJson);
        $this->bind(':user_id', $data['user_id'], PDO::PARAM_INT);
        $this->bind(':status', $data['status']);
        return $this->execute();
    }

    public function updatePost($id, $data) {
        $setClauses = [];
        if (isset($data['title'])) $setClauses[] = 'title = :title';
        if (isset($data['slug'])) $setClauses[] = 'slug = :slug';
        if (isset($data['introduction'])) $setClauses[] = 'introduction = :introduction';
        if (isset($data['main_content'])) $setClauses[] = 'main_content = :main_content';
        if (array_key_exists('featured_image', $data)) $setClauses[] = 'featured_image = :featured_image';
        if (isset($data['status'])) $setClauses[] = 'status = :status';
        if (array_key_exists('gallery_images', $data)) {
             $setClauses[] = 'gallery_images = :gallery_images';
        }
        if (isset($data['user_id'])) $setClauses[] = 'user_id = :user_id';


        if (empty($setClauses)) return true;

        $sql = "UPDATE {$this->table} SET " . implode(', ', $setClauses) . " WHERE id = :id";
        $this->query($sql);

        $this->bind(':id', $id);
        if (isset($data['title'])) $this->bind(':title', $data['title']);
        if (isset($data['slug'])) $this->bind(':slug', $data['slug']);
        if (isset($data['introduction'])) $this->bind(':introduction', $data['introduction']);
        if (isset($data['main_content'])) $this->bind(':main_content', $data['main_content']);
        if (array_key_exists('featured_image', $data)) $this->bind(':featured_image', $data['featured_image']);
        if (isset($data['status'])) $this->bind(':status', $data['status']);
        if (isset($data['user_id'])) $this->bind(':user_id', $data['user_id'], PDO::PARAM_INT);


        if (array_key_exists('gallery_images', $data)) {
            $galleryJson = null;
             if ($data['gallery_images'] !== null && is_array($data['gallery_images'])) {
                $galleryJson = json_encode($data['gallery_images']);
                if ($galleryJson === false) { $galleryJson = '[]'; }
            } elseif ($data['gallery_images'] === null) {
                 $galleryJson = null;
            } else {
                 $galleryJson = '[]';
            }
             $this->bind(':gallery_images', $galleryJson, ($galleryJson === null) ? PDO::PARAM_NULL : PDO::PARAM_STR);
        }

        return $this->execute();
    }

    public function deletePost($id) {
        $sql = "DELETE FROM {$this->table} WHERE id = :id";
        $this->query($sql);
        $this->bind(':id', $id);
        return $this->execute();
    }

    public function slugExists($slug, $excludeId = null) {
        $sql = "SELECT COUNT(*) as count FROM {$this->table} WHERE slug = :slug";
        if ($excludeId !== null) {
            $sql .= " AND id != :excludeId";
        }
        $this->query($sql);
        $this->bind(':slug', $slug);
        if ($excludeId !== null) {
            $this->bind(':excludeId', $excludeId, PDO::PARAM_INT);
        }
        $row = $this->single();
        return ($row && $row['count'] > 0);
    }

    public function getAverageRating($postId) {
        $sql = "SELECT AVG(rating) as average_rating, COUNT(rating) as rating_count
                FROM {$this->commentsTable}
                WHERE post_id = :post_id
                AND is_approved = 1
                AND rating IS NOT NULL
                AND rating > 0";
        $this->query($sql);
        $this->bind(':post_id', $postId);
        $row = $this->single();

        if ($row && $row['rating_count'] > 0) {
            return [
                'average' => round((float)$row['average_rating'], 1),
                'count' => (int)$row['rating_count']
            ];
        } else {
            return ['average' => 0.0, 'count' => 0];
        }
    }

    public function updatePostRatings($postId) {
        $ratingInfo = $this->getAverageRating($postId);
        $averageRating = $ratingInfo['average'];
        $numberOfRatings = $ratingInfo['count'];

        $sql = "UPDATE {$this->table}
                SET average_rating = :average_rating, no_of_ratings = :no_of_ratings
                WHERE id = :post_id";
        $this->query($sql);
        $this->bind(':average_rating', $averageRating);
        $this->bind(':no_of_ratings', $numberOfRatings, PDO::PARAM_INT);
        $this->bind(':post_id', $postId, PDO::PARAM_INT);

        return $this->execute();
    }

    public function getLastError() {
        return $this->error;
    }
}