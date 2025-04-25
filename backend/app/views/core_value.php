<!DOCTYPE html>
<html lang="en">

<head>
    <?php include 'components/meta_header.php'; ?>
    <title>Core Value Management</title>
</head>

<body>
    <div id="app">
        <div id="main" class="layout-horizontal">
            <?php include 'components/header.php'; ?>

            <div class="container mt-5">
                <h3 class="mb-4">Core Value Management</h3>
                <button class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#addEditModal">Thêm mới</button>
                <div class="table-responsive">
                    <table class="table" id="manageTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tiêu đề</th>
                                <th>Mô tả</th>
                                <th>Icon (Font Awesome)</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($coreValues as $coreValue): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($coreValue['id']); ?></td>
                                    <td><?php echo htmlspecialchars($coreValue['title']); ?></td>
                                    <td><?php echo htmlspecialchars($coreValue['description']); ?></td>
                                    <td><?php echo htmlspecialchars($coreValue['icon']); ?></td>
                                    <td>
                                        <?php echo getActionButtons($coreValue['id']); ?>
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
                    <h5 class="modal-title" id="addEditModalLabel">Thêm/Sửa Giá trị cốt lõi</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="addEditForm" method="POST" action="corevalue/save" enctype="multipart/form-data">
                    <div class="modal-body">
                        <input type="hidden" name="id" id="recordId">
                        <div class="mb-3">
                            <label for="title" class="form-label">Tiêu đề</label>
                            <input type="text" class="form-control" name="title" id="title" required>
                        </div>
                        <div class="mb-3">
                            <label for="description" class="form-label">Mô tả</label>
                            <textarea class="form-control" name="description" id="description" rows="3" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="icon" class="form-label">Tên Icon (Font Awesome)</label>
                            <input type="text" class="form-control" name="icon" id="icon" placeholder="Tên Icon (Font Awesome)" required>
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
                    <h5 class="modal-title" id="deleteModalLabel">Xóa Giá trị cốt lõi</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="deleteForm" method="POST" action="corevalue/delete">
                    <div class="modal-body">
                        <p>Bạn có chắc chắn muốn xóa giá trị cốt lõi này không?</p>
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
                const description = row.find('td:eq(2)').text();

                $('#recordId').val(id);
                $('#title').val(title);
                $('#description').val(description);

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