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
    <?php include 'components/meta_header.php'; ?>
</head>

<body>
    <div id="app">
        <div id="main" class="layout-horizontal">
            <?php include 'components/header.php'; ?>

            <div class="container">
                <div class="page-heading">
                    <h3>Services Management</h3>
                </div>
                <div class="page-content">
                    <section class="row">
                        <div class="col-12">
                            <button class="btn btn-primary mb-3" id="addServiceBtn">Add New Service</button>
                            <div class="card">
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-striped" id="servicesTable">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Image</th>
                                                    <th>Title</th>
                                                    <th>Description</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <!-- Data loaded by DataTables -->
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <!-- Footer include -->

        </div>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal fade" id="addEditModal" tabindex="-1" aria-labelledby="addEditModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addEditModalLabel">Add/Edit Service</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="addEditForm" enctype="multipart/form-data">
                    <div class="modal-body">
                        <input type="hidden" id="serviceId">
                        <div class="form-group">
                            <label for="service_title">Service Title</label>
                            <input type="text" class="form-control" id="service_title" name="service_title" required>
                        </div>
                        <div class="form-group">
                            <label for="service_description">Service Description</label>
                            <textarea class="form-control" id="service_description" name="service_description" rows="4" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="service_image_input">Service Image</label>
                            <input type="file" class="form-control" id="service_image_input" name="service_image" accept="image/*">
                            <small class="form-text text-muted">Leave blank to keep the current image when editing.</small>
                            <div id="imagePreviewContainer" class="mt-2 modal-image-preview">
                                <img id="imagePreview" src="#" alt="Image Preview" style="display: none;" />
                                <span id="currentImageText"></span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Save</button>
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
                    <h5 class="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this service?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" id="confirmDeleteBtn">Delete</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Include necessary JS -->
    <?php include 'components/script.php'; ?>

    <script>
        $(document).ready(function () {
            const API_BASE_URL = "<?php echo getenv('BASE_URL');?>Services";
            const API_URL = "<?php echo getenv('BASE_URL');?>";
            let servicesTable;
            let currentDeleteId = null;
            const addEditModal = new bootstrap.Modal(document.getElementById('addEditModal'));
            const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
            let currentImageFilename = null;
            function handleAjaxError(xhr, defaultMessage) {
                console.error("AJAX error:", xhr.responseText);
                let errorMsg = defaultMessage || 'An unexpected server error occurred.';

                if (xhr.responseJSON) {
                    if (xhr.responseJSON.data && typeof xhr.responseJSON.data === 'string') {
                        errorMsg = xhr.responseJSON.data;
                    } else if (xhr.responseJSON.message && typeof xhr.responseJSON.message === 'string') {
                        errorMsg = xhr.responseJSON.message;
                    }
                } else if (xhr.responseText) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response.data && typeof response.data === 'string') {
                            errorMsg = response.data;
                        } else if (response.message && typeof response.message === 'string') {
                            errorMsg = response.message;
                        }
                    } catch (e) {
                        console.warn("Could not parse AJAX error responseText as JSON:", xhr.responseText, e);
                        if (xhr.statusText && xhr.statusText.toLowerCase() !== "error" && xhr.statusText.toLowerCase() !== "ok" && xhr.statusText.toLowerCase() !== "bad request") {
                            errorMsg = xhr.statusText;
                        }
                    }
                } else if (xhr.statusText && xhr.statusText.toLowerCase() !== "error" && xhr.statusText.toLowerCase() !== "ok" && xhr.statusText.toLowerCase() !== "bad request") {
                    errorMsg = xhr.statusText;
                }
                alert('Error: ' + errorMsg);
            }

            servicesTable = $('#servicesTable').DataTable({
                processing: true,
                serverSide: false,
                ajax: {
                    url: `${API_BASE_URL}/index`,
                    type: 'GET',
                    dataSrc: function(json) {
                        if (json.status === 200 && Array.isArray(json.data)) {
                            return json.data.map(svc => ({
                                ...svc,
                                fullImagePath: svc.service_image ? `${API_URL}${svc.service_image}` : null
                            }));
                        } else {
                            console.error("Error fetching data:", json.message || 'Invalid data format');
                            alert('Could not load services data.');
                            return [];
                        }
                    },
                    error: function (xhr, error, thrown) {
                        handleAjaxError(xhr, 'Failed to connect to the server.');
                    }
                },
                columns: [
                    { data: 'id' },
                    {
                        data: 'fullImagePath',
                        render: function(data, type, row) {
                            if (data) {
                                return `<div class="image-preview-container"><img src="${data}" alt="${row.service_title || 'Service Image'}"></div>`;
                            }
                            return '<span class="text-muted">No Image</span>';
                        },
                        orderable: false,
                        searchable: false
                    },
                    { data: 'service_title' },
                    { data: 'service_description', className: 'description-cell' },
                    {
                        data: 'id',
                        orderable: false,
                        searchable: false,
                        render: function (data, type, row) {
                            return `
                                <button class="btn btn-sm btn-warning edit-btn" data-id="${data}" title="Edit Service">Edit</button>
                                <button class="btn btn-sm btn-danger delete-btn" data-id="${data}" title="Delete Service">Delete</button>
                            `;
                        }
                    }
                ]
            });

            // image preview
            $('#service_image_input').on('change', function(event) {
                const file = event.target.files[0];
                const preview = $('#imagePreview');
                const currentImageText = $('#currentImageText');

                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        preview.attr('src', e.target.result).show();
                        currentImageText.hide();
                    }
                    reader.readAsDataURL(file);
                } else {
                    if (currentImageFilename) {
                         preview.hide();
                         currentImageText.text(`Current: ${currentImageFilename}`).show();
                    } else {
                        preview.hide();
                        currentImageText.hide();
                    }
                }
            });

            // --- Modal Handling ---

            // Reset and open Add modal
            $('#addServiceBtn').on('click', function() {
                $('#addEditForm')[0].reset();
                $('#serviceId').val('');
                $('#addEditModalLabel').text('Add New Service');
                $('#imagePreview').hide().attr('src', '#');
                $('#currentImageText').hide().text('');
                $('#service_image_input').prop('required', true);
                currentImageFilename = null;
                addEditModal.show();
            });

            $('#servicesTable tbody').on('click', '.edit-btn', function () {
                const id = $(this).data('id');
                const rowData = servicesTable.rows().data().toArray().find(svc => svc.id == id);

                if (rowData) {
                    $('#addEditForm')[0].reset();
                    $('#serviceId').val(rowData.id);
                    $('#service_title').val(rowData.service_title);
                    $('#service_description').val(rowData.service_description);
                    $('#addEditModalLabel').text('Edit Service');
                    $('#service_image_input').prop('required', false);

                    const preview = $('#imagePreview');
                    const currentImageText = $('#currentImageText');
                    currentImageFilename = rowData.service_image ? rowData.service_image.split('/').pop() : null;

                    if (rowData.fullImagePath) {
                        preview.attr('src', rowData.fullImagePath).show();
                        currentImageText.hide();
                    } else {
                        preview.hide().attr('src', '#');
                        currentImageText.text('No current image').show();
                    }

                    addEditModal.show();
                } else {
                    alert('Could not find data for this service.');
                }
            });

            $('#servicesTable tbody').on('click', '.delete-btn', function () {
                currentDeleteId = $(this).data('id');
                deleteModal.show();
            });

            // --- Form Submission (Add/Edit) ---
            $('#addEditForm').on('submit', function(e) {
                e.preventDefault();

                const id = $('#serviceId').val();
                const isEdit = !!id;
                const formData = new FormData(this);
                const fileInput = $('#service_image_input')[0];

                if (!formData.get('service_title') || !formData.get('service_description')) {
                    alert('Please fill in Title and Description.');
                    return;
                }

                if (isEdit && (!fileInput.files || fileInput.files.length === 0)) {
                    formData.delete('service_image');
                } else if (!isEdit && (!fileInput.files || fileInput.files.length === 0)) {
                     alert('Please select an image file for the new service.');
                     return;
                }

                const url = isEdit ? `${API_BASE_URL}/update/${id}` : `${API_BASE_URL}/create`;
                const method = 'POST';

                $.ajax({
                    url: url,
                    method: method,
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(response) {
                        if (response.status === 200 || response.status === 201) {
                            alert(response.message || (isEdit ? 'Update successful!' : 'Creation successful!'));
                            addEditModal.hide();
                            servicesTable.ajax.reload();
                        } else {
                             alert('Error: ' + (response.message || 'Could not save service.'));
                        }
                    },
                    error: function(xhr) {
                        handleAjaxError(xhr, 'Failed to save service.');
                    }
                });
            });

            // --- Delete Confirmation ---
            $('#confirmDeleteBtn').on('click', function() {
                if (!currentDeleteId) return;

                const deleteUrl = `${API_BASE_URL}/delete/${currentDeleteId}`;

                $.ajax({
                    url: deleteUrl,
                    method: 'DELETE',
                    success: function(response) {
                         if (response.status === 200) {
                            alert(response.message || 'Deletion successful!');
                            deleteModal.hide();
                            servicesTable.ajax.reload();
                        } else {
                            alert('Error: ' + (response.message || 'Could not delete service.'));
                        }
                    },
                    error: function(xhr) {
                         handleAjaxError(xhr, 'Failed to delete service.');
                    },
                    complete: function() {
                        currentDeleteId = null;
                    }
                });
            });

        });
    </script>

</body>

</html>