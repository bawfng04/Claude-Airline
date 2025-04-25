<?php
// Base URL definition might be needed here depending on your setup.
// Defined directly in JavaScript for now.
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
        .action-column button {
            margin-right: 5px;
        }
        .table-responsive {
            margin-top: 20px;
        }
        .modal-body .form-group {
            margin-bottom: 1rem;
        }
        .embed-code-display {
            max-width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: help;
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
                            <!-- User dropdown etc. -->
                            <a href="#" class="burger-btn d-block d-xl-none">
                                <i class="bi bi-justify fs-3"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <nav class="main-navbar">
                    <div class="container">
                        <ul>
                            <!-- Navigation items -->
                             <li class="menu-item">
                                <a href="#" class='menu-link'><span><i class="bi bi-geo-alt-fill"></i> Location Management</span></a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>

            <div class="container">
                <div class="page-heading">
                    <h3>Contact Location Management</h3>
                </div>
                <div class="page-content">
                    <section class="row">
                        <div class="col-12">
                            <button class="btn btn-primary mb-3" id="addLocationBtn">Add New Location</button>
                            <div class="card">
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-striped" id="locationsTable">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Name</th>
                                                    <th>Type</th>
                                                    <th>Address</th>
                                                    <th>Phone</th>
                                                    <th>Working Hours</th>
                                                    <th>Email</th>
                                                    <th>Embed Code</th>
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
                    <h5 class="modal-title" id="addEditModalLabel">Add/Edit Location</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="addEditForm">
                    <div class="modal-body">
                        <input type="hidden" id="locationId">
                        <div class="form-group">
                            <label for="location_name">Location Name</label>
                            <input type="text" class="form-control" id="location_name" name="location_name" required>
                        </div>
                        <div class="form-group">
                            <label for="des_type">Location Type</label>
                            <select class="form-control" id="des_type" name="des_type" required>
                                <option value="">Select type</option>
                                <option value="Main Office">Main Office</option>
                                <option value="Branch Office">Branch Office</option>
                                <!-- Add other types if needed -->
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="address_string">Address</label>
                            <input type="text" class="form-control" id="address_string" name="address_string" required>
                        </div>
                        <div class="form-group">
                            <label for="phone_number">Phone Number</label>
                            <input type="text" class="form-control" id="phone_number" name="phone_number" required pattern="^\+?[0-9]{10,15}$" title="Valid phone number (10-15 digits, optionally starting with +)">
                        </div>
                        <div class="form-group">
                            <label for="working_hours">Working Hours</label>
                            <input type="text" class="form-control" id="working_hours" name="working_hours" required>
                        </div>
                         <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" class="form-control" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="location_embed_code">Map Embed Code</label>
                            <textarea class="form-control" id="location_embed_code" name="location_embed_code" rows="3" required></textarea>
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
                    Are you sure you want to delete this location?
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
    <!-- <script src="/backend/public/assets/compiled/js/app.js"></script> --> <!-- Might conflict with Bootstrap 5.3 -->

    <script>
        $(document).ready(function () {
            // Adjust this URL based on your actual backend public path
            const API_BASE_URL = '/backend/public/ContactLocation';
            let locationsTable;
            let currentDeleteId = null;
            const addEditModal = new bootstrap.Modal(document.getElementById('addEditModal'));
            const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

            // Function to handle AJAX errors
            function handleAjaxError(xhr, defaultMessage) {
                console.error("AJAX error:", xhr.responseText);
                let errorMsg = defaultMessage || 'A server error occurred.';
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMsg = xhr.responseJSON.message;
                } else {
                    try { // Try parsing if not auto-parsed
                        const errResponse = JSON.parse(xhr.responseText);
                        errorMsg = errResponse.message || errorMsg;
                    } catch (e) { /* Ignore parsing error */ }
                }
                alert('Error: ' + errorMsg);
            }

            // Initialize DataTable
            locationsTable = $('#locationsTable').DataTable({
                processing: true,
                serverSide: false, // Keep false if loading all data at once
                ajax: {
                    url: `${API_BASE_URL}/index`,
                    type: 'GET',
                    dataSrc: function(json) {
                        if (json.status === 200 && Array.isArray(json.data)) {
                            return json.data;
                        } else {
                            console.error("Error fetching data:", json.message || 'Invalid data format');
                            alert('Could not load location data.');
                            return [];
                        }
                    },
                    error: function (xhr, error, thrown) {
                        handleAjaxError(xhr, 'Failed to connect to the server.');
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
                            // Show a truncated version or placeholder
                            if (data && data.trim() !== '') {
                                // Simple check if it looks like an iframe
                                const isIframe = data.toLowerCase().includes('<iframe');
                                const display_text = isIframe ? 'View Embed' : data;
                                return `<div class="embed-code-display" title="${data}">${display_text}</div>`;
                            }
                            return '<span class="text-muted">Not set</span>';
                        }
                    },
                    {
                        data: 'id',
                        orderable: false,
                        searchable: false,
                        render: function (data, type, row) {
                            return `
                                <button class="btn btn-sm btn-warning edit-btn" data-id="${data}" title="Edit Location">Edit</button>
                                <button class="btn btn-sm btn-danger delete-btn" data-id="${data}" title="Delete Location">Delete</button>
                            `;
                        }
                    }
                ],
                // Use default English language settings
                // language: { url: "//cdn.datatables.net/plug-ins/1.10.25/i18n/English.json" } // Optional: Explicitly set English
            });

            // --- Modal Handling ---

            // Reset and open Add modal
            $('#addLocationBtn').on('click', function() {
                $('#addEditForm')[0].reset();
                $('#locationId').val(''); // Clear ID for adding
                $('#addEditModalLabel').text('Add New Location');
                addEditModal.show();
            });

            // Delegate click event for edit buttons
            $('#locationsTable tbody').on('click', '.edit-btn', function () {
                const id = $(this).data('id');
                // Find the row data using DataTables API for efficiency
                const rowData = locationsTable.rows().data().toArray().find(loc => loc.id == id);

                if (rowData) {
                    // Populate form fields
                    $('#locationId').val(rowData.id);
                    $('#location_name').val(rowData.location_name);
                    $('#des_type').val(rowData.des_type);
                    $('#address_string').val(rowData.address_string);
                    $('#phone_number').val(rowData.phone_number);
                    $('#working_hours').val(rowData.working_hours);
                    $('#email').val(rowData.email);
                    $('#location_embed_code').val(rowData.location_embed_code);

                    $('#addEditModalLabel').text('Edit Location');
                    addEditModal.show();
                } else {
                    alert('Could not find data for this location.');
                }
            });

            // Delegate click event for delete buttons
            $('#locationsTable tbody').on('click', '.delete-btn', function () {
                currentDeleteId = $(this).data('id');
                // Optional: Add location name to confirmation message
                // const rowData = locationsTable.row($(this).parents('tr')).data();
                // $('#deleteModal .modal-body').text(`Are you sure you want to delete "${rowData.location_name}"?`);
                deleteModal.show();
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
                        // Check for explicit success status or rely on HTTP status codes
                        if (response.status === 200 || response.status === 201) {
                            alert(response.message || (isEdit ? 'Update successful!' : 'Creation successful!'));
                            addEditModal.hide();
                            locationsTable.ajax.reload(); // Reload table data
                        } else {
                             alert('Error: ' + (response.message || 'Could not save location.'));
                        }
                    },
                    error: function(xhr) {
                        handleAjaxError(xhr, 'Failed to save location.');
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
                            locationsTable.ajax.reload(); // Reload table data
                        } else {
                            alert('Error: ' + (response.message || 'Could not delete location.'));
                        }
                    },
                    error: function(xhr) {
                         handleAjaxError(xhr, 'Failed to delete location.');
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