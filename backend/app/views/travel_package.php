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
    <title>Travel Packages Management</title>
</head>

<body>
    <div id="app">
        <div id="main" class="layout-horizontal">
            <?php include 'components/header.php'; ?>

            <div class="container">
                <div class="page-heading">
                    <h3>Travel Packages Management</h3>
                </div>
                <div class="page-content">
                    <section class="row">
                        <div class="col-12">
                            <button class="btn btn-primary mb-3" id="addPackageBtn">Add New Package</button>
                            <div class="card">
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-striped" id="packagesTable">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Name</th>
                                                    <th>Image</th>
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
                    <h5 class="modal-title" id="addEditModalLabel">Add/Edit Package</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="addEditForm" enctype="multipart/form-data">
                    <div class="modal-body">
                        <input type="hidden" id="packageId">
                        <div class="form-group">
                            <label for="package_image_input">Package Image</label>
                            <input type="file" class="form-control" id="package_image_input" name="package_image" accept="image/*">
                            <small class="form-text text-muted">Leave blank to keep the current image when editing.</small>
                            <div id="imagePreviewContainer" class="mt-2 modal-image-preview">
                                <img id="imagePreview" src="#" alt="Image Preview" style="display: none;" />
                                <span id="currentImageText"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="package_name">Package Name</label>
                            <input type="text" class="form-control" id="package_name" name="package_name" required>
                        </div>
                        <div class="form-group">
                            <label for="package_description">Description</label>
                            <textarea class="form-control" id="package_description" name="package_description" rows="4" required></textarea>
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
                    Are you sure you want to delete this travel package?
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
            // Adjust these URLs based on your actual backend public path and API structure
            const API_BASE_URL = "<?php echo getenv('BASE_URL');?>TravelPackage"; // Controller base
            const API_URL = "<?php echo getenv('BASE_URL');?>"; // Base for image paths
            let packagesTable;
            let currentDeleteId = null;
            const addEditModal = new bootstrap.Modal(document.getElementById('addEditModal'));
            const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
            let currentImageFilename = null;

            // Function to handle AJAX errors
            function handleAjaxError(xhr, defaultMessage) {
                console.error("AJAX error:", xhr.responseText);
                let errorMsg = defaultMessage || 'A server error occurred.';
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMsg = xhr.responseJSON.message;
                } else {
                    try {
                        const errResponse = JSON.parse(xhr.responseText);
                        errorMsg = errResponse.message || errorMsg;
                    } catch (e) { /* Ignore parsing error */ }
                }
                alert('Error: ' + errorMsg);
            }

            // Initialize DataTable
            packagesTable = $('#packagesTable').DataTable({
                processing: true,
                serverSide: false,
                ajax: {
                    url: `${API_BASE_URL}/index`,
                    type: 'GET',
                    dataSrc: function(json) {
                        if (json.status === 200 && Array.isArray(json.data)) {
                            // Prepend API_URL to image paths
                            return json.data.map(pkg => ({
                                ...pkg,
                                fullImagePath: pkg.package_image ? `${API_URL}${pkg.package_image}` : null
                            }));
                        } else {
                            console.error("Error fetching data:", json.message || 'Invalid data format');
                            alert('Could not load travel packages data.');
                            return [];
                        }
                    },
                    error: function (xhr, error, thrown) {
                        handleAjaxError(xhr, 'Failed to connect to the server.');
                    }
                },
                columns: [
                    { data: 'id' },
                    { data: 'package_name' },
                    {
                        data: 'fullImagePath',
                        render: function(data, type, row) {
                            if (data) {
                                return `<div class="image-preview-container"><img src="${data}" alt="${row.package_name || 'Package Image'}"></div>`;
                            }
                            return '<span class="text-muted">No Image</span>';
                        },
                        orderable: false, searchable: false
                    },
                    { data: 'package_description', className: 'description-cell' },
                    {
                        data: 'id',
                        orderable: false, searchable: false,
                        render: function (data, type, row) {
                            return `
                                <button class="btn btn-sm btn-warning edit-btn" data-id="${data}" title="Edit Package">Edit</button>
                                <button class="btn btn-sm btn-danger delete-btn" data-id="${data}" title="Delete Package">Delete</button>
                            `;
                        }
                    }
                ]
            });

            // --- Image Preview Logic ---
            $('#package_image_input').on('change', function(event) {
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
            $('#addPackageBtn').on('click', function() {
                $('#addEditForm')[0].reset();
                $('#packageId').val('');
                $('#addEditModalLabel').text('Add New Package');
                $('#imagePreview').hide().attr('src', '#');
                $('#currentImageText').hide().text('');
                $('#package_image_input').prop('required', true); // Image required for adding
                currentImageFilename = null;
                addEditModal.show();
            });

            // Open Edit modal and populate data
            $('#packagesTable tbody').on('click', '.edit-btn', function () {
                const id = $(this).data('id');
                const rowData = packagesTable.rows().data().toArray().find(pkg => pkg.id == id);

                if (rowData) {
                    $('#addEditForm')[0].reset();
                    $('#packageId').val(rowData.id);
                    $('#package_name').val(rowData.package_name);
                    $('#package_description').val(rowData.package_description);
                    $('#addEditModalLabel').text('Edit Package');
                    $('#package_image_input').prop('required', false); // Image not required for editing

                    const preview = $('#imagePreview');
                    const currentImageText = $('#currentImageText');
                    currentImageFilename = rowData.package_image ? rowData.package_image.split('/').pop() : null;

                    if (rowData.fullImagePath) {
                        preview.attr('src', rowData.fullImagePath).show();
                        currentImageText.hide();
                    } else {
                        preview.hide().attr('src', '#');
                        currentImageText.text('No current image').show();
                    }

                    addEditModal.show();
                } else {
                    alert('Could not find data for this package.');
                }
            });

            // Open Delete confirmation modal
            $('#packagesTable tbody').on('click', '.delete-btn', function () {
                currentDeleteId = $(this).data('id');
                deleteModal.show();
            });

            // --- Form Submission (Add/Edit) ---
            $('#addEditForm').on('submit', function(e) {
                e.preventDefault();

                const id = $('#packageId').val();
                const isEdit = !!id;
                const formData = new FormData(this);
                const fileInput = $('#package_image_input')[0];

                // Basic Validations
                if (!formData.get('package_name') || !formData.get('package_description')) {
                    alert('Please fill in Package Name and Description.');
                    return;
                }

                // Handle file input based on add/edit
                if (isEdit && (!fileInput.files || fileInput.files.length === 0)) {
                    formData.delete('package_image');
                } else if (!isEdit && (!fileInput.files || fileInput.files.length === 0)) {
                     alert('Please select an image file for the new package.');
                     return;
                }

                const url = isEdit ? `${API_BASE_URL}/update/${id}` : `${API_BASE_URL}/create`;
                const method = 'POST'; // Use POST for FormData

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
                            packagesTable.ajax.reload();
                        } else {
                             alert('Error: ' + (response.message || 'Could not save package.'));
                        }
                    },
                    error: function(xhr) {
                        handleAjaxError(xhr, 'Failed to save package.');
                    }
                });
            });

            // --- Delete Confirmation ---
            $('#confirmDeleteBtn').on('click', function() {
                if (!currentDeleteId) return;

                // Using query parameter as in the React code
                const deleteUrl = `${API_BASE_URL}/delete?id=${currentDeleteId}`;

                $.ajax({
                    url: deleteUrl,
                    method: 'DELETE',
                    success: function(response) {
                         if (response.status === 200) {
                            alert(response.message || 'Deletion successful!');
                            deleteModal.hide();
                            packagesTable.ajax.reload();
                        } else {
                            alert('Error: ' + (response.message || 'Could not delete package.'));
                        }
                    },
                    error: function(xhr) {
                         // Handle non-2xx responses, including potential 204 No Content
                         if (xhr.status === 204) {
                             alert('Deletion successful!');
                             deleteModal.hide();
                             packagesTable.ajax.reload();
                         } else {
                            handleAjaxError(xhr, 'Failed to delete package.');
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