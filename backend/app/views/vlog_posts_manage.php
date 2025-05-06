<?php
// backend/app/views/vlog_posts_manage.php

// Helper function to generate action buttons
// Ensure BASE_URL/API_URL are correctly defined/accessible
$baseUrl = defined('BASE_URL') ? BASE_URL : '';
$apiUrl = defined('API_URL') ? API_URL : $baseUrl; // Use API_URL for images if defined, otherwise fallback

if (!function_exists('getVlogPostActionButtons')) {
    function getVlogPostActionButtons($post) {
        $postJson = htmlspecialchars(json_encode($post), ENT_QUOTES, 'UTF-8');
        $editButton = '<button type="button" class="btn btn-sm btn-outline-primary me-1 px-2 py-1" title="Edit" onclick=\'prepareEditModal(this)\' data-post=\''. $postJson .'\' data-bs-toggle="modal" data-bs-target="#addEditPostModal"><i class="bi bi-pencil-fill"></i></button>';
        $deleteButton = '<button type="button" class="btn btn-sm btn-outline-danger px-2 py-1" title="Delete" onclick=\'prepareDeleteModal(this)\' data-id="'. $post['id'] .'" data-title="'. htmlspecialchars($post['title'], ENT_QUOTES) .'" data-bs-toggle="modal" data-bs-target="#deletePostModal"><i class="bi bi-trash-fill"></i></button>';
        return '<div class="d-inline-flex">' . $editButton . $deleteButton . '</div>';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php include 'components/meta_header.php'; ?>
    <title><?php echo htmlspecialchars($data['pageTitle'] ?? 'Vlog Posts Management'); ?></title>
    <link rel="stylesheet" href="<?php echo $baseUrl; ?>/assets/extensions/datatables.net-bs5/css/dataTables.bootstrap5.min.css">
    <link rel="stylesheet" href="<?php echo $baseUrl; ?>/assets/compiled/css/table-datatable-jquery.css">
    <style>
        #manageTable th, #manageTable td { vertical-align: middle; }
        #manageTable th:nth-child(1), #manageTable td:nth-child(1) { width: 5%; }
        #manageTable th:nth-child(2), #manageTable td:nth-child(2) { width: 20%; max-width: 180px; }
        #manageTable th:nth-child(3), #manageTable td:nth-child(3) { width: 40%; max-width: 450px; }
        #manageTable th:nth-child(4), #manageTable td:nth-child(4) { width: 15%; }
        #manageTable th:nth-child(5), #manageTable td:nth-child(5) { width: 10%; }
        #manageTable th:nth-child(6), #manageTable td:nth-child(6) { width: 10%; }
        #manageTable td { white-space: normal !important; word-break: break-word; }
        .intro-snippet { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; white-space: normal; font-size: 0.85rem; color: #6c757d; line-height: 1.4; }
        
        /* Ensuring modal footer is always visible when body scrolls */
        .modal-dialog-scrollable .modal-body {
            overflow-y: auto;
            /* max-height is important, adjust as needed, vh units are good */
            max-height: calc(100vh - 210px); /* Example: 100% viewport height minus approx height of header, footer, and some padding */
        }

        .dataTables_wrapper .dataTables_filter { float: right; text-align: right; }
        .dataTables_wrapper .dt-length-filter-container { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .dataTables_wrapper .dt-length-filter-container .dataTables_filter { margin-left: auto; }
        .dataTables_wrapper .dt-length-filter-container .add-button-container { margin-left: 0.5rem; }
        #manageTable th.text-center, #manageTable td.text-center { text-align: center; }

        .form-group-inline { display: flex; flex-wrap: wrap; align-items: center; margin-bottom: 1rem; }
        .form-group-inline .form-label { margin-bottom: 0; margin-right: 0.5rem; white-space: nowrap; }
        .form-group-inline .form-control, .form-group-inline .form-select { flex-grow: 1; min-width: 150px; }
        .form-control::placeholder, .form-select::placeholder { color: #6c757d; opacity: 1; }

        /* Featured Image specific styling - REVISED */
        .featured-image-label {
            display: block; /* Ensures it takes its own line */
            margin-bottom: 0.5rem; /* Consistent with original */
            font-weight: 500; /* Consistent with original */
        }

        /* This class is now inside the left col-md-6 */
        .featured-image-input-controls {
            display: flex; /* Makes input and button sit side-by-side */
            align-items: center; /* Vertically aligns items in the flex container */
            width: 100%; /* Takes full width of its col-md-6 parent */
        }

        .featured-image-input-controls .form-control-file-input {
            flex-grow: 1; /* Allows the file input to take up the remaining space */
            min-width: 100px; /* Prevent it from becoming too small */
            /* margin-right: 0.5rem; /* Replaced by Bootstrap's me-2 utility class on the input element */
            /* max-width: 300px; /* Removed: Let flexbox and column handle width */
        }

        .featured-image-input-controls .btn-remove-image {
            flex-shrink: 0; /* Prevents the button from shrinking if file input has long name */
            /* white-space: nowrap; /* Moved to inline style for this specific button or can be kept here */
        }
        
        /* Container for the image preview - now in the right col-md-6 */
        .featured-image-preview-column .image-preview-container {
            width: 100%; /* Takes full width of its parent column (col-md-6) */
            min-height: 100px; /* Optional: provide some initial height for visual structure */
            display: flex; /* Using flex to help position the image */
            justify-content: flex-end; /* Aligns the image to the right of this container */
            align-items: flex-start; /* Aligns image to the top of this container */
            /* border: 1px dashed #eee; /* Optional: for visualizing bounds during development */
        }

        .img-thumbnail-modal {
            max-width: 100%;  /* Image will not exceed the width of its container (the right col-md-6) */
            height: auto;     /* Maintains aspect ratio */
            object-fit: contain; /* Ensures the entire image is visible, scaled down if necessary, maintaining ratio */
            border-radius: 0.375rem; /* Bootstrap's default thumbnail radius */
            border: 1px solid #dee2e6; /* Bootstrap's default thumbnail border */
            display: block; /* Behaves like a block element */
            /* max-height: 250px; /* Optional: if you want to constrain the preview height */
        }

        @media (max-width: 767.98px) { /* Styles for when Bootstrap columns stack (below md breakpoint) */
            /* .form-group-inline adjustments from original */
            .form-group-inline { flex-direction: column; align-items: flex-start; }
            .form-group-inline .form-label { margin-right: 0; margin-bottom: 0.25rem; }
            .form-group-inline .form-control, .form-group-inline .form-select { width: 100%; }

            /* Featured image adjustments for stacked layout */
            .featured-image-preview-column { /* The right column containing the preview */
                margin-top: 1rem; /* Add some space above the preview when it stacks below controls */
            }

            .featured-image-input-controls {
                flex-wrap: wrap; /* Allow input and button to wrap if needed on very small screens */
            }
            
            .featured-image-input-controls .form-control-file-input {
                width: 100%; /* Make file input take full width */
                margin-right: 0; /* Remove right margin */
                margin-bottom: 0.5rem; /* Add space below if button wraps under it */
            }

            .featured-image-input-controls .btn-remove-image {
                width: 100%; /* Make remove button take full width if it wraps */
                margin-left: 0; /* Ensure no left margin if it was added by other rules */
            }

            .featured-image-preview-column .image-preview-container {
                justify-content: flex-start; /* Align image to the left when stacked */
            }

            .img-thumbnail-modal {
                /* width: 100%; /* Already max-width: 100%, so it will fill the stacked column width */
                /* max-height: 200px; /* Optional: Adjust max height for stacked mobile view */
            }
        }
    </style>
</head>
<body>
    <div id="app">
        <div id="main" class="layout-horizontal">
            <?php include 'components/header.php'; ?>
            <div class="content-wrapper container">
                <div class="page-heading">
                    <div class="page-title"><div class="row"><div class="col-12"><h3><?php echo htmlspecialchars($data['pageTitle'] ?? 'Vlog Posts Management'); ?></h3></div></div></div>
                </div>
                <div class="page-content">
                    <section class="section">
                        <div class="card">
                            <div class="card-body">
                                <?php
                                    if(isset($_SESSION['flash_success'])){ echo '<div class="alert alert-light-success color-success alert-dismissible fade show" role="alert">'.$_SESSION['flash_success'].'<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'; unset($_SESSION['flash_success']); }
                                    if(isset($_SESSION['flash_error'])){ echo '<div class="alert alert-light-danger color-danger alert-dismissible fade show" role="alert">'.$_SESSION['flash_error'].'<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'; unset($_SESSION['flash_error']); }
                                ?>
                                <div id="addButtonContainer" style="display: none;"><button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addEditPostModal" onclick="prepareAddModal()"><i class="bi bi-plus-lg"></i> New Post</button></div>
                                <div class="table-responsive">
                                    <table class="table table-striped table-hover table-bordered" id="manageTable">
                                        <thead><tr><th class="text-center">ID</th><th>Title</th><th>Introduction</th><th class="text-center">Author</th><th class="text-center">Status</th><th class="text-center">Actions</th></tr></thead>
                                        <tbody>
                                            <?php if (empty($data['vlogPosts'])): ?>
                                                <tr><td colspan="6" class="text-center">No vlog posts found.</td></tr>
                                            <?php else: ?>
                                                <?php foreach ($data['vlogPosts'] as $post): ?>
                                                    <tr>
                                                        <td class="text-center"><?php echo htmlspecialchars($post['id']); ?></td>
                                                        <td><a href="<?php echo $baseUrl . '/vlog/' . htmlspecialchars($post['slug']); ?>" target="_blank" title="View Post: <?php echo htmlspecialchars($post['title']); ?>"><?php echo htmlspecialchars($post['title']); ?></a></td>
                                                        <td><div class="intro-snippet" title="<?php echo htmlspecialchars($post['introduction'] ?? ''); ?>"><?php echo htmlspecialchars(substr($post['introduction'] ?? '', 0, 120)) . (strlen($post['introduction'] ?? '') > 120 ? '...' : ''); ?></div></td>
                                                        <td class="text-center"><?php echo htmlspecialchars($post['author_name'] ?? 'N/A'); ?></td>
                                                        <td class="text-center"><?php if ($post['status'] === 'published'): ?> <span class="badge bg-success">Published</span> <?php else: ?> <span class="badge bg-light-secondary">Draft</span> <?php endif; ?></td>
                                                        <td class="text-center"><?php echo getVlogPostActionButtons($post); ?></td>
                                                    </tr>
                                                <?php endforeach; ?>
                                            <?php endif; ?>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>

<div class="modal fade" id="addEditPostModal" tabindex="-1" aria-labelledby="addEditPostModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header"><h5 class="modal-title" id="addEditPostModalLabel">Add/Edit Vlog Post</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
            <form id="addEditPostForm" method="POST" action="<?php echo $baseUrl; ?>/vlogPost/save" enctype="multipart/form-data">
                <div class="modal-body"> 
                    <input type="hidden" name="id" id="postId">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group-inline">
                                <label for="postAuthorId" class="form-label">Author ID <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" name="user_id" id="postAuthorId" value="1" required placeholder="Numeric ID of author">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group-inline">
                                <label for="postStatus" class="form-label">Status <span class="text-danger">*</span></label>
                                <select class="form-select" name="status" id="postStatus" required><option value="draft">Draft</option><option value="published">Published</option></select>
                            </div>
                        </div>
                    </div>
                    <div class="mb-3"><label for="postTitle" class="form-label">Title <span class="text-danger">*</span></label><input type="text" class="form-control" name="title" id="postTitle" required placeholder="Enter post title"></div>
                    <div class="mb-3"><label for="postIntroduction" class="form-label">Introduction</label><textarea class="form-control" name="introduction" id="postIntroduction" rows="3" placeholder="Short summary shown in list views (optional)"></textarea></div>
                    <div class="mb-3"><label for="postContent" class="form-label">Content <span class="text-danger">*</span></label><textarea class="form-control" name="content" id="postContent" rows="8" required placeholder="The main content of the post."></textarea></div>

                    <div class="mb-3">
                        <label class="featured-image-label d-block mb-2">Featured Image</label>
                        <div class="row align-items-start">
                            <div class="col-md-6 featured-image-controls-column">
                                <div class="featured-image-input-controls mb-2"> <input type="file" class="form-control form-control-sm form-control-file-input me-2" name="featured_image" id="postImage" accept="image/*">
                                    <button type="button" class="btn btn-danger btn-sm btn-remove-image" id="btnRemoveImage" style="display: none; white-space: nowrap;">Remove</button>
                                </div>
                                <input type="checkbox" value="1" name="remove_featured_image" id="removeImageCheck" style="display:none;">
                            </div>
                            <div class="col-md-6 featured-image-preview-column">
                                <div class="image-preview-container" id="imagePreviewContainer">
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Save Post</button>
                </div>
            </form>
        </div>
    </div>
</div>

<div class="modal fade" id="deletePostModal" tabindex="-1" aria-labelledby="deletePostModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <form id="deletePostForm" method="POST" action="<?php echo $baseUrl; ?>/vlogPost/delete">
                <div class="modal-header"><h5 class="modal-title" id="deletePostModalLabel">Delete Vlog Post</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                <div class="modal-body"><p>Are you sure you want to delete the post "<strong id="deletePostTitle"></strong>"?</p><input type="hidden" name="id" id="deletePostId"></div>
                <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button type="submit" class="btn btn-danger">Delete</button></div>
            </form>
        </div>
    </div>
</div>

<?php include 'components/script.php'; ?>
<script src="<?php echo $baseUrl; ?>/assets/extensions/jquery/jquery.min.js"></script>
<script src="<?php echo $baseUrl; ?>/assets/extensions/datatables.net/js/jquery.dataTables.min.js"></script>
<script src="<?php echo $baseUrl; ?>/assets/extensions/datatables.net-bs5/js/dataTables.bootstrap5.min.js"></script>
<script>
    $(document).ready(function () {
        $('#manageTable').DataTable({
            "order": [[ 0, "desc" ]], "columnDefs": [ { "orderable": false, "targets": [2, 5] } ],
            "dom": '<"dt-length-filter-container"<"dt-length"l><"dt-filter"f>>rt<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
            "language": { "search": "_INPUT_", "searchPlaceholder": "Search posts...", "lengthMenu": "Show _MENU_ entries", "info": "Showing _START_ to _END_ of _TOTAL_ entries", "paginate": { "first": "First", "last": "Last", "next": "Next", "previous": "Previous" } },
            "initComplete": function(settings, json) {
                var filterWrapper = $('#manageTable_filter'); $("#addButtonContainer").appendTo(filterWrapper).show();
                filterWrapper.addClass("d-flex justify-content-end align-items-center"); filterWrapper.find('label').addClass("me-2"); $("#addButtonContainer").addClass("ms-2");
            }
        });

        $('#btnRemoveImage').on('click', function() {
            $('#imagePreviewContainer').html(''); $('#postImage').val('');
            $('#removeImageCheck').prop('checked', true); $(this).hide();
        });
    });

    function prepareAddModal() {
        $('#addEditPostForm')[0].reset(); $('#postId').val(''); $('#postAuthorId').val('1');
        $('#addEditPostModalLabel').text('Add New Vlog Post');
        $('#imagePreviewContainer').html(''); $('#btnRemoveImage').hide();
        $('#removeImageCheck').prop('checked', false);
        $('#postIntroduction').val(''); $('#postContent').val(''); $('#postStatus').val('draft');
        $('#postImage').val('');
    }

    function prepareEditModal(button) {
        const postData = $(button).data('post');
        if (!postData || typeof postData !== 'object') { console.error("Could not retrieve post data.", button); alert("Error: Could not load post data."); return; }
        $('#addEditPostForm')[0].reset();
        $('#postId').val(postData.id); $('#postAuthorId').val(postData.user_id || '1');
        $('#postTitle').val(postData.title); $('#postIntroduction').val(postData.introduction || ''); $('#postContent').val(postData.content);
        $('#postStatus').val(postData.status || 'draft'); $('#addEditPostModalLabel').text('Edit Post');
        $('#imagePreviewContainer').html(''); $('#postImage').val('');
        $('#removeImageCheck').prop('checked', false);

        if (postData.featured_image_url) {
            const imageUrl = postData.featured_image_url.startsWith('/') ? '<?php echo $apiUrl ?? $baseUrl; ?>' + postData.featured_image_url : postData.featured_image_url;
            $('#imagePreviewContainer').html(`<img src="${imageUrl}" alt="Current Image" class="img-thumbnail-modal">`);
            $('#btnRemoveImage').show();
        } else {
        $('#btnRemoveImage').hide();
        }
    }

    function prepareDeleteModal(button) {
        const id = $(button).data('id'); const title = $(button).data('title');
        $('#deletePostId').val(id); $('#deletePostTitle').text(title || 'this post');
    }

    $('#postImage').on('change', function(event){
        const file = event.target.files[0];
        $('#imagePreviewContainer').html('');
        $('#removeImageCheck').prop('checked', false);

        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) { alert("Invalid file type."); $(this).val(''); $('#btnRemoveImage').hide(); return; }
            if (file.size > 5 * 1024 * 1024) { alert("File size exceeds 5MB."); $(this).val(''); $('#btnRemoveImage').hide(); return; }
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#imagePreviewContainer').html(`<img src="${e.target.result}" alt="New image preview" class="img-thumbnail-modal">`);
            }
            reader.readAsDataURL(file);
            $('#btnRemoveImage').show();
        } else {
            if (!$('#imagePreviewContainer img').length) {
                $('#btnRemoveImage').hide();
            }
        }
    });
</script>
</body>
</html>