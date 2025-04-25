<!DOCTYPE html>
<html lang="en">

<head>
    <?php include 'components/meta_header.php'; ?>
    <title>Quản lý Airline Experience</title>
</head>

<body>
    <div id="app">
        <div id="main" class="layout-horizontal">
            <?php include 'components/header.php'; ?>

            <div class="container mt-5">
                <h3 class="mb-4">Airline Experience Management</h3>
                <button class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#addEditModal">Thêm mới</button>
                <div class="table-responsive">
                    <table class="table" id="manageTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tiêu đề</th>
                                <th>Mô tả</th>
                                <th>Hình ảnh</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($experiences as $experience): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($experience['id']); ?></td>
                                    <td><?php echo htmlspecialchars($experience['title']); ?></td>
                                    <td><?php echo htmlspecialchars($experience['description']); ?></td>
                                    <td>
                                        <?php if (!empty($experience['image'])): ?>
                                            <img src="uploads/<?php echo htmlspecialchars($experience['image']); ?>" 
                                                alt="Hình ảnh" 
                                                class="img-thumbnail view-image" 
                                                style="width: 50px; height: 50px; cursor: pointer;">
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php echo getActionButtons($experience['id']); ?>
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
                    <h5 class="modal-title" id="addEditModalLabel">Thêm/Sửa Airline Experience</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="addEditForm" method="POST" action="airlineexperience/save" enctype="multipart/form-data">
                    <div class="modal-body">
                        <input type="hidden" name="id" id="recordId">
                        <div class="mb-3">
                            <label for="title" class="form-label">Tiêu đề</label>
                            <input type="text" class="form-control" name="title" id="title" required>
                        </div>
                        <div class="mb-3">
                            <label for="image" class="form-label">Hình ảnh</label>
                            <input type="file" class="form-control" name="image" id="image" accept="image/*">
                        </div>
                        <div class="mb-3">
                            <label for="descriptions" class="form-label">Mô tả</label>
                            <div id="descriptionContainer">
                                <textarea class="form-control mb-2" name="descriptions[]" rows="2" placeholder="Nhập mô tả"></textarea>
                            </div>
                            <button type="button" class="btn btn-secondary" onclick="addDescription()">Thêm mô tả</button>
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
                    <h5 class="modal-title" id="deleteModalLabel">Xóa Airline Experience</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="deleteForm" method="POST" action="airlineexperience/delete">
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

            // Khi nhấn nút "Sửa"
            $('#manageTable').on('click', '.edit-btn', function () {
                const row = $(this).closest('tr');
                const id = row.find('td:eq(0)').text();
                const title = row.find('td:eq(1)').text();
                const image = row.find('td:eq(3)').find('img').attr('src');

                // Gửi AJAX để lấy danh sách mô tả
                $.ajax({
                    url: 'airlineexperience/getExperienceById',
                    type: 'GET',
                    data: { id: id },
                    success: function (response) {
                        try {
                            const data = typeof response === 'string' ? JSON.parse(response) : response;

                            if (data.status === 'success') {
                                // Điền thông tin vào modal
                                $('#recordId').val(id);
                                $('#title').val(data.data.title);

                                // Xóa các mô tả cũ trong modal
                                $('#descriptionContainer').empty();

                                // Thêm các mô tả vào modal
                                data.data.descriptions.forEach(description => {
                                    const textarea = `<textarea class="form-control mb-2" name="descriptions[]" rows="2">${description}</textarea>`;
                                    $('#descriptionContainer').append(textarea);
                                });

                                // Hiển thị modal
                                $('#addEditModal').modal('show');
                            } else {
                                alert(data.message || 'Không thể tải thông tin.');
                            }
                        } catch (e) {
                            console.error('Phản hồi không phải JSON hợp lệ:', response);
                            alert('Lỗi khi xử lý dữ liệu từ server.');
                        }
                    },
                    error: function () {
                        alert('Không thể tải thông tin mô tả.');
                    }
                });
            });

            $('#manageTable').on('click', '.delete-btn', function () {
                const row = $(this).closest('tr');
                const id = row.find('td:eq(0)').text();

                $('#deleteRecordId').val(id);
                $('#deleteModal').modal('show');
            });

            $('#manageTable').on('click', '.view-image', function () {
                const imageUrl = $(this).attr('src');
                $('#modalImage').attr('src', imageUrl);
                $('#imageModal').modal('show');
            });
        });

        function addDescription() {
            const container = document.getElementById('descriptionContainer');
            const textarea = document.createElement('textarea');
            textarea.className = 'form-control mb-2';
            textarea.name = 'descriptions[]';
            textarea.rows = 2;
            textarea.placeholder = 'Nhập mô tả';
            container.appendChild(textarea);
        }
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