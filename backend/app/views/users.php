<!DOCTYPE html>
<html lang="en">

<head>
    <?php session_start(); ?>

    <?php include 'components/meta_header.php'; ?>
    <title>Users Management</title>
</head>

<body>
    <div id="app">
        <div id="main" class="layout-horizontal">
            <?php include 'components/header.php'; ?>

            <div class="container mt-5">
                <h3 class="mb-4">Users Management</h3>
                <button class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#addEditModal">Thêm mới</button>
                <div class="table-responsive">
                    <table class="table" id="manageTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Họ</th>
                                <th>Tên</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Quyền</th>
                                <th>Hình ảnh</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($users as $user): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($user['ID']); ?></td>
                                    <td><?php echo htmlspecialchars($user['FAMILY_NAME']); ?></td>
                                    <td><?php echo htmlspecialchars($user['GIVEN_NAME']); ?></td>
                                    <td><?php echo htmlspecialchars($user['EMAIL']); ?></td>
                                    <td><?php echo htmlspecialchars($user['PHONE_NUMBER']); ?></td>
                                    <td><?php echo htmlspecialchars($user['ROLE']); ?></td>
                                    <td>
                                        <?php if (!empty($user['image'])): ?>
                                            <img src="uploads/<?php echo htmlspecialchars($user['image']); ?>" 
                                                    alt="Hình ảnh" 
                                                    class="img-thumbnail view-image" 
                                                    style="width: 50px; height: 50px; cursor: pointer;">
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php echo getActionButtons($user['ID'], $user['ACTIVE']); ?>
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
                    <h5 class="modal-title" id="addEditModalLabel">Thêm/Sửa Người dùng</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="addEditForm" method="POST" action="users/save" enctype="multipart/form-data">
                    <div class="modal-body">
                        <input type="hidden" name="id" id="recordId">
                        <div class="mb-3">
                            <label for="familyName" class="form-label">Họ</label>
                            <input type="text" class="form-control" name="family_name" id="familyName" required>
                        </div>
                        <div class="mb-3">
                            <label for="givenName" class="form-label">Tên</label>
                            <input type="text" class="form-control" name="given_name" id="givenName" required>
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" name="email" id="email" required>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Mật khẩu</label>
                            <input type="password" class="form-control" name="password" id="password">
                        </div>
                        <div class="mb-3">
                            <label for="phoneNumber" class="form-label">Số điện thoại</label>
                            <input type="text" class="form-control" name="phone_number" id="phoneNumber" required>
                        </div>
                        <div class="mb-3">
                            <label for="birthday" class="form-label">Ngày sinh</label>
                            <input type="date" class="form-control" name="birthday" id="birthday" required>
                        </div>
                        <div class="mb-3">
                            <label for="nationality" class="form-label">Quốc tịch</label>
                                <select class="form-control" name="nationality" id="nationality" required>
                                <option value="">-- Choose Nationality --</option>
                                <option value="vietnam">Vietnamese</option>
                                <option value="usa">American</option>
                                <option value="japan">Japanese</option>
                                <option value="korea">Korean</option>
                                <option value="france">French</option>
                                <!-- Thêm các quốc tịch khác nếu cần -->
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="image" class="form-label">Hình ảnh</label>
                            <input type="file" class="form-control" name="image" id="image" accept="image/*">
                        </div>
                        <div class="mb-3">
                            <label for="role" class="form-label" hidden>Quyền</label>
                            <input class="form-select" name="role" id="role" type="text" value ="ADMIN" hidden>
                        </div>
                        <div class="mb-3">
                            <label for="active" class="form-label" hidden>Hoạt động</label>
                            <input value=1 name="active" id="active" hidden>
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

    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteModalLabel">Xác nhận hành động</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="deleteForm" method="POST" action="users/toggleStatus">
                    <div class="modal-body">
                        <p id="deleteModalMessage">Bạn có chắc chắn muốn thực hiện hành động này không?</p>
                        <input type="hidden" name="id" id="deleteRecordId">
                        <input type="hidden" name="status_action" id="deleteAction">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="submit" class="btn btn-danger" id="confirmDelete">Xác nhận</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="modal fade" id="imageModal" tabindex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="imageModalLabel">Xem hình ảnh</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <img id="modalImage" src="" alt="Hình ảnh" class="img-fluid">
                </div>
            </div>
        </div>
    </div>

    <?php include 'components/script.php'; ?>
    <?php if (!empty($_SESSION['js_error'])): ?>
    <script>
        alert("<?= $_SESSION['js_error'] ?>");
    </script>
    <?php unset($_SESSION['js_error']); endif; ?>
    <?php if (!empty($_SESSION['success'])): ?>
    <script>
        alert("<?= $_SESSION['success'] ?>");
    </script>
    <?php unset($_SESSION['success']); endif; ?>
    <?php if (!empty($_SESSION['error'])): ?>
    <script>
        alert("<?= $_SESSION['error'] ?>");
    </script>
    <?php unset($_SESSION['error']); endif; ?>


    <script>
        $(document).ready(function () {
            $('#manageTable').DataTable();

            $('#manageTable').on('click', '.edit-btn', function () {
                const row = $(this).closest('tr');
                const id = row.find('td:eq(0)').text();
                const familyName = row.find('td:eq(1)').text();
                const givenName = row.find('td:eq(2)').text();
                const email = row.find('td:eq(3)').text();
                const role = row.find('td:eq(4)').text();

                $('#recordId').val(id);
                $('#familyName').val(familyName);
                $('#givenName').val(givenName);
                $('#email').val(email);
                $('#role').val(role);

                $('#addEditModal').modal('show');
            });

            $('#manageTable').on('click', '.toggle-status-btn', function () {
                const row = $(this).closest('tr');
                const id = row.find('td:eq(0)').text();
                const action = $(this).data('status'); // "enable" hoặc "disable"
                
                // Cập nhật nội dung modal
                $('#deleteRecordId').val(id);
                $('#deleteAction').val(action);
                const actionText = action === 'enable' ? 'kích hoạt' : 'vô hiệu hóa';
                $('#deleteModalMessage').text(`Bạn có chắc chắn muốn ${actionText} người dùng này không?`);

                // Hiển thị modal
                $('#deleteModal').modal('show');
            });

            $('#manageTable').on('click', '.view-image', function () {
                const imageUrl = $(this).attr('src'); // Lấy đường dẫn ảnh từ thuộc tính src
                $('#modalImage').attr('src', imageUrl); // Gán đường dẫn ảnh vào modal
                $('#imageModal').modal('show'); // Hiển thị modal
            });
        });

    </script>
</body>

</html>

<?php
function getActionButtons($id, $isActive) {
    if ($isActive) {
        return '
            <button class="btn btn-sm btn-danger toggle-status-btn" data-id="' . $id . '" data-status="disable">Disable</button>
        ';
    } else {
        return '
            <button class="btn btn-sm btn-success toggle-status-btn" data-id="' . $id . '" data-status="enable">Enable</button>
        ';
    }
}
