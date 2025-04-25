<!DOCTYPE html>
<html lang="en">

<head>
    <?php include 'components/meta_header.php'; ?>
    <title>Airline Fleets Management</title>
</head>

<body>
    <div id="app">
        <div id="main" class="layout-horizontal">
            <?php include 'components/header.php'; ?>

            <div class="container mt-5">
                <h3 class="mb-4">Airline Fleets Management</h3>
                <button class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#addEditModal">Thêm mới</button>
                <div class="table-responsive">
                    <table class="table" id="manageTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Mẫu máy bay</th>
                                <th>Mô tả</th>
                                <th>Hình ảnh</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($aircrafts as $aircraft): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($aircraft['id']); ?></td>
                                    <td><?php echo htmlspecialchars($aircraft['aircraft_model']); ?></td>
                                    <td><?php echo htmlspecialchars($aircraft['description']); ?></td>
                                    <td>
                                        <?php if (!empty($aircraft['image'])): ?>
                                            <img src="uploads/<?php echo htmlspecialchars($aircraft['image']); ?>" 
                                                alt="Hình ảnh" 
                                                class="img-thumbnail view-image" 
                                                style="width: 50px; height: 50px; cursor: pointer;">
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php echo getActionButtons($aircraft['id']); ?>
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
                    <h5 class="modal-title" id="addEditModalLabel">Thêm/Sửa Máy bay</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="addEditForm" method="POST" action="airlinefleet/save" enctype="multipart/form-data">
                    <div class="modal-body">
                        <input type="hidden" name="id" id="recordId">
                        <div class="mb-3">
                            <label for="aircraft_model" class="form-label">Mẫu máy bay</label>
                            <input type="text" class="form-control" name="aircraft_model" id="aircraft_model" required>
                        </div>
                        <div class="mb-3">
                            <label for="description" class="form-label">Mô tả</label>
                            <textarea class="form-control" name="description" id="description" rows="3" required></textarea>
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
                    <h5 class="modal-title" id="deleteModalLabel">Xóa Máy bay</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="deleteForm" method="POST" action="airlinefleet/delete">
                    <div class="modal-body">
                        <p>Bạn có chắc chắn muốn xóa máy bay này không?</p>
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
                const aircraft_model = row.find('td:eq(1)').text();
                const description = row.find('td:eq(2)').text();

                $('#recordId').val(id);
                $('#aircraft_model').val(aircraft_model);
                $('#description').val(description);

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