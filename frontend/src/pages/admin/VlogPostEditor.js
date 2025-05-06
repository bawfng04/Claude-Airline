// frontend/src/pages/admin/VlogPostEditor.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// Removed React Quill imports
import { API_URL } from '../../api/apis';
import { FaSpinner, FaExclamationTriangle, FaSave, FaTrashAlt, FaImage } from 'react-icons/fa';

// *** IMPORTANT: Replace with your actual admin token retrieval logic ***
const getAdminAuthToken = () => {
    return "YOUR_ADMIN_AUTH_TOKEN";
};

// *** Removed Quill Modules/Formats configuration ***

const VlogPostEditor = ({ mode }) => { // mode 'create' or 'edit' passed from route
    const { postId } = useParams();
    const navigate = useNavigate();

    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); // Will store plain text now
    const [status, setStatus] = useState('draft');
    const [currentImageUrl, setCurrentImageUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [removeCurrentImage, setRemoveCurrentImage] = useState(false);

    // Component State
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(null);

    // Fetch existing post data in edit mode (remains largely the same)
    const fetchPostData = useCallback(async () => {
        if (mode !== 'edit' || !postId) return;
        setIsLoading(true);
        setError(null);
        const token = getAdminAuthToken();
        try {
            const response = await fetch(`${API_URL}/vlogPost/adminGet/${postId}`, { // Adjust API URL if needed
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error(`Failed to fetch post data. Status: ${response.status}`);
            const result = await response.json();
            if (result.status === 200 && result.data) {
                setTitle(result.data.title || '');
                setContent(result.data.content || ''); // Sets plain text content
                setStatus(result.data.status || 'draft');
                const imageUrl = result.data.featured_image_url;
                setCurrentImageUrl(imageUrl ? (imageUrl.startsWith('/') ? API_URL + imageUrl : imageUrl) : null);
                setImageFile(null); setImagePreview(null); setRemoveCurrentImage(false);
            } else { throw new Error(result.message || 'Post not found or invalid data'); }
        } catch (err) {
            console.error("Error fetching post:", err);
            setError(`Error loading post: ${err.message}`);
        } finally { setIsLoading(false); }
    }, [mode, postId]);

    useEffect(() => { fetchPostData(); }, [fetchPostData]);

    // Handle image file selection (remains the same)
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => { setImagePreview(reader.result); };
            reader.readAsDataURL(file);
            setRemoveCurrentImage(false);
        } else { setImageFile(null); setImagePreview(null); }
    };

     // Handle remove current image click (remains the same)
    const handleRemoveImageClick = () => {
        setRemoveCurrentImage(true); setCurrentImageUrl(null);
        setImageFile(null); setImagePreview(null);
    };

    // Handle form submission (remains largely the same, 'content' is now plain text)
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true); setError(null); setSubmitSuccess(null);
        const token = getAdminAuthToken();

        if (!title || !content.trim() || !status) { // Use trim() for content check
            setError("Title, Content (non-empty), and Status are required.");
            setIsSubmitting(false); return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content); // Appending plain text
        formData.append('status', status);
        if (imageFile) formData.append('featured_image', imageFile);
        if (mode === 'edit' && removeCurrentImage) formData.append('remove_featured_image', '1');

        let url = ''; let method = 'POST';
        if (mode === 'create') url = `${API_URL}/vlogPost/adminCreate`; // Adjust API URL if needed
        else if (mode === 'edit' && postId) url = `${API_URL}/vlogPost/adminUpdate/${postId}`; // Adjust API URL if needed
        else { setError("Invalid mode or missing Post ID."); setIsSubmitting(false); return; }

        try {
            const response = await fetch(url, { method: method, headers: { 'Authorization': `Bearer ${token}` }, body: formData });
            const result = await response.json();
            if (!response.ok || (result.status !== 200 && result.status !== 201)) { throw new Error(result.message || `Failed to ${mode} post. Status: ${response.status}`); }
            setSubmitSuccess(`Post ${mode === 'create' ? 'created' : 'updated'} successfully!`);
            setTimeout(() => { navigate('/admin/manage-vlog-posts'); }, 1500);
        } catch (err) {
            console.error(`Error ${mode} post:`, err);
            setError(`Error: ${err.message}`);
        } finally { setIsSubmitting(false); }
    };

    // --- Render ---
    if (mode === 'edit' && isLoading) return <div className="text-center p-5"><FaSpinner className="animate-spin text-2xl text-primary" /> Loading post data...</div>;
    if (mode === 'edit' && error && !isSubmitting) return <div className="alert alert-danger d-flex align-items-center"><FaExclamationTriangle className="me-2"/>{error} <Link to="/admin/manage-vlog-posts" className="ms-3">Back to list</Link></div>;

    return (
    <>
        <div className="page-heading"><h3>{mode === 'create' ? 'Create New Vlog Post' : 'Edit Vlog Post'}</h3></div>
        <div className="page-content">
            <section className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header"><h4 className="card-title">{mode === 'create' ? 'New Post Details' : `Editing Post ID: ${postId}`}</h4></div>
                        <div className="card-content"><div className="card-body">
                            {error && !isLoading && <div className="alert alert-light-danger color-danger d-flex align-items-center mb-3"><FaExclamationTriangle className="me-2"/>{error}</div>}
                            {submitSuccess && <div className="alert alert-light-success color-success mb-3">{submitSuccess}</div>}
                            <form className="form form-vertical" onSubmit={handleSubmit}> <div className="form-body"><div className="row">
                                {/* Title */}
                                <div className="col-12"><div className="form-group">
                                    <label htmlFor="post-title">Title</label>
                                    <input type="text" id="post-title" className="form-control" name="title" placeholder="Post Title" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isSubmitting}/>
                                </div></div>

                                {/* Content - Use Textarea */}
                                <div className="col-12"><div className="form-group">
                                    <label htmlFor="post-content">Content</label>
                                    <textarea
                                        id="post-content"
                                        className="form-control"
                                        name="content"
                                        rows="15" // Adjust rows as needed
                                        placeholder="Enter vlog content here (plain text)..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)} // Update state on change
                                        required
                                        disabled={isSubmitting}
                                    ></textarea>
                                    <small className="text-muted">Enter plain text. Line breaks will be preserved.</small>
                                </div></div>

                                {/* Status */}
                                <div className="col-12 col-md-6"><div className="form-group">
                                    <label htmlFor="post-status">Status</label>
                                    <select id="post-status" className="form-select" value={status} onChange={(e) => setStatus(e.target.value)} disabled={isSubmitting}>
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                    </select>
                                </div></div>

                                {/* Featured Image Upload */}
                                <div className="col-12 col-md-6"><div className="form-group">
                                    <label htmlFor="post-image">Featured Image</label>
                                    <input type="file" id="post-image" className="form-control" name="featured_image" accept="image/*" onChange={handleFileChange} disabled={isSubmitting}/>
                                    <small className="text-muted">Max 5MB. Allowed: jpg, png, gif, webp.</small>
                                </div>
                                {/* Image Preview Section */}
                                <div className="mt-2">
                                    {imagePreview && (<div>
                                        <p className="text-sm mb-1">New Image Preview:</p>
                                        <img src={imagePreview} alt="New preview" className="img-thumbnail" style={{ maxHeight: '150px', maxWidth: '100%' }} />
                                    </div>)}
                                    {!imagePreview && currentImageUrl && (<div>
                                        <p className="text-sm mb-1">Current Image:</p>
                                        <img src={currentImageUrl} alt="Current" className="img-thumbnail" style={{ maxHeight: '150px', maxWidth: '100%' }}/>
                                        {!removeCurrentImage && (<button type="button" onClick={handleRemoveImageClick} className="btn btn-sm btn-outline-danger mt-2" disabled={isSubmitting}>
                                            <FaTrashAlt className="me-1"/> Remove Image</button>)}
                                    </div>)}
                                    {removeCurrentImage && mode === 'edit' && (<p className="text-danger text-sm mt-2">Current image will be removed upon saving.</p>)}
                                </div></div>

                                {/* Submit Button */}
                                <div className="col-12 d-flex justify-content-end mt-4">
                                    <button type="submit" className="btn btn-primary me-1 mb-1" disabled={isSubmitting}>
                                        {isSubmitting ? <FaSpinner className="animate-spin me-1"/> : <FaSave className="me-1"/>}
                                        {isSubmitting ? 'Saving...' : (mode === 'create' ? 'Create Post' : 'Update Post')}
                                    </button>
                                    <Link to="/admin/manage-vlog-posts" className="btn btn-light-secondary me-1 mb-1">Cancel</Link>
                                </div>
                            </div></div></form>
                        </div></div></div>
                </div>
            </section>
        </div>
    </>
    );
};

export default VlogPostEditor;