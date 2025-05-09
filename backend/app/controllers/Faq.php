<?php
// app/controllers/Faq.php

class Faq extends Controller {
    private $faqModel;

    public function __construct() {
        $this->faqModel = $this->model('FaqModel');
    }

    // Hiển thị tất cả câu hỏi
    public function index() {
        $faqs = $this->faqModel->getAllFaqs();
        $categories = $this->faqModel->getAllCategories(); // Lấy danh mục từ model
        $data = ['faqs' => $faqs, 'categories' => $categories]; // Truyền danh mục vào view
        $this->view('faq', $data);
    }

    // Lưu dữ liệu (Thêm/Sửa)
    public function save() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            session_start();
            $id = isset($_POST['id']) ? trim($_POST['id']) : null;
            $question = trim($_POST['question']);
            $answer = trim($_POST['answer']);
            $category = trim($_POST['category']);
            $newCategory = isset($_POST['new_category']) ? trim($_POST['new_category']) : null;

            // Kiểm tra nếu người dùng thêm danh mục mới
            if ($category === 'new' && !empty($newCategory)) {
                $category = $newCategory;
            }

            if (empty($question) || empty($answer) || empty($category)) {
                $_SESSION['error'] = 'Vui lòng nhập đầy đủ thông tin!';
                header('Location: ' . base_url('faq'));
                exit();
            }

            if ($id) {
                // Sửa câu hỏi
                if ($this->faqModel->updateFaq($id, $question, $answer, $category)) {
                    $_SESSION['success'] = 'Cập nhật câu hỏi thành công!';
                } else {
                    $_SESSION['error'] = 'Cập nhật câu hỏi thất bại!';
                }
            } else {
                // Thêm câu hỏi mới
                if ($this->faqModel->addFaq($question, $answer, $category)) {
                    $_SESSION['success'] = 'Thêm câu hỏi thành công!';
                } else {
                    $_SESSION['error'] = 'Thêm câu hỏi thất bại!';
                }
            }

            header('Location: ' . base_url('faq'));
            exit();
        }
    }

    // Xóa câu hỏi
    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            session_start();
            $id = isset($_POST['id']) ? trim($_POST['id']) : null;

            if (!is_numeric($id)) {
                $_SESSION['error'] = 'ID không hợp lệ.';
                header('Location: ' . base_url('faq'));
                exit();
            }

            if ($this->faqModel->deleteFaq($id)) {
                $_SESSION['success'] = 'Xóa câu hỏi thành công!';
            } else {
                $_SESSION['error'] = 'Xóa câu hỏi thất bại!';
            }

            header('Location: ' . base_url('faq'));
            exit();
        }
    }

    public function getFaqs() {
        try {
            $faqs = $this->faqModel->getAllFaqs();
            $this->jsonResponse(200, 'success', $faqs);
        } catch (Exception $e) {
            $this->jsonResponse(500, $e->getMessage());
        }
    }
}
