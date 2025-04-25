<!DOCTYPE html>
<html lang="en">

<head>
    <?php include 'components/meta_header.php'; ?>
    <title>About Us Management</title>
</head>

<body>
    <div id="app">
        <div id="main" class="layout-horizontal">
            <?php include 'components/header.php'; ?>

            <div class="container mt-5">
                <h3 class="mb-4">About Us Management</h3>
                <button class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#addEditModal">Thêm mới</button>
                <div class="table-responsive">
                    <table class="table" id="manageTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tiêu đề</th>
                                <th>Nội dung</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($aboutUs as $item): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($item['id']); ?></td>
                                    <td><?php echo htmlspecialchars($item['title']); ?></td>
                                    <td><?php echo htmlspecialchars($item['content']); ?></td>
                                    <td>
                                        <?php echo getActionButtons($item['id']); ?>
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
                    <h5 class="modal-title" id="addEditModalLabel">Thêm/Sửa About Us</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="addEditForm" method="POST" action="aboutus/save">
                    <div class="modal-body">
                        <input type="hidden" name="id" id="recordId">
                        <div class="mb-3">
                            <label for="title" class="form-label">Tiêu đề</label>
                            <input type="text" class="form-control" name="title" id="title" required>
                        </div>
                        <div class="mb-3">
                            <label for="content" class="form-label">Nội dung</label>
                            <textarea class="form-control" name="content" id="content" rows="3" required></textarea>
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
                    <h5 class="modal-title" id="deleteModalLabel">Xóa About Us</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="deleteForm" method="POST" action="aboutus/delete">
                    <div class="modal-body">
                        <p>Bạn có chắc chắn muốn xóa mục này không?</p>
                        <input type="hidden" name="id" id="deleteRecordId">
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

            $('#manageTable').on('click', '.edit-btn', function () {
                const row = $(this).closest('tr');
                const id = row.find('td:eq(0)').text();
                const title = row.find('td:eq(1)').text();
                const content = row.find('td:eq(2)').text();

                $('#recordId').val(id);
                $('#title').val(title);
                $('#content').val(content);

                $('#addEditModal').modal('show');
            });

            $('#manageTable').on('click', '.delete-btn', function () {
                const row = $(this).closest('tr');
                const id = row.find('td:eq(0)').text();

                $('#deleteRecordId').val(id);
                $('#deleteModal').modal('show');
            });
        });
    </script>
</body>
</html>

<?php
function getActionButtons($id) {
    return '
        <button class="btn btn-sm btn-warning edit-btn">Sửa</button>
        <button class="btn btn-sm btn-danger delete-btn">Xóa</button>
    ';
}
?>