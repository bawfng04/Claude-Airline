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
    <title>Top Destinations Management</title>
</head>

<body>
    <div id="app">
        <div id="main" class="layout-horizontal">
            <?php include 'components/header.php'; ?>

            <div class="container">
                <div class="page-heading">
                    <h3>Top Destinations Management</h3>
                </div>
                <div class="page-content">
                    <section class="row">
                        <div class="col-12">
                            <button class="btn btn-primary mb-3" id="addDestinationBtn">Add New Destination</button>
                            <div class="card">
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-striped" id="destinationsTable">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Image</th>
                                                    <th>Name</th>
                                                    <th>Country</th>
                                                    <th>Price</th>
                                                    <th>Description</th>
                                                    <th>Begin</th>
                                                    <th>End</th>
                                                    <th>Offer</th>
                                                    <th>Category</th>
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
                    <h5 class="modal-title" id="addEditModalLabel">Add/Edit Destination</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="addEditForm" enctype="multipart/form-data">
                    <div class="modal-body">
                        <input type="hidden" id="destinationId">

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="destination_image_input">Destination Image</label>
                                    <input type="file" class="form-control" id="destination_image_input" name="destination_image" accept="image/*">
                                    <small class="form-text text-muted">Leave blank to keep current image when editing.</small>
                                    <div id="imagePreviewContainer" class="mt-2 modal-image-preview">
                                        <img id="imagePreview" src="#" alt="Image Preview" style="display: none;" />
                                        <span id="currentImageText"></span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="destination_name">Destination Name</label>
                                    <input type="text" class="form-control" id="destination_name" name="destination_name" required>
                                </div>
                                <div class="form-group">
                                    <label for="destination_country">Country</label>
                                    <input type="text" class="form-control" id="destination_country" name="destination_country" required>
                                </div>
                                <div class="form-group">
                                    <label for="destination_price">Price ($)</label>
                                    <input type="number" class="form-control" id="destination_price" name="destination_price" required min="0" step="0.01">
                                </div>
                                <div class="form-group">
                                    <label for="destination_category">Category</label>
                                    <input type="text" class="form-control" id="destination_category" name="destination_category" required placeholder="e.g., Europe, Asia">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="destination_begin">Begin Date</label>
                                    <input type="date" class="form-control" id="destination_begin" name="destination_begin" required>
                                </div>
                                <div class="form-group">
                                    <label for="destination_end">End Date</label>
                                    <input type="date" class="form-control" id="destination_end" name="destination_end" required>
                                </div>
                                <div class="form-group">
                                    <label for="destination_offer">Offer</label>
                                    <input type="text" class="form-control" id="destination_offer" name="destination_offer" placeholder="e.g., 20% off">
                                </div>
                                <div class="form-group">
                                    <label for="destination_description">Description</label>
                                    <textarea class="form-control" id="destination_description" name="destination_description" rows="5" required></textarea>
                                </div>
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
                    Are you sure you want to delete this destination?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" id="confirmDeleteBtn">Delete</button>
                </div>
            </div>
        </div>
    </div>

    <?php include 'components/script.php'; ?>

    <script>
        $(document).ready(function () {
            const API_BASE_URL = "<?php echo getenv('BASE_URL');?>TopDestination";
            const API_URL ="<?php echo getenv('BASE_URL');?>";
            let destinationsTable;
            let currentDeleteId = null;
            const addEditModal = new bootstrap.Modal(document.getElementById('addEditModal'));
            const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
            let currentImageFilename = null;

            //handle lỗi ajax
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

            function formatDateForInput(dateString) {
                if (!dateString) return '';
                try {
                    const date = new Date(dateString.split(' ')[0]);
                    if (isNaN(date.getTime())) return '';
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                } catch (e) {
                    console.error("Error formatting date:", dateString, e);
                    return '';
                }
            }

            destinationsTable = $('#destinationsTable').DataTable({
                processing: true,
                serverSide: false,
                ajax: {
                    url: `${API_BASE_URL}/index`,
                    type: 'GET',
                    dataSrc: function(json) {
                        if (json.status === 200 && Array.isArray(json.data)) {
                            return json.data.map(dest => ({
                                ...dest,
                                fullImagePath: dest.destination_image ? `${API_URL}${dest.destination_image}` : null
                            }));
                        } else {
                            console.error("Error fetching data:", json.message || 'Invalid data format');
                            alert('Could not load destinations data.');
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
                                return `<div class="image-preview-container"><img src="${data}" alt="${row.destination_name || 'Destination Image'}"></div>`;
                            }
                            return '<span class="text-muted">No Image</span>';
                        },
                        orderable: false, searchable: false
                    },
                    { data: 'destination_name' },
                    { data: 'destination_country' },
                    {
                        data: 'destination_price',
                        render: function(data) {
                            return data ? `$${parseFloat(data).toFixed(2)}` : '';
                        }
                    },
                    { data: 'destination_description', className: 'description-cell' },
                    {
                        data: 'destination_begin',
                        render: function(data) { return formatDateForInput(data); }
                    },
                    {
                        data: 'destination_end',
                        render: function(data) { return formatDateForInput(data); }
                    },
                    { data: 'destination_offer' },
                    { data: 'destination_category' },
                    {
                        data: 'id',
                        orderable: false, searchable: false,
                        render: function (data, type, row) {
                            return `
                                <button class="btn btn-sm btn-warning edit-btn" data-id="${data}" title="Edit Destination">Edit</button>
                                <button class="btn btn-sm btn-danger delete-btn" data-id="${data}" title="Delete Destination">Delete</button>
                            `;
                        }
                    }
                ]
            });

            $('#destination_image_input').on('change', function(event) {
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

            $('#addDestinationBtn').on('click', function() {
                $('#addEditForm')[0].reset();
                $('#destinationId').val('');
                $('#addEditModalLabel').text('Add New Destination');
                $('#imagePreview').hide().attr('src', '#');
                $('#currentImageText').hide().text('');
                $('#destination_image_input').prop('required', true);
                currentImageFilename = null;
                addEditModal.show();
            });

            // Open Edit modal
            $('#destinationsTable tbody').on('click', '.edit-btn', function () {
                const id = $(this).data('id');
                const rowData = destinationsTable.rows().data().toArray().find(dest => dest.id == id);

                if (rowData) {
                    $('#addEditForm')[0].reset();
                    $('#destinationId').val(rowData.id);
                    $('#destination_name').val(rowData.destination_name);
                    $('#destination_country').val(rowData.destination_country);
                    $('#destination_price').val(rowData.destination_price);
                    $('#destination_description').val(rowData.destination_description);
                    $('#destination_begin').val(formatDateForInput(rowData.destination_begin));
                    $('#destination_end').val(formatDateForInput(rowData.destination_end));
                    $('#destination_offer').val(rowData.destination_offer);
                    $('#destination_category').val(rowData.destination_category);

                    $('#addEditModalLabel').text('Edit Destination');
                    $('#destination_image_input').prop('required', false); // Image không bắt buộc khi chỉnh sửa

                    const preview = $('#imagePreview');
                    const currentImageText = $('#currentImageText');
                    currentImageFilename = rowData.destination_image ? rowData.destination_image.split('/').pop() : null;

                    if (rowData.fullImagePath) {
                        preview.attr('src', rowData.fullImagePath).show();
                        currentImageText.hide();
                    } else {
                        preview.hide().attr('src', '#');
                        currentImageText.text('No current image').show();
                    }

                    addEditModal.show();
                } else {
                    alert('Could not find data for this destination.');
                }
            });

            // Open Delete confirmation modal
            $('#destinationsTable tbody').on('click', '.delete-btn', function () {
                currentDeleteId = $(this).data('id');
                deleteModal.show();
            });

            // --- Form Submission (Add/Edit) ---
            $('#addEditForm').on('submit', function(e) {
                e.preventDefault();

                const id = $('#destinationId').val();
                const isEdit = !!id;
                const formData = new FormData(this);
                const fileInput = $('#destination_image_input')[0];

                if (!formData.get('destination_name') || !formData.get('destination_country') || !formData.get('destination_price') || !formData.get('destination_description') || !formData.get('destination_begin') || !formData.get('destination_end') || !formData.get('destination_category')) {
                    alert('Please fill in all required fields.');
                    return;
                }
                 if (formData.get('destination_begin') > formData.get('destination_end')) {
                    alert('End date cannot be earlier than begin date.');
                    return;
                }

                if (isEdit && (!fileInput.files || fileInput.files.length === 0)) {
                    formData.delete('destination_image');
                } else if (!isEdit && (!fileInput.files || fileInput.files.length === 0)) {
                     alert('Please select an image file for the new destination.');
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
                            destinationsTable.ajax.reload();
                        } else {
                             alert('Error: ' + (response.message || 'Could not save destination.'));
                        }
                    },
                    error: function(xhr) {
                        handleAjaxError(xhr, 'Failed to save destination.');
                    }
                });
            });

            // --- Delete Confirmation ---
            $('#confirmDeleteBtn').on('click', function() {
                if (!currentDeleteId) return;
                const deleteUrl = `${API_BASE_URL}/delete?id=${currentDeleteId}`;
                $.ajax({
                    url: deleteUrl,
                    method: 'DELETE',
                    success: function(response) {
                         if (response.status === 200) {
                            alert(response.message || 'Deletion successful!');
                            deleteModal.hide();
                            destinationsTable.ajax.reload();
                        } else {
                            alert('Error: ' + (response.message || 'Could not delete destination.'));
                        }
                    },
                    error: function(xhr) {
                         if (xhr.status === 204) {
                             alert('Deletion successful!');
                             deleteModal.hide();
                             destinationsTable.ajax.reload();
                         } else {
                            handleAjaxError(xhr, 'Failed to delete destination.');
                         }
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