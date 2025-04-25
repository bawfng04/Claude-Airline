<!-- API URL: localhost/backend/public/ContactLocation/index -->
<!-- localhost/backend/public/ContactLocation/getById -->
<!-- localhost/backend/public/ContactLocation/create -->
<!-- localhost/backend/public/ContactLocation/update -->
<!-- localhost/backend/public/ContactLocation/delete -->
<!-- chỉ cho phép URL "http://localhost/backend/public/ContactLocation/manage" -->
<!-- chặn "http://localhost/backend/app/views/contact_location.php" -->



<?php
if (!defined('BASEURL') && !defined('BASE_URL')) {
    header('HTTP/1.0 403 Forbidden');
    echo "Direct access to this file is not allowed.";
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Location Management</title>
    <!-- Include necessary CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="/backend/public/assets/extensions/datatables.net-bs5/css/dataTables.bootstrap5.min.css">
    <link rel="stylesheet" href="/backend/public/assets/compiled/css/app.css">
    <link rel="stylesheet" href="/backend/public/assets/compiled/css/iconly.css">
    <link rel="stylesheet" href="/backend/public/assets/compiled/css/app-dark.css">
    <link rel="shortcut icon" href="/backend/public/assets/compiled/svg/favicon.svg" type="image/x-icon">
    <style>
        /* Optional: Add custom styles if needed */
        .action-column button {
            margin-right: 5px;
        }
        .table-responsive {
            margin-top: 20px;
        }
        .modal-body .form-group {
            margin-bottom: 1rem;
        }
    </style>
</head>

<body>
    <div id="app">
        <div id="main" class="layout-horizontal">
            <header class="mb-5">
                <!-- You can include your standard header here if it's in a separate file -->
                <!-- Simplified header for this example -->
                <div class="header-top">
                    <div class="container">
                        <div class="logo">
                            <a href="#"><img src="/backend/public/assets/compiled/svg/logo.svg" alt="Logo"></a>
                        </div>
                        <div class="header-top-right">
                            <!-- Add user dropdown or other header elements if needed -->
                            <a href="#" class="burger-btn d-block d-xl-none">
                                <i class="bi bi-justify fs-3"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <nav class="main-navbar">
                    <div class="container">
                        <ul>
                            <!-- Add navigation items if needed -->
                             <li class="menu-item">
                                <a href="#" class='menu-link'><span><i class="bi bi-geo-alt-fill"></i> Quản lý Địa điểm</span></a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>

            <div class="container">
                <div class="page-heading">
                    <h3>Quản lý Địa điểm Liên hệ</h3>
                </div>
                <div class="page-content">
                    <section class="row">
                        <div class="col-12">
                            <button class="btn btn-primary mb-3" id="addLocationBtn">Thêm mới Địa điểm</button>
                            <div class="card">
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-striped" id="locationsTable">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Tên</th>
                                                    <th>Loại</th>
                                                    <th>Địa chỉ</th>
                                                    <th>Điện thoại</th>
                                                    <th>Giờ làm việc</th>
                                                    <th>Email</th>
                                                    <th>Mã nhúng</th>
                                                    <th>Hành động</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <!-- Data will be loaded by DataTables -->
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <!-- Footer can be included here -->

        </div>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal fade" id="addEditModal" tabindex="-1" aria-labelledby="addEditModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addEditModalLabel">Thêm/Sửa Địa điểm</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="addEditForm">
                    <div class="modal-body">
                        <input type="hidden" id="locationId">
                        <div class="form-group">
                            <label for="location_name">Tên Địa điểm</label>
                            <input type="text" class="form-control" id="location_name" name="location_name" required>
                        </div>
                        <div class="form-group">
                            <label for="des_type">Loại Địa điểm</label>
                            <select class="form-control" id="des_type" name="des_type" required>
                                <option value="">Chọn loại</option>
                                <option value="Main Office">Văn phòng chính</option>
                                <option value="Branch Office">Chi nhánh</option>
                                <!-- Add other types if needed -->
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="address_string">Địa chỉ</label>
                            <input type="text" class="form-control" id="address_string" name="address_string" required>
                        </div>
                        <div class="form-group">
                            <label for="phone_number">Số Điện thoại</label>
                            <input type="text" class="form-control" id="phone_number" name="phone_number" required pattern="^\+?[0-9]{10,15}$" title="Số điện thoại hợp lệ (10-15 chữ số, có thể bắt đầu bằng +)">
                        </div>
                        <div class="form-group">
                            <label for="working_hours">Giờ làm việc</label>
                            <input type="text" class="form-control" id="working_hours" name="working_hours" required>
                        </div>
                         <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" class="form-control" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="location_embed_code">Mã nhúng Bản đồ (Embed Code)</label>
                            <textarea class="form-control" id="location_embed_code" name="location_embed_code" rows="3" required></textarea>
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

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteModalLabel">Xác nhận Xóa</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Bạn có chắc chắn muốn xóa địa điểm này không?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                    <button type="button" class="btn btn-danger" id="confirmDeleteBtn">Xóa</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Include necessary JS -->
    <script src="/backend/public/assets/extensions/jquery/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/backend/public/assets/extensions/datatables.net/js/jquery.dataTables.min.js"></script>
    <script src="/backend/public/assets/extensions/datatables.net-bs5/js/dataTables.bootstrap5.min.js"></script>
    <script src="/backend/public/assets/static/js/pages/horizontal-layout.js"></script>
    <!-- <script src="/backend/public/assets/compiled/js/app.js"></script> --> <!-- Might conflict with Bootstrap 5.3, include specific components if needed -->


    <script>
        $(document).ready(function () {
            // Adjust this URL based on your actual backend public path
            const API_BASE_URL = '/backend/public/ContactLocation';
            let table;
            let currentDeleteId = null;

            // Initialize DataTable
            table = $('#locationsTable').DataTable({
                processing: true,
                serverSide: false, // Set to true if using server-side processing
                ajax: {
                    url: `${API_BASE_URL}/index`,
                    type: 'GET',
                    dataSrc: function(json) {
                        // Assuming your API returns { status: 200, message: 'Success', data: [...] }
                        if (json.status === 200 && json.data) {
                            return json.data;
                        } else {
                            console.error("Error fetching data:", json.message);
                            alert('Không thể tải dữ liệu địa điểm.');
                            return [];
                        }
                    },
                    error: function (xhr, error, thrown) {
                        console.error("AJAX error:", error, thrown);
                        alert('Lỗi khi kết nối đến máy chủ.');
                    }
                },
                columns: [
                    { data: 'id' },
                    { data: 'location_name' },
                    { data: 'des_type' },
                    { data: 'address_string' },
                    { data: 'phone_number' },
                    { data: 'working_hours' },
                    { data: 'email' },
                    {
                        data: 'location_embed_code',
                        render: function(data) {
                            // Show only a snippet or placeholder for embed code
                            return data ? data.substring(0, 30) + '...' : 'Chưa có mã nhúng';
                        }
                    },
                    {
                        data: 'id', // Use 'id' or null if you don't need data for rendering buttons
                        orderable: false,
                        searchable: false,
                        render: function (data, type, row) {
                            return `
                                <button class="btn btn-sm btn-warning edit-btn" data-id="${data}">Sửa</button>
                                <button class="btn btn-sm btn-danger delete-btn" data-id="${data}">Xóa</button>
                            `;
                        }
                    }
                ],
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.10.25/i18n/Vietnamese.json"
                }
            });

            // --- Modal Handling ---

            // Reset and open Add modal
            $('#addLocationBtn').on('click', function() {
                $('#addEditForm')[0].reset();
                $('#locationId').val(''); // Clear ID for adding
                $('#addEditModalLabel').text('Thêm Địa điểm Mới');
                $('#addEditModal').modal('show');
            });

            // Open Edit modal and populate data
            $('#locationsTable tbody').on('click', '.edit-btn', function () {
                const id = $(this).data('id');
                const rowData = table.rows().data().toArray().find(loc => loc.id == id);

                if (rowData) {
                    $('#locationId').val(rowData.id);
                    $('#location_name').val(rowData.location_name);
                    $('#des_type').val(rowData.des_type);
                    $('#address_string').val(rowData.address_string);
                    $('#phone_number').val(rowData.phone_number);
                    $('#working_hours').val(rowData.working_hours);
                    $('#email').val(rowData.email);
                    $('#location_embed_code').val(rowData.location_embed_code);

                    $('#addEditModalLabel').text('Sửa Địa điểm');
                    $('#addEditModal').modal('show');
                } else {
                    alert('Không tìm thấy dữ liệu cho địa điểm này.');
                }
            });

            // Open Delete confirmation modal
            $('#locationsTable tbody').on('click', '.delete-btn', function () {
                currentDeleteId = $(this).data('id');
                $('#deleteModal').modal('show');
            });

            // --- Form Submission (Add/Edit) ---
            $('#addEditForm').on('submit', function(e) {
                e.preventDefault();

                const id = $('#locationId').val();
                const locationData = {
                    location_name: $('#location_name').val(),
                    des_type: $('#des_type').val(),
                    address_string: $('#address_string').val(),
                    phone_number: $('#phone_number').val(),
                    working_hours: $('#working_hours').val(),
                    email: $('#email').val(),
                    location_embed_code: $('#location_embed_code').val()
                };

                const isEdit = !!id;
                const url = isEdit ? `${API_BASE_URL}/update/${id}` : `${API_BASE_URL}/create`;
                const method = isEdit ? 'PUT' : 'POST';

                $.ajax({
                    url: url,
                    method: method,
                    contentType: 'application/json',
                    data: JSON.stringify(locationData),
                    success: function(response) {
                        if (response.status === 200 || response.status === 201) {
                            alert(response.message || (isEdit ? 'Cập nhật thành công!' : 'Thêm mới thành công!'));
                            $('#addEditModal').modal('hide');
                            table.ajax.reload(); // Reload table data
                        } else {
                            alert('Lỗi: ' + (response.message || 'Không thể lưu địa điểm.'));
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error("Save error:", xhr.responseText);
                        let errorMsg = 'Lỗi máy chủ.';
                        try {
                            const errResponse = JSON.parse(xhr.responseText);
                            errorMsg = errResponse.message || errorMsg;
                        } catch (e) {}
                        alert('Lỗi khi lưu địa điểm: ' + errorMsg);
                    }
                });
            });

            // --- Delete Confirmation ---
            $('#confirmDeleteBtn').on('click', function() {
                if (!currentDeleteId) return;

                $.ajax({
                    url: `${API_BASE_URL}/delete/${currentDeleteId}`, // Use path parameter if your routing supports it
                    // url: `${API_BASE_URL}/delete?id=${currentDeleteId}`, // Or use query parameter
                    method: 'DELETE',
                    success: function(response) {
                        if (response.status === 200) {
                            alert(response.message || 'Xóa thành công!');
                            $('#deleteModal').modal('hide');
                            table.ajax.reload(); // Reload table data
                        } else {
                            alert('Lỗi: ' + (response.message || 'Không thể xóa địa điểm.'));
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error("Delete error:", xhr.responseText);
                         let errorMsg = 'Lỗi máy chủ.';
                        try {
                            const errResponse = JSON.parse(xhr.responseText);
                            errorMsg = errResponse.message || errorMsg;
                        } catch (e) {}
                        alert('Lỗi khi xóa địa điểm: ' + errorMsg);
                    },
                    complete: function() {
                        currentDeleteId = null; // Reset delete ID
                    }
                });
            });

        });
    </script>

</body>

</html>