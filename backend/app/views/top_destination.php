<?php
// Define base URL if needed
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Top Destinations Management</title>
    <!-- Include necessary CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="/backend/public/assets/extensions/datatables.net-bs5/css/dataTables.bootstrap5.min.css">
    <link rel="stylesheet" href="/backend/public/assets/compiled/css/app.css">
    <link rel="stylesheet" href="/backend/public/assets/compiled/css/iconly.css">
    <link rel="stylesheet" href="/backend/public/assets/compiled/css/app-dark.css">
    <link rel="shortcut icon" href="/backend/public/assets/compiled/svg/favicon.svg" type="image/x-icon">
    <style>
        .action-column button {
            margin-right: 5px;
        }
        .table-responsive {
            margin-top: 20px;
        }
        .modal-body .form-group {
            margin-bottom: 1rem;
        }
        .image-preview-container img {
            max-width: 100px; /* Table preview size */
            max-height: 70px;
            margin-top: 5px;
            border: 1px solid #ddd;
            padding: 2px;
            object-fit: cover;
        }
         .modal-image-preview img {
            max-width: 150px; /* Modal preview size */
            max-height: 100px;
            margin-top: 10px;
            border: 1px solid #ddd;
            padding: 2px;
            object-fit: cover;
        }
        .description-cell {
            max-width: 250px; /* Adjust as needed */
            white-space: normal;
            word-break: break-word;
        }
        /* Ensure date inputs show calendar icon */
        input[type="date"]::-webkit-calendar-picker-indicator {
            display: block;
            background: transparent; /* Optional: hide default icon if using custom */
        }
    </style>
</head>

<body>
    <div id="app">
        <div id="main" class="layout-horizontal">
            <header class="mb-5">
                <!-- Standard header include -->
                <div class="header-top">
                    <div class="container">
                        <div class="logo">
                            <a href="#"><img src="/backend/public/assets/compiled/svg/logo.svg" alt="Logo"></a>
                        </div>
                        <div class="header-top-right">
                            <a href="#" class="burger-btn d-block d-xl-none">
                                <i class="bi bi-justify fs-3"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <nav class="main-navbar">
                    <div class="container">
                        <ul>
                             <li class="menu-item">
                                <a href="#" class='menu-link'><span><i class="bi bi-pin-map-fill"></i> Top Destinations</span></a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>

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

    <!-- Include necessary JS -->
    <script src="/backend/public/assets/extensions/jquery/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/backend/public/assets/extensions/datatables.net/js/jquery.dataTables.min.js"></script>
    <script src="/backend/public/assets/extensions/datatables.net-bs5/js/dataTables.bootstrap5.min.js"></script>
    <script src="/backend/public/assets/static/js/pages/horizontal-layout.js"></script>
    <!-- <script src="/backend/public/assets/compiled/js/app.js"></script> -->

    <script>
        $(document).ready(function () {
            // Adjust these URLs based on your actual backend public path and API structure
            const API_BASE_URL = '/backend/public/TopDestination'; // Controller base
            const API_URL = '/backend/public'; // Base for image paths
            let destinationsTable;
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

            // Function to format date as YYYY-MM-DD
            function formatDateForInput(dateString) {
                if (!dateString) return '';
                try {
                    // Assuming dateString is like 'YYYY-MM-DD HH:MM:SS' or just 'YYYY-MM-DD'
                    const date = new Date(dateString.split(' ')[0]);
                    if (isNaN(date.getTime())) return ''; // Invalid date
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                } catch (e) {
                    console.error("Error formatting date:", dateString, e);
                    return '';
                }
            }

            // Initialize DataTable
            destinationsTable = $('#destinationsTable').DataTable({
                processing: true,
                serverSide: false,
                ajax: {
                    url: `${API_BASE_URL}/index`,
                    type: 'GET',
                    dataSrc: function(json) {
                        if (json.status === 200 && Array.isArray(json.data)) {
                            // Prepend API_URL to image paths
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

            // --- Image Preview Logic ---
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

            // Reset and open Add modal
            $('#addDestinationBtn').on('click', function() {
                $('#addEditForm')[0].reset();
                $('#destinationId').val('');
                $('#addEditModalLabel').text('Add New Destination');
                $('#imagePreview').hide().attr('src', '#');
                $('#currentImageText').hide().text('');
                $('#destination_image_input').prop('required', true); // Image required for adding
                currentImageFilename = null;
                addEditModal.show();
            });

            // Open Edit modal and populate data
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
                    $('#destination_begin').val(formatDateForInput(rowData.destination_begin)); // Format date for input
                    $('#destination_end').val(formatDateForInput(rowData.destination_end));     // Format date for input
                    $('#destination_offer').val(rowData.destination_offer);
                    $('#destination_category').val(rowData.destination_category);

                    $('#addEditModalLabel').text('Edit Destination');
                    $('#destination_image_input').prop('required', false); // Image not required for editing

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

                // Basic Validations (add more as needed)
                if (!formData.get('destination_name') || !formData.get('destination_country') || !formData.get('destination_price') || !formData.get('destination_description') || !formData.get('destination_begin') || !formData.get('destination_end') || !formData.get('destination_category')) {
                    alert('Please fill in all required fields.');
                    return;
                }
                 if (formData.get('destination_begin') > formData.get('destination_end')) {
                    alert('End date cannot be earlier than begin date.');
                    return;
                }


                // Handle file input based on add/edit
                if (isEdit && (!fileInput.files || fileInput.files.length === 0)) {
                    formData.delete('destination_image');
                } else if (!isEdit && (!fileInput.files || fileInput.files.length === 0)) {
                     alert('Please select an image file for the new destination.');
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

                // Note: Your React code used query param, adjust if backend expects path param
                const deleteUrl = `${API_BASE_URL}/delete?id=${currentDeleteId}`;
                // const deleteUrl = `${API_BASE_URL}/delete/${currentDeleteId}`; // Alternative if using path param

                $.ajax({
                    url: deleteUrl,
                    method: 'DELETE',
                    success: function(response) {
                         // Check for explicit success status or rely on HTTP status code (200 OK or 204 No Content)
                         // Assuming backend sends JSON like { status: 200, message: '...' }
                         if (response.status === 200) {
                            alert(response.message || 'Deletion successful!');
                            deleteModal.hide();
                            destinationsTable.ajax.reload();
                        } else {
                            // Handle cases where backend might send 204 No Content without a body
                            // Or if it sends an error JSON
                            alert('Error: ' + (response.message || 'Could not delete destination.'));
                        }
                    },
                    error: function(xhr) {
                         // Handle non-2xx responses
                         if (xhr.status === 204) { // Handle No Content specifically if needed
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