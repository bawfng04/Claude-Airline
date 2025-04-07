<!DOCTYPE html>
<html lang="en">

<head>
    <?php include 'components/meta_header.php'; ?> 
    <title>Quản lý FAQ</title>
</head>

<body>
    <div id="app">
        <div id="main" class="layout-horizontal">
            <?php include 'components/header.php'; ?> <!-- Chèn header -->
    
            <div class="container">
                <h3 class="mb-4">Quản lý FAQ</h3>
                <button class="btn btn-primary mb-3" style="width: fit-content;" data-bs-toggle="modal" data-bs-target="#addEditModal">Thêm mới</button>
                <div class="table-responsive">
                    <table class="table" id="manageTable">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Câu hỏi</th>
                            <th>Câu trả lời</th>
                            <th>Danh mục</th>
                            <th>Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($faqs as $faq): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($faq['id']); ?></td>
                                    <td><?php echo htmlspecialchars($faq['question']); ?></td>
                                    <td><?php echo htmlspecialchars($faq['answer']); ?></td>
                                    <td><?php echo htmlspecialchars($faq['category']); ?></td>
                                    <td>
                                        <?php echo getActionButtons($faq['id']); ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>

    <!-- Modal Thêm/Sửa -->
    <div class="modal fade" id="addEditModal" tabindex="-1" aria-labelledby="addEditModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addEditModalLabel">Thêm/Sửa Câu Hỏi</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="addEditForm" method="POST" action="faq/save">
                    <div class="modal-body">
                        <input type="hidden" name="id" id="recordId"> <!-- ID ẩn để chỉnh sửa -->

                        <!-- Trường Câu hỏi -->
                        <div class="mb-3">
                            <label for="question" class="form-label">Câu hỏi</label>
                            <input type="text" class="form-control" name="question" id="question" placeholder="Nhập câu hỏi" required>
                        </div>

                        <!-- Trường Câu trả lời -->
                        <div class="mb-3">
                            <label for="answer" class="form-label">Câu trả lời</label>
                            <textarea class="form-control" name="answer" id="answer" rows="3" placeholder="Nhập câu trả lời" required></textarea>
                        </div>

                        <!-- Trường Danh mục -->
                        <div class="mb-3">
                            <label for="category" class="form-label">Danh mục</label>
                            <select class="form-select" name="category" id="category" required onchange="toggleNewCategoryInput(this)">
                                <option value="">-- Chọn danh mục --</option>
                                <?php foreach ($categories as $category): ?>
                                    <option value="<?php echo htmlspecialchars($category['category']); ?>">
                                        <?php echo htmlspecialchars($category['category']); ?>
                                    </option>
                                <?php endforeach; ?>
                                <option value="new">+ Thêm danh mục mới</option>
                            </select>
                            <input type="text" class="form-control mt-2" name="new_category" id="newCategoryInput" placeholder="Nhập danh mục mới" style="display: none;">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        <button type="submit" class="btn btn-primary">Lưu</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal Xóa -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteModalLabel">Xóa Câu Hỏi</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="deleteForm" method="POST" action="faq/delete">
                    <div class="modal-body">
                        <p>Bạn có chắc chắn muốn xóa câu hỏi này không?</p>
                        <input type="hidden" name="id" id="deleteRecordId"> <!-- ID ẩn để xóa -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="submit" class="btn btn-danger">Xóa</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <?php include 'components/script.php'; ?>

    <script>
       $(document).ready(function () {
            $('#manageTable').DataTable();

            // Khi nhấn nút "Sửa"
            $('#manageTable').on('click', '.edit-btn', function () {
                const row = $(this).closest('tr');
                const id = row.find('td:eq(0)').text();
                const question = row.find('td:eq(1)').text();
                const answer = row.find('td:eq(2)').text();
                const category = row.find('td:eq(3)').text();

                $('#recordId').val(id);
                $('#question').val(question);
                $('#answer').val(answer);
                $('#category').val(category);

                $('#addEditModal').modal('show');
            });

            // Khi nhấn nút "Xóa"
            $('#manageTable').on('click', '.delete-btn', function () {
                const row = $(this).closest('tr');
                const id = row.find('td:eq(0)').text();

                $('#deleteRecordId').val(id);
                $('#deleteModal').modal('show');
            });
        });

        function toggleNewCategoryInput(select) {
            const newCategoryInput = document.getElementById('newCategoryInput');
            if (select.value === 'new') {
                newCategoryInput.style.display = 'block';
                newCategoryInput.required = true;
            } else {
                newCategoryInput.style.display = 'none';
                newCategoryInput.required = false;
            }
        }
    </script>
</body>
</html>

<?php
function getActionButtons($id) {
    return '
        <button class="btn btn-sm btn-warning edit-btn">
            Sửa
        </button>
        <button 
            class="btn btn-sm btn-danger delete-btn"
            onclick="return confirm(\'Bạn có chắc chắn muốn xóa câu hỏi này?\');"
        >
            Xóa
        </a>
        </button>
    ';
}
?>
