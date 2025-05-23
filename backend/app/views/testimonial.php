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
    <title>Testimonials Management</title>
</head>

<body>
    <div id="app">
        <div id="main" class="layout-horizontal">
            <?php include_once 'components/header.php'; ?>

            <div class="container">
                <div class="page-heading">
                    <h3>Testimonials Management</h3>
                </div>
                <div class="page-content">
                    <section class="row">
                        <div class="col-12">
                            <button class="btn btn-primary mb-3" id="addTestimonialBtn">Add New Testimonial</button>
                            <div class="card">
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-striped" id="testimonialsTable">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Image</th>
                                                    <th>Name</th>
                                                    <th>Location</th>
                                                    <th>Rating</th>
                                                    <th>Testimonial</th>
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
                    <h5 class="modal-title" id="addEditModalLabel">Add/Edit Testimonial</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="addEditForm" enctype="multipart/form-data">
                    <div class="modal-body">
                        <input type="hidden" id="testimonialId">
                        <div class="form-group">
                            <label for="user_image_input">User Image</label>
                            <input type="file" class="form-control" id="user_image_input" name="user_image" accept="image/*">
                            <small class="form-text text-muted">Leave blank to keep the current image when editing.</small>
                            <div id="imagePreviewContainer" class="mt-2 modal-image-preview">
                                <img id="imagePreview" src="#" alt="Image Preview" style="display: none;" />
                                <span id="currentImageText"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="user_name">User Name</label>
                            <input type="text" class="form-control" id="user_name" name="user_name" required>
                        </div>
                         <div class="form-group">
                            <label for="user_location">User Location</label>
                            <input type="text" class="form-control" id="user_location" name="user_location" required placeholder="e.g., London, UK">
                        </div>
                         <div class="form-group">
                            <label for="user_stars">Rating (1-5)</label>
                            <input type="number" class="form-control" id="user_stars" name="user_stars" required min="1" max="5" step="1">
                        </div>
                        <div class="form-group">
                            <label for="user_testimonial">Testimonial Text</label>
                            <textarea class="form-control" id="user_testimonial" name="user_testimonial" rows="4" required></textarea>
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
                    Are you sure you want to delete this testimonial?
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
            const API_BASE_URL = "<?php echo getenv('BASE_URL');?>Testimonial";
            const API_URL = "<?php echo getenv('BASE_URL');?>";
            let testimonialsTable;
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

             // render stars
            function renderStars(rating) {
                let starsHtml = '<span class="star-rating">';
                const filledStars = parseInt(rating) || 0;
                for (let i = 0; i < 5; i++) {
                    starsHtml += `<i class="fa-solid fa-star${i < filledStars ? ' filled' : ''}"></i>`;
                }
                starsHtml += '</span>';
                return starsHtml;
            }

            testimonialsTable = $('#testimonialsTable').DataTable({
                processing: true,
                serverSide: false,
                ajax: {
                    url: `${API_BASE_URL}/index`,
                    type: 'GET',
                    dataSrc: function(json) {
                        if (json.status === 200 && Array.isArray(json.data)) {
                            return json.data.map(t => ({
                                ...t,
                                fullImagePath: t.user_image ? `${API_URL}${t.user_image}` : null,
                                user_stars: parseInt(t.user_stars, 10) || 0
                            }));
                        } else {
                            console.error("Error fetching data:", json.message || 'Invalid data format');
                            alert('Could not load testimonials data.');
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
                                return `<div class="image-preview-container"><img src="${data}" alt="${row.user_name || 'User Image'}"></div>`;
                            }
                            return '<span class="text-muted">No Image</span>';
                        },
                        orderable: false,
                        searchable: false
                    },
                    { data: 'user_name' },
                    { data: 'user_location' },
                    {
                        data: 'user_stars',
                        render: function(data, type, row) {
                            return `${renderStars(data)} (${data})`;
                        }
                    },
                    { data: 'user_testimonial', className: 'testimonial-cell' },
                    {
                        data: 'id',
                        orderable: false,
                        searchable: false,
                        render: function (data, type, row) {
                            return `
                                <button class="btn btn-sm btn-warning edit-btn" data-id="${data}" title="Edit Testimonial">Edit</button>
                                <button class="btn btn-sm btn-danger delete-btn" data-id="${data}" title="Delete Testimonial">Delete</button>
                            `;
                        }
                    }
                ]
            });

            // --- Image Preview Logic ---
            $('#user_image_input').on('change', function(event) {
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
            $('#addTestimonialBtn').on('click', function() {
                $('#addEditForm')[0].reset();
                $('#testimonialId').val('');
                $('#addEditModalLabel').text('Add New Testimonial');
                $('#imagePreview').hide().attr('src', '#');
                $('#currentImageText').hide().text('');
                $('#user_image_input').prop('required', true);
                $('#user_stars').val(0);
                currentImageFilename = null;
                addEditModal.show();
            });

            // Open Edit modal và populate data
            $('#testimonialsTable tbody').on('click', '.edit-btn', function () {
                const id = $(this).data('id');
                const rowData = testimonialsTable.rows().data().toArray().find(t => t.id == id);

                if (rowData) {
                    $('#addEditForm')[0].reset();
                    $('#testimonialId').val(rowData.id);
                    $('#user_name').val(rowData.user_name);
                    $('#user_location').val(rowData.user_location);
                    $('#user_stars').val(rowData.user_stars);
                    $('#user_testimonial').val(rowData.user_testimonial);
                    $('#addEditModalLabel').text('Edit Testimonial');
                    $('#user_image_input').prop('required', false); // Image not required for editing

                    const preview = $('#imagePreview');
                    const currentImageText = $('#currentImageText');
                    currentImageFilename = rowData.user_image ? rowData.user_image.split('/').pop() : null;

                    if (rowData.fullImagePath) {
                        preview.attr('src', rowData.fullImagePath).show();
                        currentImageText.hide();
                    } else {
                        preview.hide().attr('src', '#');
                        currentImageText.text('No current image').show();
                    }

                    addEditModal.show();
                } else {
                    alert('Could not find data for this testimonial.');
                }
            });

            // Open Delete confirmation modal
            $('#testimonialsTable tbody').on('click', '.delete-btn', function () {
                currentDeleteId = $(this).data('id');
                deleteModal.show();
            });

            // --- Form Submission (Add/Edit) ---
            $('#addEditForm').on('submit', function(e) {
                e.preventDefault();

                const id = $('#testimonialId').val();
                const isEdit = !!id;
                const formData = new FormData(this);
                const fileInput = $('#user_image_input')[0];
                const stars = parseInt(formData.get('user_stars'), 10);

                if (!formData.get('user_name') || !formData.get('user_location') || !formData.get('user_testimonial')) {
                    alert('Please fill in Name, Location, and Testimonial text.');
                    return;
                }
                 if (isNaN(stars) || stars < 1 || stars > 5) {
                    alert('Rating must be a number between 1 and 5.');
                    return;
                }

                if (isEdit && (!fileInput.files || fileInput.files.length === 0)) {
                    formData.delete('user_image');
                } else if (!isEdit && (!fileInput.files || fileInput.files.length === 0)) {
                     alert('Please select an image file for the new testimonial.');
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
                            testimonialsTable.ajax.reload();
                        } else {
                             alert('Error: ' + (response.message || 'Could not save testimonial.'));
                        }
                    },
                    error: function(xhr) {
                        handleAjaxError(xhr, 'Failed to save testimonial.');
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
                            testimonialsTable.ajax.reload();
                        } else {
                            alert('Error: ' + (response.message || 'Could not delete testimonial.'));
                        }
                    },
                    error: function(xhr) {
                         handleAjaxError(xhr, 'Failed to delete testimonial.');
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