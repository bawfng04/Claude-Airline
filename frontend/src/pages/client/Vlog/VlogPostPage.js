import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_URL } from '../../../api/apis';
import { Helmet } from 'react-helmet';
import {
    FaSpinner, FaExclamationTriangle, FaUserEdit, FaRegClock, FaRegCommentDots,
    FaStar, FaUserCircle, FaThumbsUp, FaRegThumbsUp, FaShareAlt, FaPaperPlane,
    FaUserAstronaut, FaFacebook, FaTwitter, FaLinkedin, FaPinterest,
    FaWhatsapp, FaEnvelope, FaRedditAlien, FaEdit, FaSave, FaTimes
} from 'react-icons/fa';

const useAuth = () => {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        user: null,
        token: localStorage.getItem("accessToken"),
        isLoading: true,
    });

    useEffect(() => {
        const validateTokenAndFetchUser = async () => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                try {
                    const response = await fetch(`${API_URL}/users/getUserInfo`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (response.ok) {
                        const result = await response.json();
                        if (result.status === 200 && result.data && result.data.id) {
                            setAuthState({
                                isAuthenticated: true,
                                user: {
                                    id: result.data.id,
                                    GIVEN_NAME: result.data.given_name,
                                    FAMILY_NAME: result.data.family_name,
                                    avatarUrl: result.data.image ? (result.data.image.startsWith('/') ? API_URL + result.data.image : result.data.image) : null
                                },
                                token: token,
                                isLoading: false,
                            });
                        } else {
                            localStorage.removeItem("accessToken");
                            setAuthState({ isAuthenticated: false, user: null, token: null, isLoading: false });
                        }
                    } else {
                        localStorage.removeItem("accessToken");
                        setAuthState({ isAuthenticated: false, user: null, token: null, isLoading: false });
                    }
                } catch (error) {
                    console.error("Error validating token:", error);
                    localStorage.removeItem("accessToken");
                    setAuthState({ isAuthenticated: false, user: null, token: null, isLoading: false });
                }
            } else {
                setAuthState({ isAuthenticated: false, user: null, token: null, isLoading: false });
            }
        };
        validateTokenAndFetchUser();
    }, []);
    return authState;
};

const OfferSection = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Form submitted!");
    };
    const offerImageUrl = "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?q=80&w=2106&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    return (
        <section aria-label="Newsletter Signup" className="offer-section-wrapper py-6 md:py-10 bg-slate-50">
            <div className="offer-container max-w-4xl mx-auto px-4 py-6 sm:py-8 md:py-10">
                <div className="offer-content">
                    <h2 className="offer-title text-xl sm:text-2xl lg:text-3xl">Did you miss anything?</h2>
                    <p className="offer-subtitle text-sm sm:text-base">
                        Subscribe to be the first person to receive our exclusive offers
                    </p>
                    <form className="offer-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <input type="email" className="offer-input text-sm sm:text-base p-2 sm:p-3" placeholder="Email address" required />
                            <input type="text" className="offer-input text-sm sm:text-base p-2 sm:p-3" placeholder="Preferred city of departure" />
                        </div>
                        <div className="offer-checkbox">
                            <input type="checkbox" id="subscribeCheckboxVlogPage" />
                            <label htmlFor="subscribeCheckboxVlogPage" className="text-xs sm:text-sm">
                                I have read, understood the privacy policy and would like to get offers and news
                            </label>
                        </div>
                        <button type="submit" className="offer-button text-sm sm:text-base py-2 px-4 sm:py-2.5 sm:px-5">
                            Subscribe
                        </button>
                    </form>
                </div>
                <div className="offer-image-section">
                    <img loading="lazy" src={offerImageUrl} alt="Subscribe to offers" className="offer-image" />
                </div>
            </div>
        </section>
    );
};

