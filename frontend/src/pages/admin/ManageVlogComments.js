// frontend/src/pages/admin/ManageVlogComments.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // Use Link for post titles
import { API_URL } from '../../api/apis'; // Your API constants
import { FaCheck, FaTrashAlt, FaSpinner, FaExclamationTriangle, FaStar, FaUser, FaUserSecret } from 'react-icons/fa'; // Added FaUser/FaUserSecret

// *** IMPORTANT: Replace with your actual admin token retrieval logic ***
const getAdminAuthToken = () => {
    // Example: return localStorage.getItem('adminToken');
    return "YOUR_ADMIN_AUTH_TOKEN"; // Placeholder
};

const ManageVlogComments = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // Optional filter state: 'all', 'pending', 'approved'

    // Function to fetch all comments for admin
    const fetchAdminComments = useCallback(async () => {
        setLoading(true);
        setError(null);
        const token = getAdminAuthToken();
        if (!token) { setError("Admin token not found. Please login."); setLoading(false); return; }

        try {
            // *** Adjust API URL to match your PHP router structure ***
            const response = await fetch(`${API_URL}/vlogComment/adminList`, { // Example: /controller/method
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to fetch comments' }));
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            if (result.status === 200 && Array.isArray(result.data)) {
                setComments(result.data);
            } else { throw new Error(result.message || 'Invalid data received'); }
        } catch (err) { setError(err.message); setComments([]); }
        finally { setLoading(false); }
    }, []); // No dependencies if getAdminAuthToken is stable

    // Fetch comments on component mount
    useEffect(() => { fetchAdminComments(); }, [fetchAdminComments]);

    // Filtered comments based on state
    const filteredComments = comments.filter(comment => {
        if (filter === 'pending') return !comment.is_approved;
        if (filter === 'approved') return comment.is_approved;
        return true; // 'all'
    });


    // Handler for approving a comment
    const handleApprove = async (commentId) => {
        const token = getAdminAuthToken();
        if (!token) { alert("Authentication error."); return; }

        // Optional: Add a visual loading state to the specific button
        // setComments(prev => prev.map(c => c.id === commentId ? {...c, isApproving: true} : c));

        try {
            // *** Adjust API URL and method if needed ***
            const response = await fetch(`${API_URL}/vlogComment/adminApprove/${commentId}`, {
                method: 'POST', // Or PUT - Match your backend
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (!response.ok || result.status !== 200) throw new Error(result.message || 'Failed to approve');
            // Refresh list on success
            fetchAdminComments();
        } catch (err) {
            alert(`Error approving comment: ${err.message}`);
            // Reset loading state if added
             // setComments(prev => prev.map(c => c.id === commentId ? {...c, isApproving: false} : c));
        }
    };

    // Handler for deleting a comment
    const handleDelete = async (commentId) => {
        if (!window.confirm('Are you sure you want to permanently delete this comment?')) return;
        const token = getAdminAuthToken();
        if (!token) { alert("Authentication error."); return; }

        // Optional: Add a visual loading state
         // setComments(prev => prev.map(c => c.id === commentId ? {...c, isDeleting: true} : c));

        try {
             // *** Adjust API URL and method if needed ***
            const response = await fetch(`${API_URL}/vlogComment/adminDelete/${commentId}`, {
                method: 'POST', // Or DELETE
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (!response.ok || result.status !== 200) throw new Error(result.message || 'Failed to delete');
            // Refresh list on success
            fetchAdminComments();
        } catch (err) {
            alert(`Error deleting comment: ${err.message}`);
             // Reset loading state if added
             // setComments(prev => prev.map(c => c.id === commentId ? {...c, isDeleting: false} : c));
        }
    };

    // Function to truncate comment text for display in table
    const truncateText = (text, length = 50) => {
        if (!text) return '';
        return text.length > length ? text.substring(0, length) + '...' : text;
    }

    return (
        // Assume this is rendered within your Mazer admin layout
        <>
            <div className="page-heading">
                <div className="page-title">
                    <div className="row">
                        <div className="col-12 col-md-6 order-md-1 order-last">
                            <h3>Manage Vlog Comments</h3>
                            <p className="text-subtitle text-muted">Approve or delete user and guest comments.</p>
                        </div>
                        <div className="col-12 col-md-6 order-md-2 order-first">
                            <nav aria-label="breadcrumb" className="breadcrumb-header float-start float-lg-end">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Vlog Comments</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
                <section className="section">
                    <div className="card"> {/* Mazer Card */}
                        <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                            <span>Comment List</span>
                            {/* Optional Filter Buttons */}
                            <div className="btn-group mt-2 mt-md-0" role="group">
                                <button type="button" className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('all')}>All ({comments.length})</button>
                                <button type="button" className={`btn btn-sm ${filter === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('pending')}>Pending ({comments.filter(c => !c.is_approved).length})</button>
                                <button type="button" className={`btn btn-sm ${filter === 'approved' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('approved')}>Approved ({comments.filter(c => c.is_approved).length})</button>
                            </div>
                        </div>
                        <div className="card-body">
                            {loading && <div className="text-center p-5"><FaSpinner className="animate-spin text-2xl text-primary" /></div>}
                            {error && <div className="alert alert-danger d-flex align-items-center"><FaExclamationTriangle className="me-2"/>Error: {error}</div>}
                            {!loading && !error && (
                                <div className="table-responsive">
                                    {/* Mazer Table Styling */}
                                    <table className="table table-striped table-hover table-bordered" id="commentsTable">
                                        <thead>
                                            <tr>
                                                <th style={{width: '25%'}}>Comment</th>
                                                <th>Author</th>
                                                <th>Post</th>
                                                <th>Rating</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredComments.length === 0 ? (
                                                <tr><td colSpan="7" className="text-center text-muted">No comments found matching the filter.</td></tr>
                                            ) : (
                                                filteredComments.map(comment => (
                                                    <tr key={comment.id}>
                                                        {/* Truncated comment with full comment in title */}
                                                        <td title={comment.comment}>{truncateText(comment.comment, 60)}</td>
                                                        {/* Author Info */}
                                                        <td>
                                                            {comment.user_id ?
                                                                <><FaUser className="me-1 text-muted"/>{comment.user_name || `User ${comment.user_id}`}</> :
                                                                <><FaUserSecret className="me-1 text-info"/>{comment.guest_name || 'Guest'}</>
                                                            }
                                                            {/* Optional: Show guest email in title or small text */}
                                                            {/* {!comment.user_id && comment.guest_email && <small className='d-block text-muted' title={comment.guest_email}>{comment.guest_email}</small>} */}
                                                        </td>
                                                        {/* Link to view the post on the frontend */}
                                                        <td><Link to={`/vlog/${comment.post_slug}`} target="_blank" title={comment.post_title}>{truncateText(comment.post_title, 25)}</Link></td>
                                                        {/* Rating */}
                                                        <td className='text-center'>{comment.rating ? <><FaStar className="text-warning me-1"/>{comment.rating}</> : '-'}</td>
                                                        {/* Status Badge */}
                                                        <td className='text-center'>
                                                        {comment.is_approved ? <span className="badge bg-success">Approved</span> : <span className="badge bg-warning">Pending</span>}
                                                        </td>
                                                        {/* Date */}
                                                        <td>{new Date(comment.created_at).toLocaleDateString()}</td>
                                                        {/* Action Buttons */}
                                                        <td className='text-nowrap'>
                                                             {/* Approve Button (only if not approved) */}
                                                            {!comment.is_approved && (
                                                                <button className="btn btn-sm btn-success me-1 px-2 py-1" title="Approve" onClick={() => handleApprove(comment.id)}>
                                                                    <FaCheck /> <span className="d-none d-md-inline">Approve</span>
                                                                </button>
                                                            )}
                                                             {/* Delete Button */}
                                                            <button className="btn btn-sm btn-danger px-2 py-1" title="Delete" onClick={() => handleDelete(comment.id)}>
                                                                <FaTrashAlt /> <span className="d-none d-md-inline">Delete</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default ManageVlogComments;