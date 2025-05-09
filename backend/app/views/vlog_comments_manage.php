<?php
if (!function_exists('getVlogCommentActionButtons')) {
    function getVlogCommentActionButtons($comment) {
        $conditionalButton = '';

        if (!$comment['is_approved']) {
            $approveActionUrl = base_url('vlogComment/approve');
            $conditionalButton = '<form method="POST" action="'. $approveActionUrl .'" style="display: inline-block; margin: 0 1px;" onsubmit="return confirm(\'Approve this comment?\');">
                                    <input type="hidden" name="id" value="'.$comment['id'].'">
                                    <button type="submit" class="btn btn-sm btn-success px-2 py-1" title="Approve"><i class="bi bi-check-lg"></i></button>
                                </form>';
        } else {
            $disapproveActionUrl = base_url('vlogComment/disapprove');
            $conditionalButton = '<form method="POST" action="'. $disapproveActionUrl .'" style="display: inline-block; margin: 0 1px;" onsubmit="return confirm(\'Disapprove this comment? This will set it back to pending.\');">
                                    <input type="hidden" name="id" value="'.$comment['id'].'">
                                    <button type="submit" class="btn btn-sm btn-warning px-2 py-1" title="Disapprove"><i class="bi bi-x-lg"></i></button>
                                </form>';
        }

        $deleteBtn = '<button type="button" class="btn btn-sm btn-danger px-2 py-1" style="display: inline-block; margin: 0 1px;" title="Delete" onclick=\'prepareDeleteCommentModal(this)\' data-id="'. $comment['id'] .'" data-comment="'. htmlspecialchars($comment['comment'], ENT_QUOTES) .'" data-bs-toggle="modal" data-bs-target="#deleteCommentModal"><i class="bi bi-trash-fill"></i></button>';
        
        return '<div class="d-inline-flex">' . $conditionalButton . $deleteBtn . '</div>';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php include 'components/meta_header.php'; ?>
    <title><?php echo htmlspecialchars($data['pageTitle'] ?? 'Vlog Comments Management'); ?></title>
    <link rel="stylesheet" href="<?php echo base_url(); ?>assets/extensions/datatables.net-bs5/css/dataTables.bootstrap5.min.css">
    <link rel="stylesheet" href="<?php echo base_url(); ?>assets/compiled/css/table-datatable-jquery.css">
    <style>
        #manageTable th, #manageTable td { vertical-align: middle; }
        #manageTable th:nth-child(1), #manageTable td:nth-child(1) { width: 16%; } 
        #manageTable th:nth-child(2), #manageTable td:nth-child(2) { width: 34%; max-width: 350px; } 
        #manageTable th:nth-child(3), #manageTable td:nth-child(3) { width: 23%; max-width: 180px; } 
        #manageTable th:nth-child(4), #manageTable td:nth-child(4) { width: 6%; } 
        #manageTable th:nth-child(5), #manageTable td:nth-child(5) { width: 6%; } 
        #manageTable th:nth-child(6), #manageTable td:nth-child(6) { width: 6%; } 
        #manageTable th:nth-child(7), #manageTable td:nth-child(7) { width: 8%; } 

        #manageTable td { white-space: normal !important; word-break: break-word; }
        .comment-snippet { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; white-space: normal; font-size: 0.85rem; color: #6c757d; line-height: 1.4; }
        .modal-body { max-height: 75vh; overflow-y: auto; }
        .dataTables_wrapper .dataTables_filter { float: right; text-align: right; }
        .dataTables_wrapper .dt-length-filter-container { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .dataTables_wrapper .dt-length-filter-container .dataTables_filter { margin-left: auto; }
        .dataTables_wrapper .dataTables_filter input[type="search"] {
            min-width: 280px; /* Increased width */
            height: calc(1.5em + .75rem + 2px); /* Standard Bootstrap input height */
            padding: .375rem .75rem; /* Standard Bootstrap padding */
            font-size: 1rem; /* Standard Bootstrap font size */
            line-height: 1.5;
            border-radius: .25rem; /* Standard Bootstrap border-radius */
        }
        #manageTable th.text-center, #manageTable td.text-center { text-align: center; }
        #manageTable td:nth-child(1) i { margin-right: 0.3rem; }
    </style>
</head>
<body>
    <div id="app">
        <div id="main" class="layout-horizontal">
            <?php include 'components/header.php'; ?>

            <div class="content-wrapper container">
                <div class="page-heading">
                    <h3><?php echo htmlspecialchars($data['pageTitle'] ?? 'Vlog Comments Management'); ?></h3>
                </div>
                <div class="page-content">
                    <section class="section">
                        <div class="card">
                            <div class="card-body">
                                <?php
                                    if(isset($_SESSION['flash_success'])){ echo '<div class="alert alert-light-success color-success alert-dismissible fade show" role="alert">'.$_SESSION['flash_success'].'<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'; unset($_SESSION['flash_success']); }
                                    if(isset($_SESSION['flash_error'])){ echo '<div class="alert alert-light-danger color-danger alert-dismissible fade show" role="alert">'.$_SESSION['flash_error'].'<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'; unset($_SESSION['flash_error']); }
                                ?>
                                <div class="table-responsive">
                                    <table class="table table-striped table-hover table-bordered" id="manageTable">
                                        <thead>
                                            <tr>
                                                <th class="text-center">Author</th>
                                                <th class="text-center">Comment</th>
                                                <th class="text-center">Post</th>
                                                <th class="text-center">Rating</th>
                                                <th class="text-center">Likes</th> 
                                                <th class="text-center">Status</th>
                                                <th class="text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php if (empty($data['vlogComments'])): ?>
                                                <tr><td colspan="7" class="text-center">No vlog comments found.</td></tr>
                                            <?php else: ?>
                                                <?php foreach ($data['vlogComments'] as $comment): ?>
                                                    <tr>
                                                        <td>
                                                            <?php if ($comment['user_id']): ?>
                                                                <i class="bi bi-person-fill text-muted" title="Registered User"></i> <?php echo htmlspecialchars($comment['user_name'] ?? 'User '.$comment['user_id']); ?>
                                                            <?php else: ?>
                                                                <i class="bi bi-person-badge text-info" title="Guest User"></i> <?php echo htmlspecialchars($comment['guest_name'] ?? 'Guest'); ?>
                                                            <?php endif; ?>
                                                        </td>
                                                        <td> <div class="comment-snippet" title="<?php echo htmlspecialchars($comment['comment']); ?>"><?php echo htmlspecialchars(substr($comment['comment'], 0, 100)) . (strlen($comment['comment']) > 100 ? '...' : ''); ?></div> </td>
                                                        <td><a href="<?php echo base_url('vlog/' . ($comment['post_slug'] ?? '')); ?>" target="_blank" title="<?php echo htmlspecialchars($comment['post_title'] ?? 'View Post'); ?>"><?php echo htmlspecialchars(substr($comment['post_title'] ?? 'N/A', 0, 30)) . (strlen($comment['post_title'] ?? '') > 30 ? '...' : ''); ?></a></td>
                                                        <td class="text-center"><?php echo $comment['rating'] ? '<i class="bi bi-star-fill text-warning"></i> ' . $comment['rating'] : '-'; ?></td>
                                                        <td class="text-center"><?php echo htmlspecialchars($comment['likes'] ?? 0); ?></td> 
                                                        <td class="text-center"> <?php if ($comment['is_approved']): ?> <span class="badge bg-success">Approved</span> <?php else: ?> <span class="badge bg-warning">Pending</span> <?php endif; ?> </td>
                                                        <td class="text-center text-nowrap"><?php echo getVlogCommentActionButtons($comment); ?></td>
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

    <div class="modal fade" id="deleteCommentModal" tabindex="-1" aria-labelledby="deleteCommentModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form method="POST" action="<?php echo base_url('vlogComment/delete'); ?>" onsubmit="return confirm('Are you absolutely sure you want to delete this comment? This action cannot be undone.');">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteCommentModalLabel">Confirm Delete</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure you want to delete the following comment?</p>
                        <blockquote class="blockquote">
                            <p id="deleteCommentText" class="mb-0"></p>
                        </blockquote>
                        <input type="hidden" name="id" id="deleteCommentId" value="">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-danger">Delete Comment</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <?php include 'components/script.php'; ?>
    <script src="<?php echo base_url(); ?>assets/extensions/jquery/jquery.min.js"></script>
    <script src="<?php echo base_url(); ?>assets/extensions/datatables.net/js/jquery.dataTables.min.js"></script>
    <script src="<?php echo base_url(); ?>assets/extensions/datatables.net-bs5/js/dataTables.bootstrap5.min.js"></script>
    <script>
        $(document).ready(function () {
            $('#manageTable').DataTable({
                "order": [[5, "dsc"], [0, "asc"]], 
                "columnDefs": [
                    { "orderable": false, "targets": [1, 6] }, 
                    { "orderable": true, "targets": [0, 2, 3, 4, 5] } 
                ],
                "language": {
                    "search": "_INPUT_",
                    "searchPlaceholder": "Search comments...",
                    "lengthMenu": "Show _MENU_ entries",
                    "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                    "paginate": { "first": "First", "last": "Last", "next": "Next", "previous": "Previous" }
                }
            });
        });

        function prepareDeleteCommentModal(button) {
            const id = $(button).data('id');
            const commentText = $(button).data('comment'); 
            $('#deleteCommentId').val(id);
            const excerpt = commentText ? (commentText.substring(0, 150) + (commentText.length > 150 ? '...' : '')) : 'this comment';
            $('#deleteCommentText').text(excerpt);
        }
    </script>

</body>
</html>