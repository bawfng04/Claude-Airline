<!DOCTYPE html>
<html lang="en">

<head>
    <?php session_start(); ?>
    <?php include 'components/meta_header.php'; ?> 
    <title>Leadership Team Management</title>
</head>

<body>
    <div id="app">
        <div id="main" class="layout-horizontal">
            <?php include 'components/header.php'; ?>

            <div class="container mt-5">
                <?php if (!empty($_SESSION['success'])): ?>
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <?= $_SESSION['success']; ?>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                    <?php unset($_SESSION['success']); ?>
                <?php endif; ?>

                <?php if (!empty($_SESSION['error'])): ?>
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <?= $_SESSION['error']; ?>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                    <?php unset($_SESSION['error']); ?>
                <?php endif; ?>
                <h3 class="mb-4">Leadership Team Management</h3>
                <button class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#addEditModal">Thêm mới</button>
                <div class="table-responsive">
                    <table class="table" id="manageTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên</th>
                                <th>Chức vụ</th>
                                <th>Tiểu sử</th>
                                <th>Hình ảnh</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($members as $member): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($member['id']); ?></td>
                                    <td><?php echo htmlspecialchars($member['name']); ?></td>
                                    <td><?php echo htmlspecialchars($member['position']); ?></td>
                                    <td><?php echo htmlspecialchars($member['bio']); ?></td>
                                    <td>
                                        <?php if (!empty($member['image'])): ?>
                                            <img src="uploads/<?php echo htmlspecialchars($member['image']); ?>" 
                                            alt="Hình ảnh" 
                                            class="img-thumbnail view-image" 
                                            style="width: 50px; height: 50px; cursor: pointer;">
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php echo getActionButtons($member['id']); ?>
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
                    <h5 class="modal-title" id="addEditModalLabel">Thêm/Sửa Thành Viên</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="addEditForm" method="POST" action="leadershipteam/save" enctype="multipart/form-data">
                    <div class="modal-body">
                        <input type="hidden" name="id" id="recordId">
                        <div class="mb-3">
                            <label for="name" class="form-label">Tên</label>
                            <input type="text" class="form-control" name="name" id="name" required>
                        </div>
                        <div class="mb-3">
                            <label for="position" class="form-label">Chức vụ</label>
                            <input type="text" class="form-control" name="position" id="position" required>
                        </div>
                        <div class="mb-3">
                            <label for="bio" class="form-label">Tiểu sử</label>
                            <textarea class="form-control" name="bio" id="bio" rows="3" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="image" class="form-label">Hình ảnh</label>
                            <input type="file" class="form-control" name="image" id="image" accept="image/*">
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
                    <h5 class="modal-title" id="deleteModalLabel">Xóa Thành Viên</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="deleteForm" method="POST" action="leadershipteam/delete">
                    <div class="modal-body">
                        <p>Bạn có chắc chắn muốn xóa thành viên này không?</p>
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

    <!-- Modal hiển thị hình ảnh -->
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

    <script>
        $(document).ready(function () {
            $('#manageTable').DataTable();

            $('#manageTable').on('click', '.edit-btn', function () {
                const row = $(this).closest('tr');
                const id = row.find('td:eq(0)').text();
                const name = row.find('td:eq(1)').text();
                const position = row.find('td:eq(2)').text();
                const bio = row.find('td:eq(3)').text();

                $('#recordId').val(id);
                $('#name').val(name);
                $('#position').val(position);
                $('#bio').val(bio);

                $('#addEditModal').modal('show');
            });

            $('#manageTable').on('click', '.delete-btn', function () {
                const row = $(this).closest('tr');
                const id = row.find('td:eq(0)').text();

                $('#deleteRecordId').val(id);
                $('#deleteModal').modal('show');
            });

            // Khi nhấn vào hình ảnh
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
function getActionButtons($id) {
    return '
        <button class="btn btn-sm btn-warning edit-btn">Sửa</button>
        <button class="btn btn-sm btn-danger delete-btn">Xóa</button>
    ';
}
?>