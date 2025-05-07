// frontend/src/pages/client/Vlog/VlogListPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { API_URL } from '../../../api/apis'; // Your API base URL constant
import { FaSearch, FaSpinner, FaExclamationTriangle, FaRegClock, FaUserEdit } from 'react-icons/fa'; // Import icons

// Debounce function: Limits how often a function is called after an event stops firing.
// Useful for search inputs to avoid API calls on every keystroke.
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

const VlogListPage = () => {
    // State for storing the posts fetched from the API
    const [posts, setPosts] = useState([]);
    // State to track if data is currently being fetched
    const [loading, setLoading] = useState(true);
    // State to store any error message during fetching
    const [error, setError] = useState(null);
    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);

    // Hook to manage URL query parameters (like ?page=2&search=test)
    const [searchParams, setSearchParams] = useSearchParams();
    // State for the search input field, initialized from URL parameter
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    const POSTS_PER_PAGE = 6; // Number of posts to display per page

    // Function to fetch posts data from the backend API
    // useCallback ensures the function reference is stable unless its dependencies change
    const fetchPosts = useCallback(async (page = 1, search = '') => {
        console.log(`Fetching posts: page=${page}, search='${search}'`); // Debug log
        setLoading(true);
        setError(null);
        // We don't clear posts here immediately to avoid flicker during pagination/search loading

        try {
            // Construct the API URL based on page and search term
            // *** IMPORTANT: Verify this URL matches your PHP backend router ***
            // It should point to the controller method that returns JSON for the post list
            let apiUrl = `${API_URL}/vlogPost/listPublished?limit=${POSTS_PER_PAGE}&page=${page}`;
            if (search) {
                apiUrl += `&search=${encodeURIComponent(search)}`;
            }

            console.log(`Fetching from URL: ${apiUrl}`); // Debug log

            const response = await fetch(apiUrl);

            // Check if the response is successful and is JSON before parsing
            const contentType = response.headers.get("content-type");
            if (!response.ok || !contentType || !contentType.includes("application/json")) {
                 const textResponse = await response.text(); // Get response text for debugging
                 console.error("API Error: Non-JSON response received:", response.status, textResponse);
                 throw new Error(`Server responded with status ${response.status}. Expected JSON but received different content. Check API endpoint or server logs.`);
            }

            // Parse the JSON response
            const result = await response.json();
            console.log("API Response:", result); // Debug log

            // Update state based on the received JSON data
            if (result.status === 200 && result.data) {
                setPosts(result.data.posts || []);
                setTotalPosts(result.data.total || 0);
                // Use totalPages directly from API if available, otherwise calculate
                setTotalPages(result.data.totalPages !== undefined ? result.data.totalPages : (result.data.total > 0 ? Math.ceil(result.data.total / POSTS_PER_PAGE) : 0));
                // Use page directly from API if available
                setCurrentPage(result.data.page !== undefined ? result.data.page : page);
            } else {
                // Handle cases where API returns status 200 but indicates an error in the JSON body
                throw new Error(result.message || 'Failed to fetch posts or invalid data format');
            }
        } catch (err) {
            // Catch fetch errors or errors thrown above
            console.error("Error fetching vlog posts:", err);
            setError(err.message); // Display error message to user
            setPosts([]); // Clear posts on error
            setTotalPages(0);
            setTotalPosts(0);
        } finally {
            // Ensure loading state is always turned off
            setLoading(false);
        }
    }, []); // Empty dependency array: fetchPosts itself doesn't depend on component state


    // Debounced function to update URL search parameters after user stops typing
    const debouncedUrlUpdate = useCallback(debounce((search) => {
         setSearchParams(params => {
            params.set('page', '1'); // Reset to page 1 when search term changes
            if (search) {
                params.set('search', search);
            } else {
                params.delete('search'); // Remove search param if input is empty
            }
            return params; // Return the modified params object
        }, { replace: true }); // Use replace to avoid filling browser history with search updates
     }, 500), [setSearchParams]); // Recreate only if setSearchParams changes (shouldn't happen)


    // Effect Hook: Runs when URL search parameters change (page or search)
    // This triggers the actual data fetching based on the current URL state
    useEffect(() => {
        console.log("Search params changed:", searchParams.toString()); // Debug log
        const currentPageParam = parseInt(searchParams.get('page') || '1', 10);
        const currentSearchParam = searchParams.get('search') || '';
        // Update local searchTerm state if the URL param changes (e.g., back button)
        if (currentSearchParam !== searchTerm) {
            setSearchTerm(currentSearchParam);
        }
        // Fetch data based on the current URL parameters
        fetchPosts(currentPageParam, currentSearchParam);
    }, [searchParams, fetchPosts]); // Dependencies: re-run if URL params or fetchPosts function changes


    // Handler for the search input field's onChange event
    const handleSearchChange = (event) => {
        const newSearchTerm = event.target.value;
        setSearchTerm(newSearchTerm); // Update the input field value immediately
        debouncedUrlUpdate(newSearchTerm); // Trigger the debounced URL update
    };

    // Handler for pagination button clicks
    const handlePageChange = (newPage) => {
        // Update URL parameters if the new page is valid
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            setSearchParams(params => {
                params.set('page', newPage.toString());
                // Keep the current search term in the URL
                const currentSearch = params.get('search');
                 if (currentSearch) {
                     params.set('search', currentSearch);
                 } else {
                     params.delete('search');
                 }
                return params;
            });
            window.scrollTo(0, 0); // Scroll to top of page after page change
        }
    };


    // --- JSX Rendering ---
    return (
        <div className="container mx-auto px-4 py-10 min-h-screen">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Travel Vlog</h1>

            {/* Search Bar */}
            <div className="mb-8 max-w-lg mx-auto">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search vlog posts..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* Loading State Indicator */}
            {loading && (
                 <div className="text-center py-10">
                     <FaSpinner className="animate-spin text-3xl text-blue-500 inline-block" />
                     <p className="mt-2 text-gray-600">Loading posts...</p>
                 </div>
             )}

            {/* Error State Display */}
            {error && !loading && (
                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center my-6" role="alert">
                     <FaExclamationTriangle className="inline-block mr-2" /> Error loading posts: {error}
                 </div>
             )}

            {/* No Posts Found Message */}
            {!loading && !error && posts.length === 0 && (
                 <div className="text-center text-gray-500 py-10">
                     No vlog posts found{searchTerm ? ` matching "${searchTerm}"` : ''}.
                 </div>
             )}

            {/* Posts Grid (only render if not loading, no error, and posts exist) */}
            {!loading && !error && posts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                    {posts.map(post => (
                        // Link each card to the individual post page using its slug
                        <Link to={`/vlog/${post.slug}`} key={post.id} className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                            {/* Post Image */}
                            <img
                                // Construct image URL, handle relative paths, provide fallback
                                src={post.featured_image_url ? (post.featured_image_url.startsWith('/') ? API_URL + post.featured_image_url : post.featured_image_url) : '/img/placeholder-vlog.jpg'}
                                alt={post.title}
                                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105 bg-gray-200" // Background for loading/missing images
                                onError={(e) => { e.target.onerror = null; e.target.src = '/img/placeholder-vlog.jpg'; }} // Fallback image on error
                            />
                            {/* Post Details */}
                            <div className="p-5">
                                <h2 title={post.title} className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300 overflow-hidden overflow-ellipsis whitespace-nowrap">
                                    {post.title}
                                </h2>
                                <div className="text-xs text-gray-500 flex items-center justify-between">
                                     {/* Author Info */}
                                     <span className="flex items-center truncate" title={post.author_name || 'Admin'}>
                                        <FaUserEdit className="mr-1 flex-shrink-0"/>
                                        <span className="truncate">{post.author_name || 'Admin'}</span>
                                    </span>
                                     {/* Date Info */}
                                     <span className="flex items-center flex-shrink-0" title={new Date(post.created_at).toLocaleDateString()}>
                                        <FaRegClock className="mr-1"/> {new Date(post.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Pagination Controls (only show if not loading, no error, and more than one page) */}
            {!loading && !error && totalPages > 1 && (
                <nav aria-label="Pagination" className="flex justify-center items-center space-x-2 mt-10">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border rounded-md bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border rounded-md bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </nav>
            )}
        </div>
    );
};

export default VlogListPage;
