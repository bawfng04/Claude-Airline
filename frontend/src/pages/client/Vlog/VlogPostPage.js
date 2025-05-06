// frontend/src/pages/client/Vlog/VlogPostPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_URL } from '../../../api/apis';
import { FaSpinner, FaExclamationTriangle, FaUserEdit, FaRegClock, FaRegCommentDots, FaStar, FaUserCircle } from 'react-icons/fa';

// *** IMPORTANT: Replace with your actual auth logic ***
// import { useAuth } from '../../../context/AuthContext';

const VlogPostPage = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for comments
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentsError, setCommentsError] = useState(null);

    // Example auth state (replace)
    // const { isAuthenticated, user, token } = useAuth();
    const isAuthenticated = true; // <-- Replace
    const authToken = "YOUR_AUTH_TOKEN"; // <-- Replace

    // API endpoints
    const GET_POST_BY_SLUG_API = `${API_URL}/vlogPost/show/`; // Adjust if needed
    const COMMENTS_API_BASE = post ? `${API_URL}/vlogComment/listApproved/${post.id}` : null; // Adjust if needed


    // Fetch Post Details
    useEffect(() => {
        let isMounted = true;
        const fetchPost = async () => {
            if (!slug) {
                if (isMounted) { setError("No post specified."); setLoading(false); }
                return;
            }
            setLoading(true); setError(null); setPost(null); setComments([]); setCommentsLoading(true);
            try {
                const response = await fetch(`${GET_POST_BY_SLUG_API}${slug}`);
                if (!response.ok) { /* ... error handling ... */ throw new Error(`Post not found or error: ${response.status}`); }
                const result = await response.json();
                if (result.status === 200 && result.data) {
                    const fetchedPost = { /* ... process data including image path and rating ... */
                        ...result.data,
                        featured_image_url: result.data.featured_image_url ? (result.data.featured_image_url.startsWith('/') ? API_URL + result.data.featured_image_url : result.data.featured_image_url) : null,
                        average_rating: parseFloat(result.data.average_rating || 0),
                        rating_count: parseInt(result.data.rating_count || 0, 10)
                    };
                    if (isMounted) setPost(fetchedPost);
                } else { throw new Error(result.message || 'Failed to load post data'); }
            } catch (err) { if (isMounted) setError(err.message); }
            finally { if (isMounted) setLoading(false); }
        };
        fetchPost();
        return () => { isMounted = false };
    }, [slug]);


    // Fetch Comments
    const fetchComments = React.useCallback(async () => {
        if (!post?.id) return;
        setCommentsLoading(true); setCommentsError(null);
        const commentsApiUrl = `${API_URL}/vlogComment/listApproved/${post.id}`; // Adjust if needed
        try {
            const response = await fetch(commentsApiUrl);
            if (!response.ok) throw new Error(`Failed to fetch comments. Status: ${response.status}`);
            const result = await response.json();
            if (result.status === 200 && Array.isArray(result.data)) { setComments(result.data); }
            else { throw new Error(result.message || 'Invalid comments data received.'); }
        } catch (err) { setCommentsError(err.message); }
        finally { setCommentsLoading(false); }
    }, [post?.id]);

    useEffect(() => { if (post && !loading && !error) { fetchComments(); } }, [post, loading, error, fetchComments]);


    // --- Render Logic ---
    if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><FaSpinner className="animate-spin text-4xl text-blue-500" /></div>;
    if (error) return ( <div className="container mx-auto p-6 my-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center" role="alert"><FaExclamationTriangle className="inline-block mr-2 text-2xl" /> Error: {error} <br/><Link to="/vlog" className="text-blue-500 hover:underline mt-2 inline-block">Back to Vlog</Link></div> );
    if (!post) return <div className="container mx-auto p-6 text-center my-10">Post not found.</div>;

    return (
        <article className="container mx-auto px-4 py-10 max-w-4xl">
            {/* Featured Image */}
            {post.featured_image_url && ( <img src={post.featured_image_url} alt={post.title} className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md mb-8 bg-gray-200" onError={(e) => { e.target.style.display='none'; }}/> )}

            {/* Post Header */}
            <header className="mb-6 border-b pb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{post.title}</h1>
                <div className="text-sm text-gray-500 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="flex items-center"><FaUserEdit className="mr-1"/> By {post.author_name || 'Admin'}</span>
                    <span className="flex items-center"><FaRegClock className="mr-1"/> Published on {new Date(post.created_at).toLocaleDateString()}</span>
                    {post.rating_count > 0 && ( <span className="flex items-center" title={`${post.average_rating} average rating from ${post.rating_count} reviews`}><FaStar className="mr-1 text-yellow-400" />{post.average_rating.toFixed(1)} ({post.rating_count})</span> )}
                </div>
            </header>

            {/* Post Content - Render plain text, preserving whitespace */}
            <div className="mt-8 text-gray-700 leading-relaxed text-lg" style={{ whiteSpace: 'pre-wrap' }}>
                {post.content}
            </div>

            {/* --- Comments Section --- */}
            <div id="comments-section" className="mt-12 pt-8 border-t border-gray-300">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center">
                    <FaRegCommentDots className="mr-3 text-blue-500"/> Comments & Reviews ({comments.length})
                </h2>
                {/* Add Comment Form */}
                <div className="mb-8">
                    {isAuthenticated ? ( <AddVlogCommentForm postId={post.id} authToken={authToken} onCommentAdded={fetchComments} /> )
                    : ( <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded"> Please <Link to="/login" className="font-bold hover:underline">login</Link> or <Link to="/register" className="font-bold hover:underline">register</Link> to leave a comment. </div> )}
                </div>
                {/* Comments Display */}
                {commentsLoading && <div className="text-center text-gray-500 py-4">Loading comments...</div>}
                {commentsError && !commentsLoading && <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4" role="alert"><FaExclamationTriangle className="inline-block mr-2" /> Could not load comments: {commentsError}</div>}
                {!commentsLoading && !commentsError && ( comments.length > 0 ? ( <div className="space-y-6"> {comments.map((comment) => ( <div key={comment.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm"> <div className="flex items-center mb-2"> <FaUserCircle className="text-gray-400 text-2xl mr-2" /> <span className="font-semibold text-gray-700">{comment.user_name || 'User'}</span> <span className="text-xs text-gray-400 ml-auto">{new Date(comment.created_at).toLocaleDateString()}</span> </div> {comment.rating && ( <div className="flex items-center mb-2"> {[...Array(5)].map((_, i) => (<FaStar key={i} className={`text-lg ${i < comment.rating ? 'text-yellow-400' : 'text-gray-300'}`} />))} </div> )} <p className="text-gray-600 whitespace-pre-wrap">{comment.comment}</p> </div> ))} </div> ) : ( !commentsLoading && !commentsError && <div className="text-center text-gray-500 py-4">Be the first to leave a comment!</div> ) )}
            </div>
        </article>
    );
};


// *** ADD COMMENT FORM COMPONENT (Doesn't need changes from previous version) ***
const AddVlogCommentForm = ({ postId, authToken, onCommentAdded }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null); setFormSuccess(null);
        if (!comment.trim()) { setFormError("Comment text cannot be empty."); return; }
        setIsSubmitting(true);
        const ADD_COMMENT_API = `${API_URL}/vlogComment/createComment/${postId}`; // Adjust API URL if needed
        try {
            const response = await fetch(ADD_COMMENT_API, {
                method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
                body: JSON.stringify({ comment, rating: rating === 0 ? null : rating })
            });
            const result = await response.json();
            if (!response.ok || (result.status && result.status !== 201)) { throw new Error(result.message || `Failed to submit comment. Status: ${response.status}`); }
            setFormSuccess("Your comment has been submitted for approval!");
            setRating(0); setComment('');
            if (onCommentAdded) { setTimeout(onCommentAdded, 1000); }
        } catch (err) { setFormError(err.message); }
        finally { setIsSubmitting(false); }
    };

    return ( <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border border-gray-200 space-y-4"> {formError && <div className="text-red-600 bg-red-100 p-3 rounded border border-red-300 text-sm">{formError}</div>} {formSuccess && <div className="text-green-600 bg-green-100 p-3 rounded border border-green-300 text-sm">{formSuccess}</div>} {/* Rating Input */} <div> <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating (Optional):</label> <div className="flex items-center space-x-1"> {[1, 2, 3, 4, 5].map((star) => (<FaStar key={star} className={`cursor-pointer text-3xl transition duration-150 ${star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`} onClick={() => !isSubmitting && setRating(star)} title={`${star} star${star > 1 ? 's' : ''}`} />))} {rating > 0 && <button type="button" onClick={() => setRating(0)} className="text-xs text-gray-500 hover:text-red-600 ml-2" title="Clear rating">(Clear)</button>} </div> </div> {/* Comment Textarea */} <div> <label htmlFor="vlogComment" className="block text-sm font-medium text-gray-700 mb-1">Your Comment:</label> <textarea id="vlogComment" rows="4" className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your thoughts..." required disabled={isSubmitting}></textarea> </div> {/* Submit Button */} <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"> {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : null} {isSubmitting ? 'Submitting...' : 'Submit Comment'} </button> </form> );
}


export default VlogPostPage;