const AddVlogCommentForm = ({ postId, onCommentAdded, isSubmittingForm, setIsSubmittingForm }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [guestFullName, setGuestFullName] = useState('');
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const { isAuthenticated, user: loggedInUser, token: authToken, isLoading: authLoading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null); setFormSuccess(null);
        const trimmedComment = comment.trim();
        
        if (!trimmedComment) { setFormError("Comment text cannot be empty."); return; }
        
        let payload = { comment: trimmedComment, rating: rating > 0 ? rating : null };

        if (!isAuthenticated) {
            const trimmedGuestName = guestFullName.trim();
            if (!trimmedGuestName) {
                setFormError("Please enter your full name to comment as a guest.");
                return;
            }
            payload.guest_name = trimmedGuestName;
        }
        
        setIsSubmittingForm(true);
        const ADD_COMMENT_API = `${API_URL}/vlogComment/createComment/${postId}`;
        
        try {
            const headers = { 'Content-Type': 'application/json' };
            if (isAuthenticated && authToken) { headers['Authorization'] = `Bearer ${authToken}`; }

            const response = await fetch(ADD_COMMENT_API, { method: 'POST', headers: headers, body: JSON.stringify(payload) });
            const result = await response.json();

            if (!response.ok || (result.status && result.status !== 201 && result.status !== 200)) { 
                throw new Error(result.message || `Failed to submit comment. Status: ${response.status}`);
            }
            
            const successMessage = isAuthenticated ? "Your comment has been posted!" : "Your comment submitted and awaiting approval!";
            setFormSuccess(successMessage);
            setRating(0); setComment(''); 
            if (!isAuthenticated) setGuestFullName('');

            if (onCommentAdded) { 
                setTimeout(() => { 
                    setFormSuccess(null); 
                    onCommentAdded(true); 
                }, 1500); 
            }
        } catch (err) { 
            setFormError(err.message || "An unexpected error occurred."); 
        }
        finally { setIsSubmittingForm(false); }
    };

    if (authLoading) return <div className="flex justify-center items-center p-6"><FaSpinner className="animate-spin text-2xl text-red-600" /></div>;

    const avatarIcon = isAuthenticated && loggedInUser?.avatarUrl
        ? <img loading="lazy" src={loggedInUser.avatarUrl} alt={loggedInUser.GIVEN_NAME || 'User'} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
        : isAuthenticated
            ? <FaUserCircle className="text-gray-400 text-4xl flex-shrink-0" title={loggedInUser?.GIVEN_NAME || "User"} />
            : <FaUserAstronaut className="text-gray-400 text-4xl flex-shrink-0" title="Guest Avatar" />;

    return (
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 flex gap-3 sm:gap-4 items-start transition-all duration-300 ease-in-out">
            <div className="mt-1">{avatarIcon}</div>
            <form onSubmit={handleSubmit} className="flex-grow space-y-4">
                {formError && <div className="text-red-600 bg-red-100 p-3 rounded-md border border-red-300 text-sm font-medium animate-pulse once">{formError}</div>}
                {formSuccess && <div className="text-green-700 bg-green-100 p-3 rounded-md border border-green-400 text-sm font-medium animate-pulse once">{formSuccess}</div>}
                {!isAuthenticated && (
                    <input type="text" className="w-full p-3 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow duration-150"
                        placeholder="Your full name" value={guestFullName} onChange={(e) => setGuestFullName(e.target.value)} disabled={isSubmittingForm} required maxLength={100} />
                )}
                <textarea id="vlogComment" rows="4"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow duration-150 text-sm placeholder-gray-500 disabled:bg-gray-100"
                    value={comment} onChange={(e) => setComment(e.target.value)}
                    placeholder={isAuthenticated && loggedInUser ? `Share your thoughts, ${loggedInUser.GIVEN_NAME}...` : "Write a public comment..."}
                    required disabled={isSubmittingForm} maxLength={2000} />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
                    <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-700 mr-2">How do you like this post?</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar key={star}
                                className={`cursor-pointer text-2xl sm:text-3xl transition-all duration-150 ease-in-out transform hover:scale-110 ${(hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
                                onClick={() => !isSubmittingForm && setRating(star)}
                                onMouseEnter={() => !isSubmittingForm && setHoverRating(star)}
                                onMouseLeave={() => !isSubmittingForm && setHoverRating(0)}
                                title={`${star} star${star > 1 ? 's' : ''}`} />
                        ))}
                    </div>
                    <button type="submit"
                        disabled={isSubmittingForm || !comment.trim() || (!isAuthenticated && !guestFullName.trim())}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-5 sm:px-6 rounded-md transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 w-full sm:w-auto">
                        {isSubmittingForm ? <FaSpinner className="animate-spin mr-2 text-base" /> : <FaPaperPlane className="mr-2 text-base" />}
                        {isSubmittingForm ? 'Posting...' : 'Post comment'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const GalleryComponent = ({ images, title }) => (
    <section aria-label="Post Gallery" className="py-8 md:py-12 px-2 sm:px-4 opacity-0 transition-opacity duration-700 ease-in-out data-[loaded=true]:opacity-100" data-loaded={images && images.length > 0}>
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                {images.map((imageUrl, index) => (
                    <div key={index} className="w-full aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group">
                        <img loading="lazy" src={imageUrl.startsWith('/') ? API_URL + imageUrl : imageUrl} alt={`Gallery image ${index + 1} for ${title}`}
                            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x300/e2e8f0/94a3b8?text=Error'; e.target.alt = 'Error loading image'; }} />
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const VlogPostPage = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentsError, setCommentsError] = useState(null);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [likingCommentId, setLikingCommentId] = useState(null);
    const [scrollY, setScrollY] = useState(0);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState("");

    const heroImageRef = useRef(null);
    const { isAuthenticated, user: loggedInUser, token: authToken, isLoading: authLoading } = useAuth();

    const handleScroll = useCallback(() => { setScrollY(window.scrollY); }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const fetchPostDetails = useCallback(async () => {
        if (!slug) { setError("No post slug provided."); setLoading(false); return; }
        setLoading(true); setError(null); setPageLoaded(false);
        try {
            const response = await fetch(`${API_URL}/vlogPost/show/${slug}`);
            if (!response.ok) {
                if (response.status === 404) throw new Error('Vlog post not found.');
                throw new Error(`Failed to fetch post. Status: ${response.status}`);
            }
            const result = await response.json();
            if (result.status === 200 && result.data) {
                setPost({
                    ...result.data,
                    featured_image: result.data.featured_image ? (result.data.featured_image.startsWith('/') ? API_URL + result.data.featured_image : result.data.featured_image) : 'https://placehold.co/1200x600/e2e8f0/94a3b8?text=Image+Not+Available',
                    average_rating: parseFloat(result.data.average_rating || 0),
                    no_of_ratings: parseInt(result.data.no_of_ratings || 0, 10),
                    introduction: result.data.introduction || result.data.title,
                    keywords: result.data.keywords || `${result.data.title}, travel, vlog, ${result.data.author_name || 'adventure'}`,
                    main_content: result.data.main_content || '',
                    gallery_images: Array.isArray(result.data.gallery_images) ? result.data.gallery_images : [],
                });
            } else { throw new Error(result.message || 'Post data is invalid.'); }
        } catch (err) { setError(err.message); }
        finally { setLoading(false); setTimeout(() => setPageLoaded(true), 100); }
    }, [slug]);

    const fetchComments = useCallback(async (forceImmediateDisplay = false) => {
        if (!post?.id) return;
        setCommentsLoading(true); setCommentsError(null);
        try {
            const response = await fetch(`${API_URL}/vlogComment/listApproved/${post.id}`);
            if (!response.ok) throw new Error(`Failed to fetch comments. Status: ${response.status}`);
            const result = await response.json();
            if (result.status === 200 && Array.isArray(result.data)) {
                setComments(result.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .map(c => ({ ...c, userLiked: false, likes: parseInt(c.likes || 0, 10), isEditing: false }))
                );
            } else { throw new Error(result.message || 'Invalid comments data received.'); }
        } catch (err) { setCommentsError(err.message); }
        finally { setCommentsLoading(false); }
    }, [post?.id]);

    useEffect(() => { fetchPostDetails(); }, [fetchPostDetails]);
    useEffect(() => { if (post && !loading && !error) { fetchComments(); } }, [post, loading, error, fetchComments]);

    const handleLikeComment = async (commentId) => {
        if (likingCommentId === commentId || isSubmittingComment) return;
        const commentIndex = comments.findIndex(c => c.id === commentId);
        if (commentIndex === -1) { console.error(`Comment with ID ${commentId} not found.`); return; }
        setLikingCommentId(commentId);
        const originalComments = JSON.parse(JSON.stringify(comments));
        const updatedComments = comments.map((comment, index) => {
            if (index === commentIndex) {
                const alreadyLiked = comment.userLiked;
                const currentLikes = comment.likes || 0;
                const newLikesCount = alreadyLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;
                return { ...comment, userLiked: !alreadyLiked, likes: newLikesCount };
            }
            return comment;
        });
        setComments(updatedComments);
        try {
            const response = await fetch(`${API_URL}/vlogComment/like/${commentId}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json', ...(isAuthenticated && authToken && { 'Authorization': `Bearer ${authToken}` }) }
            });
            const result = await response.json();
            if (result.status !== 200) { throw new Error(result.message || "Failed to update like on server."); }
        } catch (err) { console.error("[Like Error] Reverting UI:", err); setComments(originalComments); alert(`Error processing like: ${err.message || 'Please try again.'}`); }
        finally { setLikingCommentId(null); }
    };

    const handleEditComment = (comment) => {
        setEditingCommentId(comment.id);
        setEditingCommentText(comment.comment);
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditingCommentText("");
    };

    const handleSaveEdit = async (commentId) => {
        if (!editingCommentText.trim()) {
            alert("Comment cannot be empty.");
            return;
        }
        setIsSubmittingComment(true);
        try {
            const response = await fetch(`${API_URL}/vlogComment/updateComment/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ comment: editingCommentText })
            });
            const result = await response.json();
            if (!response.ok || result.status !== 200) {
                throw new Error(result.message || "Failed to update comment.");
            }
            setEditingCommentId(null);
            setEditingCommentText("");
            fetchComments(true); 
        } catch (err) {
            console.error("Error updating comment:", err);
            alert(`Error: ${err.message}`);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    if (authLoading || loading) return <div className="flex justify-center items-center min-h-screen bg-white"><FaSpinner className="animate-spin text-5xl sm:text-6xl text-red-600" /></div>;
    if (error) return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 my-12 bg-red-50 border-l-4 border-red-500 text-red-700" role="alert">
            <div className="flex">
                <div className="py-1"><FaExclamationTriangle className="h-6 w-6 text-red-500 mr-3" /></div>
                <div>
                    <p className="font-bold">Error Loading Post</p>
                    <p className="text-sm">{error}</p>
                    <Link to="/vlog" className="text-blue-600 hover:text-blue-800 hover:underline mt-4 inline-block font-semibold text-sm">← Back to Vlogs</Link>
                </div>
            </div>
        </div>
    );
    if (!post) return <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 my-12 text-xl sm:text-2xl text-gray-500">Vlog post not found.</div>;

    const shareUrl = window.location.href;
    const shareTitle = post.title;
    const pageDescription = post.introduction ? post.introduction.substring(0, 160) : (post.main_content ? post.main_content.substring(0,160) : 'Explore this amazing travel story from Claude Airlines Vlog.');
    const ogDescription = post.introduction ? post.introduction.substring(0, 200) : (post.main_content ? post.main_content.substring(0,200) : 'Discover captivating travel experiences and insights.');
    const shareImage = post.featured_image && post.featured_image !== 'https://placehold.co/1200x600/e2e8f0/94a3b8?text=Image+Not+Available' ? post.featured_image : '';

    const formatCommentDate = (dateString) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
        } catch (e) { console.error("Error formatting date:", dateString, e); return "Invalid date"; }
    };

    const isHeroImagePresent = post.featured_image && post.featured_image !== 'https://placehold.co/1200x600/e2e8f0/94a3b8?text=Image+Not+Available';
    const hasGalleryImages = post.gallery_images && post.gallery_images.length > 0;
    const parallaxFactor = 0.9;
    const parallaxOffset = scrollY * parallaxFactor;

    return (
        <>
            <Helmet>
                <title>{`${post.title} | Claude Airlines Vlog`}</title>
                <meta name="description" content={pageDescription} />
                <meta name="keywords" content={post.keywords || `travel, vlog, ${post.slug}, Claude Airlines, ${post.author_name || 'adventure'}`} />
                <link rel="canonical" href={shareUrl} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={shareUrl} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={ogDescription} />
                {shareImage && <meta property="og:image" content={shareImage} />}
                <meta property="twitter:card" content={shareImage ? "summary_large_image" : "summary"} />
                <meta property="twitter:url" content={shareUrl} />
                <meta property="twitter:title" content={post.title} />
                <meta property="twitter:description" content={ogDescription} />
                {shareImage && <meta property="twitter:image" content={shareImage} />}
            </Helmet>

            <div className="bg-white min-h-screen transition-opacity duration-700 ease-in-out opacity-0 data-[loaded=true]:opacity-100" data-loaded={pageLoaded} style={{ paddingTop: 'var(--header-height, 70px)' }}>
                {isHeroImagePresent && (
                    <div className="relative w-full h-[calc(100vh-var(--header-height,70px)-0px)] max-h-[800px] sm:h-[calc(100vh-var(--header-height,70px)-0px)] text-white group selection:bg-red-500 selection:text-white overflow-hidden">
                        <div ref={heroImageRef} className="absolute inset-0 w-full h-full" style={{ transform: `translateY(${parallaxOffset}px)` }} >
                            <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center">
                            <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                                <h1 className="text-7xl sm:text-7xl md:text-7xl lg:text-8xl font-extrabold leading-tight [text-shadow:_2px_2px_4px_rgb(0_0_0_/_50%)] transition-all duration-300 opacity-0 translate-y-5 data-[loaded=true]:opacity-100 data-[loaded=true]:translate-y-0" data-loaded={pageLoaded}>
                                    {post.title}
                                </h1>
                                <hr className="my-5 sm:my-6 md:my-8 border-2 border-gray-400/60 max-w-xs sm:max-w-sm md:max-w-md mx-auto transition-all duration-300 delay-100 opacity-0 data-[loaded=true]:opacity-100" data-loaded={pageLoaded}/>
                                {post.introduction && (
                                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-100 italic leading-relaxed max-w-3xl mx-auto [text-shadow:_1px_1px_3px_rgb(0_0_0_/_40%)] transition-all duration-300 delay-200 opacity-0 translate-y-5 data-[loaded=true]:opacity-100 data-[loaded=true]:translate-y-0" data-loaded={pageLoaded}>
                                        {post.introduction}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="w-full">
                    <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-0 transition-opacity duration-500 delay-300 ease-in-out opacity-0 data-[loaded=true]:opacity-100" data-loaded={pageLoaded}>
                        {!isHeroImagePresent && (
                            <header className="pt-8 pb-4 md:pt-10 md:pb-6 text-gray-800">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 leading-tight">{post.title}</h1>
                                <div className="text-sm sm:text-base text-gray-600 flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 mb-4">
                                    <span className="flex items-center"><FaUserEdit className="mr-1.5 text-gray-500" /> By <strong className="ml-1 text-gray-700 font-semibold">{post.author_name || 'Admin'}</strong></span>
                                    <span className="flex items-center"><FaRegClock className="mr-1.5 text-gray-500" /> {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    {post.no_of_ratings > 0 && (
                                        <span className="flex items-center"><FaStar className="mr-1 text-yellow-500" /> <strong className="ml-0.5 text-gray-700 font-semibold">{post.average_rating.toFixed(1)}</strong> <span className="ml-1">({post.no_of_ratings} rating{post.no_of_ratings > 1 ? 's' : ''})</span></span>
                                    )}
                                </div>
                                {post.introduction && (
                                    <p className="mt-3 text-base sm:text-lg text-gray-700 italic border-l-4 border-red-300 pl-3 pr-1 py-1 bg-red-50/50 rounded-r-md">
                                        {post.introduction}
                                    </p>
                                )}
                            </header>
                        )}
                        {isHeroImagePresent && (
                            <section aria-label="Post metadata" className="text-sm text-gray-600 flex flex-wrap items-center justify-center text-center gap-x-3 sm:gap-x-4 gap-y-1 py-4 md:py-6 border-b border-gray-200">
                                <span className="flex items-center"><FaUserEdit className="mr-1.5 text-gray-500" /> By <strong className="ml-1 text-gray-700 font-semibold">{post.author_name || 'Admin'}</strong></span>
                                <span className="flex items-center"><FaRegClock className="mr-1.5 text-gray-500" /> {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                {post.no_of_ratings > 0 && (
                                    <span className="flex items-center"><FaStar className="mr-1 text-yellow-500" /> <strong className="ml-0.5 text-gray-700 font-semibold">{post.average_rating.toFixed(1)}</strong> <span className="ml-1">({post.no_of_ratings} rating{post.no_of_ratings > 1 ? 's' : ''})</span></span>
                                )}
                            </section>
                        )}

                        <main className="py-4 md:py-5">
                            {(post.main_content && post.main_content.trim() !== '') ? (
                                <div className="text-gray-800 selection:bg-red-100 selection:text-red-700">
                                    <div style={{ whiteSpace: 'pre-wrap' }} className="text-gray-700 text-base sm:text-lg leading-relaxed">
                                        {post.main_content}
                                    </div>
                                </div>
                            ) : ( <div className="text-center text-gray-500 py-5"></div> )}
                        </main>
                    </div>

                    {hasGalleryImages && (<GalleryComponent images={post.gallery_images} title={post.title} />)}

                    <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-0 transition-opacity duration-500 delay-500 ease-in-out opacity-0 data-[loaded=true]:opacity-100" data-loaded={pageLoaded}>
                        <section aria-label="Author's Reflection" className="py-6 my-6 border-t border-b border-gray-200">
                            <p className="text-gray-700 italic text-base sm:text-lg leading-relaxed text-center">
                                Every story shared and every image captured here on the Claude Airlines Vlog represents not only memorable moments from distant journeys but also the unique perspectives and heartfelt dedication of our authors. These are fellow travelers, passionate about exploration, eager to convey the world's beauty and intricacies. We firmly believe that through each adventure and every shared experience, we not only discover the globe but also delve deeper into ourselves, enriching our lives profoundly and aiming to ignite a similar spark of curiosity and endless inspiration within our cherished travel-loving community.
                            </p>
                        </section>
                    </div>
                    
                    <OfferSection />

                    <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-0">
                        <section aria-label="Share this post" className="py-5 my-5 border-t border-b border-gray-200">
                            <div className="flex items-center gap-x-4 text-sm">
                                <span className="font-semibold text-gray-700 flex items-center"><FaShareAlt className="mr-2" />Share</span>
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors" title="Share on Facebook"><FaFacebook size={24} /></a>
                                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-sky-500 transition-colors" title="Share on Twitter"><FaTwitter size={24} /></a>
                                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}&summary=${encodeURIComponent(ogDescription)}&source=Claude%20Airlines`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors" title="Share on LinkedIn"><FaLinkedin size={22} /></a>
                                {isHeroImagePresent && (<a href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(shareImage)}&description=${encodeURIComponent(shareTitle)}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-600 transition-colors" title="Pin on Pinterest"><FaPinterest size={22} /></a>)}
                                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`} target="_blank" rel="noopener noreferrer" data-action="share/whatsapp/share" className="text-gray-500 hover:text-green-500 transition-colors" title="Share on WhatsApp"><FaWhatsapp size={22} /></a>
                                <a href={`https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-orange-500 transition-colors" title="Share on Reddit"><FaRedditAlien size={22} /></a>
                                <a href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent("Check out this vlog post: " + shareUrl)}`} className="text-gray-500 hover:text-gray-700 transition-colors" title="Share via Email"><FaEnvelope size={22} /></a>
                            </div>
                        </section>

                        <section id="comments-section" aria-label="Comments" className="py-5 transition-opacity duration-500 delay-700 ease-in-out opacity-0 data-[loaded=true]:opacity-100" data-loaded={pageLoaded}>
                            <div className="mb-6 sm:mb-8">
                                <AddVlogCommentForm postId={post.id} onCommentAdded={fetchComments} isSubmittingForm={isSubmittingComment} setIsSubmittingForm={setIsSubmittingComment} />
                            </div>
                            {commentsLoading && <div className="text-center text-gray-500 py-4 text-base sm:text-lg"><FaSpinner className="animate-spin text-xl sm:text-2xl text-red-500 inline-block mr-2" /> Loading comments...</div>}
                            {commentsError && !commentsLoading && (
                                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm sm:text-base" role="alert">
                                    <FaExclamationTriangle className="inline-block mr-2" /> Error loading comments: {commentsError}
                                </div>
                            )}
                            {!commentsLoading && !commentsError && (
                                comments.filter(c => c.is_approved || (loggedInUser && c.user_id === loggedInUser.id && !c.is_approved) ).length > 0 ? (
                                    <div className="space-y-4 sm:space-y-5">
                                        {comments.filter(c => c.is_approved || (loggedInUser && c.user_id === loggedInUser.id && !c.is_approved)).map((comment) => (
                                            <div key={comment.id} className="comment-item flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out opacity-0 translate-y-3 data-[loaded=true]:opacity-100 data-[loaded=true]:translate-y-0" data-loaded={pageLoaded} style={{transitionDelay: `${100 + comments.findIndex(c => c.id === comment.id) * 50}ms`}}>
                                                { comment.user_avatar_url ?
                                                    <img loading="lazy" src={comment.user_avatar_url.startsWith('/') ? API_URL + comment.user_avatar_url : comment.user_avatar_url} alt={comment.user_name || comment.guest_name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0 mt-0.5" />
                                                    : <FaUserCircle className="text-gray-300 text-4xl sm:text-5xl flex-shrink-0 mt-0.5" />
                                                }
                                                <div className="flex-grow">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-semibold text-base sm:text-lg text-gray-800">{comment.user_name || comment.guest_name || 'Anonymous'}</span>
                                                        <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0 ml-2">{formatCommentDate(comment.created_at)} {!comment.is_approved && <span className="text-yellow-600 italic ml-1">(Pending)</span>}</span>
                                                    </div>
                                                    {comment.rating && editingCommentId !== comment.id && (
                                                        <div className="flex items-center mb-1 sm:mb-1.5">
                                                            {[...Array(5)].map((_, i) => ( <FaStar key={i} className={`text-sm ${i < comment.rating ? 'text-yellow-400' : 'text-gray-300'}`} /> ))}
                                                        </div>
                                                    )}
                                                    {editingCommentId === comment.id ? (
                                                        <div className="mt-2">
                                                            <textarea value={editingCommentText} onChange={(e) => setEditingCommentText(e.target.value)}
                                                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-red-500" rows="3" />
                                                            <div className="mt-2 space-x-2">
                                                                <button onClick={() => handleSaveEdit(comment.id)} disabled={isSubmittingComment}
                                                                    className="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded-md disabled:opacity-50">
                                                                    {isSubmittingComment ? <FaSpinner className="animate-spin inline-block" /> : <FaSave className="inline-block" />} Save
                                                                </button>
                                                                <button onClick={handleCancelEdit} className="px-3 py-1 text-xs bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md">
                                                                    <FaTimes className="inline-block" /> Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap leading-relaxed">{comment.comment}</p>
                                                    )}
                                                    <div className="flex items-center mt-2.5 pt-2.5 space-x-3 sm:space-x-4 border-t border-gray-100">
                                                        <button onClick={() => handleLikeComment(comment.id)} title={comment.userLiked ? "Unlike this comment" : "Like this comment"}
                                                            className={`flex items-center text-xs sm:text-sm py-1 px-2 rounded-md transition-colors duration-150 group disabled:opacity-50 disabled:cursor-wait ${ comment.userLiked ? 'text-red-600 bg-red-100 font-semibold' : 'text-gray-500 hover:text-red-600 hover:bg-red-50' }`}
                                                            disabled={likingCommentId === comment.id || isSubmittingComment}>
                                                            {likingCommentId === comment.id ? <FaSpinner className="animate-spin mr-1 text-xs" /> : (comment.userLiked ? <FaThumbsUp className="mr-1 text-red-500 text-sm" /> : <FaRegThumbsUp className="mr-1 group-hover:text-red-500 text-sm" />)}
                                                            {comment.userLiked ? 'Liked' : 'Like'}
                                                        </button>
                                                        {(comment.likes || 0) > 0 && ( <span className="text-xs text-gray-500">{comment.likes} {comment.likes === 1 ? "like" : "likes"}</span> )}
                                                        {isAuthenticated && loggedInUser && comment.user_id === loggedInUser.id && comment.is_approved && editingCommentId !== comment.id && (
                                                            <button onClick={() => handleEditComment(comment)} title="Edit your comment"
                                                                className="flex items-center text-xs sm:text-sm py-1 px-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-150 group">
                                                                <FaEdit className="mr-1 group-hover:text-blue-500 text-sm" /> Edit
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-6 text-base sm:text-lg">
                                        <FaRegCommentDots className="text-3xl sm:text-4xl text-gray-400 mb-2 inline-block" />
                                        <p>Be the first to share your thoughts on this post!</p>
                                    </div>
                                )
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VlogPostPage;