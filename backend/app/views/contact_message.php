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
    <title>Contact Messages Management</title>
    <style>
        .status-unread { background-color: #ffeeba; color: #856404; }
        .status-read { background-color: #c3e6cb; color: #155724; }
        .status-replied { background-color: #d1ecf1; color: #0c5460; }
        .badge { padding: 0.35em 0.65em; font-size: .75em; font-weight: 700; line-height: 1; text-align: center; white-space: nowrap; vertical-align: baseline; border-radius: 0.25rem; }
    </style>
</head>

<body>
    <div id="app">
        <div id="main" class="layout-horizontal">
            <?php include 'components/header.php'; ?>

            <div class="container mt-5">
                <div class="page-heading">
                    <h3>Contact Messages Management</h3>
                </div>
                <div class="page-content">
                    <section class="row">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-striped" id="messagesTable">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Subject</th>
                                                    <th>Status</th>
                                                    <th>Received At</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="viewMessageModal" tabindex="-1" aria-labelledby="viewMessageModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="viewMessageModalLabel">View Message</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p><strong>ID:</strong> <span id="viewId"></span></p>
                    <p><strong>Name:</strong> <span id="viewName"></span></p>
                    <p><strong>Email:</strong> <span id="viewEmail"></span></p>
                    <p><strong>Phone:</strong> <span id="viewPhone"></span></p>
                    <p><strong>Subject:</strong> <span id="viewSubject"></span></p>
                    <p><strong>Message:</strong></p>
                    <pre id="viewMessage" style="white-space: pre-wrap; word-wrap: break-word;"></pre>
                    <p><strong>Status:</strong> <span id="viewStatus" class="badge"></span></p>
                    <p><strong>Received At:</strong> <span id="viewCreatedAt"></span></p>
                    <hr>
                    <div class="form-group">
                        <label for="updateStatusSelect">Update Status:</label>
                        <select id="updateStatusSelect" class="form-select">
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                        </select>
                        <button class="btn btn-primary btn-sm mt-2" id="saveStatusBtn">Save Status</button>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteModalLabel">Confirm Delete</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this message?
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
            const API_BASE_URL = "<?php echo rtrim(getenv('BASE_URL') ?: (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . str_replace('/index.php', '', dirname($_SERVER['SCRIPT_NAME'])), '/'); ?>/contactmessage";

            let table;
            let currentMessageId = null;

            function getStatusBadge(status) {
                let badgeClass = '';
                switch (status) {
                    case 'unread': badgeClass = 'status-unread'; break;
                    case 'read': badgeClass = 'status-read'; break;
                    case 'replied': badgeClass = 'status-replied'; break;
                    default: badgeClass = 'bg-secondary';
                }
                return `<span class="badge ${badgeClass}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
            }

            table = $('#messagesTable').DataTable({
                processing: true,
                serverSide: false,
                ajax: {
                    url: `${API_BASE_URL}/index`,
                    type: 'GET',
                    dataSrc: function(json) {
                        if (json.status === 200 && json.data) {
                            return json.data;
                        } else {
                            console.error("Error fetching data:", json.message);
                            alert('Could not load messages.');
                            return [];
                        }
                    },
                    error: function (xhr, error, thrown) {
                        console.error("AJAX error:", error, thrown);
                        alert('Error connecting to the server.');
                    }
                },
                columns: [
                    { data: 'id' },
                    { data: 'name' },
                    { data: 'email' },
                    { data: 'subject' },
                    {
                        data: 'status',
                        render: function(data, type, row) {
                            return getStatusBadge(data);
                        }
                    },
                    {
                        data: 'created_at',
                        render: function(data) {
                            return data ? new Date(data).toLocaleString() : 'N/A';
                        }
                    },
                    {
                        data: 'id',
                        orderable: false,
                        searchable: false,
                        render: function (data, type, row) {
                            return `
                                <button class="btn btn-sm btn-info view-btn" data-id="${data}">View</button>
                                <button class="btn btn-sm btn-danger delete-btn" data-id="${data}">Delete</button>
                            `;
                        }
                    }
                ],
                order: [[ 5, "desc" ]],
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.10.25/i18n/Vietnamese.json"
                }
            });

            $('#messagesTable tbody').on('click', '.view-btn', function () {
                currentMessageId = $(this).data('id');
                $.ajax({
                    url: `${API_BASE_URL}/show/${currentMessageId}`,
                    method: 'GET',
                    success: function(response) {
                        if (response.status === 200 && response.data) {
                            const msg = response.data;
                            $('#viewId').text(msg.id);
                            $('#viewName').text(msg.name);
                            $('#viewEmail').text(msg.email);
                            $('#viewPhone').text(msg.phone || 'N/A');
                            $('#viewSubject').text(msg.subject);
                            $('#viewMessage').text(msg.message);
                            $('#viewStatus').html(getStatusBadge(msg.status));
                            $('#updateStatusSelect').val(msg.status);
                            $('#viewCreatedAt').text(new Date(msg.created_at).toLocaleString());
                            $('#viewMessageModal').modal('show');
                        } else {
                            alert('Error: ' + (response.message || 'Could not fetch message details.'));
                        }
                    },
                    error: function() {
                        alert('Error fetching message details.');
                    }
                });
            });

            $('#saveStatusBtn').on('click', function() {
                if (!currentMessageId) return;
                const newStatus = $('#updateStatusSelect').val();
                $.ajax({
                    url: `${API_BASE_URL}/updateStatus/${currentMessageId}`,
                    method: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify({ status: newStatus }),
                    success: function(response) {
                        if (response.status === 200) {
                            alert(response.message || 'Status updated successfully!');
                            $('#viewMessageModal').modal('hide');
                            table.ajax.reload();
                        } else {
                            alert('Error: ' + (response.message || 'Could not update status.'));
                        }
                    },
                    error: function(xhr) {
                        let errorMsg = 'Could not update status.';
                        try {
                            const errResponse = JSON.parse(xhr.responseText);
                            errorMsg = errResponse.message || errorMsg;
                        } catch (e) {}
                        alert('Error: ' + errorMsg);
                    }
                });
            });

            $('#messagesTable tbody').on('click', '.delete-btn', function () {
                currentMessageId = $(this).data('id');
                $('#deleteModal').modal('show');
            });

            $('#confirmDeleteBtn').on('click', function() {
                if (!currentMessageId) return;
                $.ajax({
                    url: `${API_BASE_URL}/delete/${currentMessageId}`,
                    method: 'DELETE',
                    success: function(response) {
                        if (response.status === 200) {
                            alert(response.message || 'Message deleted successfully!');
                            $('#deleteModal').modal('hide');
                            table.ajax.reload();
                        } else {
                            alert('Error: ' + (response.message || 'Could not delete message.'));
                        }
                    },
                    error: function(xhr) {
                         let errorMsg = 'Could not delete message.';
                        try {
                            const errResponse = JSON.parse(xhr.responseText);
                            errorMsg = errResponse.message || errorMsg;
                        } catch (e) {}
                        alert('Error: ' + errorMsg);
                    },
                    complete: function() {
                        currentMessageId = null;
                    }
                });
            });
        });
    </script>
</body>
</html>