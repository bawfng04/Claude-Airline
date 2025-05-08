// frontend/src/pages/admin/ManageVlogPosts.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../api/apis'; // Your API constants
import { FaEdit, FaTrashAlt, FaPlus, FaSpinner, FaExclamationTriangle, FaStar, FaComments } from 'react-icons/fa'; // Added FaStar, FaComments

// *** IMPORTANT: Replace with your actual admin token retrieval logic ***
const getAdminAuthToken = () => {
    // Example: return localStorage.getItem('adminToken');
    return "YOUR_ADMIN_AUTH_TOKEN";
};

const ManageVlogPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Function to fetch all posts for admin
    const fetchAdminPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        const token = getAdminAuthToken();
        if (!token) {
            setError("Admin token not found. Please login.");
            setLoading(false);
            // Optionally redirect to admin login
            // navigate('/admin/login');
            return;
        }

        try {
            // *** Adjust API URL to match your PHP router structure ***
            const response = await fetch(`${API_URL}/vlogPost/adminList`, { // Example: /controller/method
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to fetch posts' }));
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();

            if (result.status === 200 && Array.isArray(result.data)) {
                setPosts(result.data);
            } else {
                throw new Error(result.message || 'Invalid data received');
            }
        } catch (err) {
            console.error("Error fetching admin posts:", err);
            setError(err.message);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    }, []); // No dependencies needed if getAdminAuthToken is stable

    // Fetch posts on component mount
    useEffect(() => {
        fetchAdminPosts();
    }, [fetchAdminPosts]);

    // Handler for deleting a post
    const handleDelete = async (postId, postTitle) => {
        if (!window.confirm(`Are you sure you want to delete the post "${postTitle}"? This action cannot be undone.`)) {
            return;
        }

        const token = getAdminAuthToken();
        if (!token) {
            alert("Authentication error. Please login again.");
            return;
        }

        try {
            // *** Adjust API URL and method based on your backend (DELETE or POST) ***
            const response = await fetch(`${API_URL}/vlogPost/adminDelete/${postId}`, { // Example using GET/POST structure from router
                method: 'POST', // Or 'DELETE' if your backend/router supports it for this action
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

             const result = await response.json(); // Assume backend sends JSON response

            if (!response.ok || result.status !== 200) {
                throw new Error(result.message || `Failed to delete post. Status: ${response.status}`);
            }

            alert('Post deleted successfully!');
            // Refresh the list after deletion
            fetchAdminPosts();

        } catch (err) {
            console.error("Error deleting post:", err);
            alert(`Error deleting post: ${err.message}`);
        }
    };

    return (
        // Assume this is rendered within your Mazer admin layout
        <>
            <div className="page-heading">
                <div className="page-title">
                    <div className="row">
                        <div className="col-12 col-md-6 order-md-1 order-last">
                            <h3>Manage Vlog Posts</h3>
                            <p className="text-subtitle text-muted">Create, edit, or delete blog posts.</p>
                        </div>
                        <div className="col-12 col-md-6 order-md-2 order-first">
                            <nav aria-label="breadcrumb" className="breadcrumb-header float-start float-lg-end">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Vlog Posts</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
                <section className="section">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <span>All Posts</span>
                            <Link to="/admin/vlog-posts/new" className="btn btn-primary btn-sm">
                                <FaPlus className="me-1" /> Create New Post
                            </Link>
                        </div>
                        <div className="card-body">
                            {loading && <div className="text-center p-5"><FaSpinner className="animate-spin text-2xl text-primary" /></div>}
                            {error && <div className="alert alert-danger d-flex align-items-center"><FaExclamationTriangle className="me-2"/>Error: {error}</div>}
                            {!loading && !error && (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover table-bordered" id="table1">
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Author</th>
                                                <th>Status</th>
                                                <th>Ratings</th> {/* ADDED */}
                                                <th>Comments (Approved)</th> {/* Placeholder, needs separate count if desired */}                                                
                                                <th>Date Created</th>
                                                <th>Last Updated</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {posts.length === 0 ? (
                                                <tr><td colSpan="8" className="text-center text-muted">No posts found.</td></tr>
                                            ) : (
                                                posts.map(post => (
                                                    <tr key={post.id}>
                                                        <td>{post.title}</td>
                                                        <td>{post.author_name || 'N/A'}</td>
                                                        <td>
                                                            {post.status === 'published' ? (
                                                                <span className="badge bg-success">Published</span>
                                                            ) : (
                                                                <span className="badge bg-light-secondary">Draft</span>
                                                            )}
                                                        </td>
                                                        {/* Display Ratings Info */}
                                                        <td>
                                                            {post.average_rating && post.average_rating > 0 ? (
                                                                <><FaStar className="text-warning me-1"/>{parseFloat(post.average_rating).toFixed(1)} ({post.no_of_ratings || 0})</>
                                                            ) : ( <span className="text-muted">N/A</span> )}
                                                        </td>
                                                        {/* Placeholder for approved comment count - would need API to provide this aggregated data */}
                                                        <td className="text-center"><FaComments className="text-info me-1" /> TBD</td>
                                                        <td>{new Date(post.created_at).toLocaleDateString()}</td>
                                                        <td>{new Date(post.updated_at).toLocaleDateString()}</td>
                                                        <td className='text-nowrap'>
                                                            <Link to={`/admin/vlog-posts/edit/${post.id}`} className="btn btn-sm btn-outline-primary me-1 px-2 py-1" title="Edit">
                                                                <FaEdit />
                                                            </Link>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger px-2 py-1"
                                                                title="Delete"
                                                                onClick={() => handleDelete(post.id, post.title)}
                                                            >
                                                                <FaTrashAlt />
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

export default ManageVlogPosts;