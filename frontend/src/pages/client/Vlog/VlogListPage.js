import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { API_URL } from '../../../api/apis';
import { Helmet } from 'react-helmet';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import {
    FaSearch, FaSpinner, FaExclamationTriangle,
    FaChevronLeft, FaChevronRight, FaChevronDown, FaChevronUp,
    FaSun, FaCloudSun, FaCloud, FaSmog, FaCloudRain, FaSnowflake, FaMapMarkerAlt, FaClock, FaThermometerHalf, FaBolt
} from 'react-icons/fa';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customIcon = new L.divIcon({
    html: `<div class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </div>`,
    className: 'bg-transparent border-0',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -8]
});

const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

const PostCardSkeleton = () => (
    <div className="bg-white rounded-[15px] shadow-[0_10px_20px_rgba(0,0,0,0.05)] overflow-hidden animate-pulse">
        <div className="w-full aspect-[3/1] bg-gray-300"></div>
        <div className="p-4 md:p-5">
            <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
    </div>
);

const HERO_VIDEO_ID = 'CDx2fxb5ZF4';

const travelShockFacts = [
    {
        id: 1,
        question: "Can a massive cave truly develop its own internal weather system?",
        answer: "Indubitably! Vietnam's Son Doong Cave, reigning as the planet's most expansive known cave, possesses such colossal dimensions that it actively cultivates its own cloud formations and localized weather phenomena deep within its vast chambers. This extraordinary subterranean realm doesn't stop there; it also nurtures a flourishing, dense jungle and cradles a significant subterranean river, effectively establishing an entirely self-contained and unique ecosystem far beneath the Earth's surface."
    },
    {
        id: 2,
        question: "Is it feasible to have bespoke clothing tailored and ready within just one day?",
        answer: "Within the historically rich and vibrant trading port of Hoi An, Vietnam, this seemingly ambitious feat is an everyday occurrence. Exceptionally skilled local artisans and tailors can meticulously craft bespoke garments, ranging from the elegantly traditional ao dais to impeccably sharp modern suits, frequently completing these custom orders within a remarkable 24 to 48-hour timeframe. This unparalleled celerity, combined with the high standard of craftsmanship, provides an unforgettable and distinctly personalized shopping adventure for visitors from around the globe."
    },
    {
        id: 3,
        question: "What is the unusual process behind the making of 'weasel coffee'?",
        answer: "Vietnam is renowned for its production of 'cà phê chồn,' an exceptionally unique and sought-after coffee. Its distinct character arises from a fascinating natural process: coffee cherries are consumed by civets (small, nocturnal mammals often likened to weasels). As the beans pass through the civet's digestive system, specific enzymes are believed to interact with them, subtly altering their chemical structure. This enzymatic action is credited with refining the beans, purportedly resulting in a coffee that is exceptionally smooth, remarkably less bitter, and possessed of a complex, rich flavor profile. Consequently, it stands as one of the world's most unconventional, labor-intensive, and notably expensive coffee brewing traditions."
    },
    {
        id: 4,
        question: "What's the scale of motorbike traffic in a major Southeast Asian city?",
        answer: "In vibrant, dynamic cities such as Hanoi or Ho Chi Minh City, the daily urban landscape is characterized by a staggering volume of motorbikes, numbering in the millions. These two-wheeled vehicles form a seemingly ceaseless, fluid, and intricate stream of traffic that defines the city's rhythm. It is a common and often astonishing sight to witness entire families—sometimes three or four people—or improbably large and unwieldy items being deftly transported on a single scooter, a testament to the incredible balance, ingenuity, and resourcefulness of the local populace."
    },
    {
        id: 5,
        question: "Are there local legends about dragons forming thousands of islands?",
        answer: "Indeed, the breathtakingly beautiful Ha Long Bay in Vietnam, a designated UNESCO World Heritage site renowned for its nearly 2,000 majestic limestone islets and karsts rising dramatically from emerald waters, is steeped in such a legend. According to deeply ingrained local mythology, these awe-inspiring formations were brought into existence by powerful celestial dragons. The lore recounts that these benevolent dragons descended from the heavens to aid and protect the Vietnamese people, spitting out countless precious jewels that, upon hitting the water, transformed into the myriad islands, thereby erecting a formidable natural defensive barrier against seafaring invaders."
    },
    {
        id: 6,
        question: "Can you find a street where a train passes incredibly close to homes?",
        answer: "Hanoi's widely recognized 'train street' is precisely such a location – a remarkably narrow residential alleyway where, astonishingly, a full-sized locomotive thunders through twice each day. The train passes with startling proximity, just a whisker away from the thresholds of private homes and the tables of impromptu trackside cafes. This unique urban feature has evolved into a distinctive, though occasionally precarious, point of interest for tourists, offering a truly startling and intimate glimpse into the everyday fabric of city life and human adaptation."
    },
    {
        id: 7,
        question: "What is the cultural importance of traditional water puppetry?",
        answer: "Water puppetry, an art form that first emerged in the flooded rice paddies of northern Vietnam many centuries ago, stands as a uniquely captivating and deeply ingrained traditional performance art. The puppets, often ornately carved and lacquered, are skillfully manipulated by puppeteers who remain concealed behind a specially designed screen, their long poles and strings hidden beneath the water's surface. This clever staging creates the illusion that the puppets are gracefully dancing and gliding across the water. The performances themselves frequently depict scenes of rural daily life, celebrated historical events, ancient legends, and rich folklore, providing audiences with an enchanting and historically significant cultural experience."
    },
    {
        id: 8,
        question: "Is there a famous bridge that appears to be held by giant stone hands?",
        answer: "Affirmative, the Golden Bridge (Cau Vang), situated in the Ba Na Hills near Da Nang, Vietnam, is a relatively recent yet instantly iconic architectural masterpiece. This striking pedestrian walkway is ingeniously designed to give the illusion of being tenderly held aloft by two colossal, weathered stone hands that seem to emerge organically from the verdant mountainside. Beyond its unique design, the bridge offers visitors absolutely breathtaking panoramic views of the surrounding landscapes, quickly becoming a surreal and highly sought-after, 'Insta-famous' destination for photographers and travelers alike."
    },
    {
        id: 9,
        question: "Can you actually spend the night on a boat amidst towering limestone karsts?",
        answer: "Experiencing an overnight cruise in the stunningly scenic Ha Long Bay or the equally beautiful, though perhaps less crowded, Lan Ha Bay offers precisely this extraordinary opportunity. Imagine drifting off to sleep and then awakening to the serene, almost mystical beauty of mist-shrouded karsts piercing the tranquil waters. These voyages typically allow for activities such as kayaking through hidden lagoons and grottoes, exploring secluded beaches, and indulging in freshly caught seafood, all while being gently rocked by the waves in one of the world's most spectacularly picturesque and geologically significant natural seascapes."
    }
];

const StyledSectionHeader = ({ title, subtitle }) => (
    <div className="text-center max-w-[800px] mx-auto my-0 mb-16 md:mb-20 opacity-0 translate-y-5 transition-all duration-700 ease-out data-[loaded=true]:opacity-100 data-[loaded=true]:translate-y-0" data-loaded="true">
        <h2 className="text-[2.8rem] text-red-700 mb-8 relative inline-block after:content-[''] after:absolute after:-bottom-[12px] after:left-1/2 after:-translate-x-1/2 after:w-[90px] after:h-[4px] after:transition-width after:duration-300 after:ease-in-out after:bg-red-700 md:text-[2.2rem] group hover:after:w-[130px]">
            {title}
        </h2>
        {subtitle && (
            <p className="text-[1.15rem] leading-[1.8] text-[#555] mb-6">
                {subtitle}
            </p>
        )}
    </div>
);

const FactItem = ({ question, answer, id, activeHoverId, setActiveHoverId }) => {
    const isHovered = activeHoverId === id;
    return (
        <div
            className="border-b border-gray-200 last:border-b-0"
            onMouseEnter={() => setActiveHoverId(id)}
            onMouseLeave={() => setActiveHoverId(null)}
        >
            <div className="flex justify-between items-center w-full py-6 text-left group cursor-default">
                <span className={`text-[1.25rem] font-medium transition-colors duration-200 ${isHovered ? 'text-red-700' : 'text-[#343a40] group-hover:text-red-600'}`}>{question}</span>
                {isHovered ?
                    <FaChevronUp className={`w-5 h-5 text-red-700 transition-transform duration-300 ease-in-out`} /> :
                    <FaChevronDown className={`w-5 h-5 text-gray-400 group-hover:text-red-600 transition-transform duration-300 ease-in-out`} />
                }
            </div>
            <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isHovered ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className={`pt-0 pb-6 text-[#555] leading-[1.8] text-[1.1rem] transform transition-transform duration-500 ease-in-out ${isHovered ? 'translate-y-0 opacity-100 delay-100' : '-translate-y-2 opacity-0'}`}>
                    {answer}
                </div>
            </div>
        </div>
    );
};

const InteractiveWorldMap = ({ hubs }) => {
    const [currentTimes, setCurrentTimes] = useState({});

    useEffect(() => {
        const updateTimes = () => {
            const newTimes = {};
            const now = new Date();
            hubs.forEach(hub => {
                try {
                    newTimes[hub.id] = now.toLocaleTimeString('en-US', {
                        timeZone: hub.timezone,
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    });
                } catch (e) {
                    console.error(`Invalid timezone string: ${hub.timezone}`);
                    newTimes[hub.id] = 'Invalid Timezone';
                }
            });
            setCurrentTimes(newTimes);
        };

        updateTimes();
        const intervalId = setInterval(updateTimes, 60000);

        return () => clearInterval(intervalId);
    }, [hubs]);

    const mapCenter = [20, 10];
    const mapZoom = 2;

    const WeatherIcon = ({ icon: IconName }) => {
        if (!IconName) return null;
        const iconColor = IconName === FaSun ? 'text-yellow-500' : IconName === FaCloudRain ? 'text-blue-600' : IconName === FaSnowflake ? 'text-cyan-400' : IconName === FaBolt ? 'text-yellow-400' : 'text-gray-500';
        return <IconName className={`inline-block mr-2 mb-0.5 text-xl ${iconColor}`} />;
    };


    return (
        <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            minZoom={2}
            maxZoom={10}
            scrollWheelZoom={true}
            style={{ height: '550px', width: '100%', borderRadius: '15px', zIndex: 0 }}
            className="shadow-lg border border-gray-200"
            worldCopyJump={true}
        >
            <TileLayer
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {hubs.map(hub => (
                <Marker key={hub.id} position={[hub.lat, hub.lng]} icon={customIcon}>
                    <Popup>
                        <div className="p-2.5 font-sans w-44 bg-white rounded-lg shadow-xl">
                            <h4 className="font-bold text-gray-800 text-base mb-1 flex items-center border-b border-gray-100 pb-1.5">
                                {hub.name}
                            </h4>
                            <p className="text-xs text-gray-500 mb-2 -mt-0.5">{hub.country}</p>
                            <div className="pt-1 space-y-1">
                                <p className="flex items-center text-sm text-gray-700">
                                    <FaClock className="inline-block mr-2 text-gray-400"/>
                                    {currentTimes[hub.id] || <FaSpinner className="animate-spin ml-1"/>}
                                </p>
                                <p className="flex items-center text-sm text-gray-700">
                                    <WeatherIcon icon={hub.weatherIcon} />
                                    {hub.tempC !== null ? `${hub.tempC}°C` : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};


const VlogListPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [headerPlaceholderHeight, setHeaderPlaceholderHeight] = useState(70);
    const [activeHoverFactId, setActiveHoverFactId] = useState(null);
    const [scrollY, setScrollY] = useState(0);
    const [pageLoaded, setPageLoaded] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    const POSTS_PER_PAGE = 5;

    const handleScroll = useCallback(() => {
        setScrollY(window.scrollY);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);


    useEffect(() => {
        const headerElement = document.querySelector('.your-main-fixed-header-class');
        if (headerElement) {
            setHeaderPlaceholderHeight(headerElement.offsetHeight);
        }
    }, []);

    const fetchPosts = useCallback(async (page = 1, search = '') => {
        setLoading(true);
        setError(null);
        setPageLoaded(false);
        try {
            let apiUrl = `${API_URL}/vlogPost/listPublished?limit=${POSTS_PER_PAGE}&page=${page}`;
            if (search) apiUrl += `&search=${encodeURIComponent(search)}`;

            const response = await fetch(apiUrl);
            const contentType = response.headers.get("content-type");

            if (!response.ok) {
                let errorMessageFromServer = `Server responded with status ${response.status}.`;
                try {
                    if (contentType && contentType.includes("application/json")) {
                        const errorResult = await response.json();
                        errorMessageFromServer = errorResult.message || JSON.stringify(errorResult);
                    } else {
                        const textError = await response.text();
                        errorMessageFromServer = `Server error ${response.status}: ${textError.substring(0, 200)}${textError.length > 200 ? '...' : ''}`;
                    }
                } catch (e) {
                    const textErrorFallback = await response.text().catch(() => "Could not retrieve error body.");
                    errorMessageFromServer = `Server error ${response.status}. Response body could not be parsed. Preview: ${textErrorFallback.substring(0, 200)}${textErrorFallback.length > 200 ? '...' : ''}`;
                }
                throw new Error(errorMessageFromServer);
            }

            if (contentType && contentType.includes("application/json")) {
                const result = await response.json();
                if (result.status === 200 && result.data) {
                    setPosts(result.data.posts || []);
                    setTotalPages(result.data.totalPages !== undefined ? result.data.totalPages : (result.data.total > 0 ? Math.ceil(result.data.total / POSTS_PER_PAGE) : 0));
                    setCurrentPage(result.data.page !== undefined ? result.data.page : page);
                } else {
                    throw new Error(result.message || 'Failed to fetch posts due to invalid data format in an otherwise successful server response.');
                }
            } else {
                const textResponse = await response.text();
                throw new Error(`Expected a JSON response from a successful request, but received '${contentType || 'unknown/missing content type'}'. Content preview: ${textResponse.substring(0,100)}${textResponse.length > 100 ? '...' : ''}`);
            }

        } catch (err) {
            let displayError = err.message;
            if (err instanceof SyntaxError && err.message.toLowerCase().includes("unexpected token")) {
                displayError = `The server's response was not in the expected JSON format, which is necessary for displaying data. This might be due to a server-side HTML error page or plain text being sent instead of JSON. (Details: ${err.message})`;
            }
            setError(displayError);
            setPosts([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
            setTimeout(() => setPageLoaded(true), 100);
        }
    }, [POSTS_PER_PAGE]);


    const debouncedUrlUpdate = useCallback(debounce((search) => {
        setSearchParams(params => {
            params.set('page', '1');
            if (search) params.set('search', search);
            else params.delete('search');
            return params;
        }, { replace: true });
    }, 500), [setSearchParams]);

    useEffect(() => {
        const currentPageParam = parseInt(searchParams.get('page') || '1', 10);
        const currentSearchParam = searchParams.get('search') || '';
        fetchPosts(currentPageParam, currentSearchParam);
    }, [searchParams, fetchPosts]);

    const handleSearchChange = (event) => {
        const newSearchTerm = event.target.value;
        setSearchTerm(newSearchTerm);
        debouncedUrlUpdate(newSearchTerm);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            setSearchParams(params => {
                params.set('page', newPage.toString());
                return params;
            });
            const vlogGridTitle = document.getElementById('vlog-grid-title');
            if (vlogGridTitle) {
                vlogGridTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                const heroSectionHeight = document.getElementById('vlog-page-hero')?.offsetHeight || 0;
                window.scrollTo({ top: heroSectionHeight + headerPlaceholderHeight, behavior: 'smooth' });
            }
        }
    };

    const thematicCategories = [
        { name: "Floral Cycles", image: 'https://images.unsplash.com/photo-1604323990536-e5452c0507c1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', link: '/vlog?theme=hanoi-old-quarter', description: "Colorful blooms on bicycles brightening city streets." },
        { name: "Soaring Skyscraper", image: 'https://images.unsplash.com/photo-1602646994030-464f98de5e5c?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', link: '/vlog?theme=vietnam-street-eats', description: "Panoramic views from a modern architectural marvel." },
        { name: "River Delta Life", image: 'https://images.unsplash.com/photo-1580534510745-5c753903769c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', link: '/vlog?theme=ha-long-cruises', description: "Vibrant waterways, floating markets, and lush landscapes." },
        { name: "Sun-Kissed Beaches", image: 'https://images.unsplash.com/photo-1578458329607-534298aebc4d?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', link: '/vlog?theme=hoi-an-nights', description: "Relax on sandy shores and enjoy clear coastal waters." },
        { name: "Literary Pavilion", image: 'https://images.unsplash.com/photo-1547158291-06774526756c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', link: '/vlog?theme=sapa-landscapes', description: "An iconic pavilion, a historic symbol of wisdom and learning." },
        { name: "Street Vendor Vibes", image: 'https://images.unsplash.com/photo-1616438096679-620332ede3a2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', link: '/vlog?theme=vietnam-coffee', description: "Lively culture and diverse offerings from street sellers." },
        { name: "Iconic Hand Bridge", image: 'https://images.unsplash.com/photo-1588411393236-d2524cca1196?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', link: '/vlog?theme=traditional-crafts', description: "Stunning pedestrian bridge seemingly held by giant stone hands." },
        { name: "Verdant Terraces", image: 'https://images.unsplash.com/photo-1606801954050-be6b29588460?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', link: '/vlog?theme=da-nang-dragon', description: "Breathtaking beauty of cascading green agricultural fields." },
        { name: "Karst Waterways", image: 'https://images.unsplash.com/photo-1531737212413-667205e1cda7?q=80&w=1934&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', link: '/vlog?theme=urban-vietnam', description: "Peaceful boat trips through stunning limestone formations." },
        { name: "Apartment Cafes", image: 'https://images.unsplash.com/photo-1602646993776-5dd8e166e6fd?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', link: '/vlog?theme=timeless-ao-dai', description: "Hidden coffee gems in old buildings on vibrant pedestrian streets." },
        { name: "Highland Culture", image: 'https://images.unsplash.com/photo-1603486037214-4fec4016a9bf?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', link: '/vlog?theme=pho-delight', description: "Rich traditions and vibrant attire of a mountain ethnic group." },
    ];

    const majorHubs = [
        { id: 1, name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London', weatherIcon: FaCloudSun, tempC: 15 },
        { id: 2, name: 'Tokyo', country: 'Japan', lat: 35.6895, lng: 139.6917, timezone: 'Asia/Tokyo', weatherIcon: FaSun, tempC: 28 },
        { id: 3, name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060, timezone: 'America/New_York', weatherIcon: FaCloud, tempC: 22 },
        { id: 4, name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, timezone: 'Europe/Paris', weatherIcon: FaCloudRain, tempC: 18 },
        { id: 5, name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, timezone: 'Australia/Sydney', weatherIcon: FaSun, tempC: 25 },
        { id: 6, name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, timezone: 'Asia/Singapore', weatherIcon: FaCloudSun, tempC: 30 },
        { id: 7, name: 'Dubai', country: 'UAE', lat: 25.276987, lng: 55.296249, timezone: 'Asia/Dubai', weatherIcon: FaSun, tempC: 35 },
        { id: 8, name: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437, timezone: 'America/Los_Angeles', weatherIcon: FaSun, tempC: 26 },
        { id: 9, name: 'Frankfurt', country: 'Germany', lat: 50.1109, lng: 8.6821, timezone: 'Europe/Berlin', weatherIcon: FaCloud, tempC: 19 },
        { id: 10, name: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018, timezone: 'Asia/Bangkok', weatherIcon: FaBolt, tempC: 32 },
        { id: 11, name: 'Sao Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, timezone: 'America/Sao_Paulo', weatherIcon: FaCloudRain, tempC: 20 },
        { id: 12, name: 'Johannesburg', country: 'South Africa', lat: -26.2041, lng: 28.0473, timezone: 'Africa/Johannesburg', weatherIcon: FaSun, tempC: 17 },
        { id: 13, name: 'Chicago', country: 'USA', lat: 41.8781, lng: -87.6298, timezone: 'America/Chicago', weatherIcon: FaCloudSun, tempC: 21 },
        { id: 14, name: 'Ho Chi Minh City', country: 'Vietnam', lat: 10.8231, lng: 106.6297, timezone: 'Asia/Ho_Chi_Minh', weatherIcon: FaCloudSun, tempC: 31 },
        { id: 15, name: 'Moscow', country: 'Russia', lat: 55.7558, lng: 37.6173, timezone: 'Europe/Moscow', weatherIcon: FaSnowflake, tempC: 5 },
        { id: 16, name: 'Hong Kong', country: 'China', lat: 22.3193, lng: 114.1694, timezone: 'Asia/Hong_Kong', weatherIcon: FaCloud, tempC: 29 },
        { id: 17, name: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784, timezone: 'Europe/Istanbul', weatherIcon: FaSun, tempC: 24 },
        { id: 18, name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041, timezone: 'Europe/Amsterdam', weatherIcon: FaCloudRain, tempC: 16 },
        { id: 19, name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, timezone: 'America/Toronto', weatherIcon: FaCloudSun, tempC: 20 },
        { id: 20, name: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332, timezone: 'America/Mexico_City', weatherIcon: FaSun, tempC: 23 },
        { id: 21, name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816, timezone: 'America/Argentina/Buenos_Aires', weatherIcon: FaSun, tempC: 19 },
        { id: 22, name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, timezone: 'Africa/Cairo', weatherIcon: FaSun, tempC: 34 },
        { id: 23, name: 'Nairobi', country: 'Kenya', lat: -1.2921, lng: 36.8219, timezone: 'Africa/Nairobi', weatherIcon: FaCloudSun, tempC: 22 },
        { id: 24, name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, timezone: 'Asia/Kolkata', weatherIcon: FaCloudRain, tempC: 29 },
        { id: 25, name: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780, timezone: 'Asia/Seoul', weatherIcon: FaCloud, tempC: 26 }
    ];

    const parallaxFactor = 1; // Adjusted factor for video parallax
    const videoParallaxOffset = scrollY * parallaxFactor;

    return (
        <>
            <Helmet>
                <title>Travel Vlogs: Visual Chronicles & Global Journeys | Claude Airlines</title>
                <meta name="description" content="Explore captivating travel vlogs from around the world. Discover inspiring destinations, adventure stories, culinary delights, and cultural insights. Start your visual journey with us!" />
                <meta name="keywords" content="travel vlogs, world travel, adventure travel, food travel, cultural vlogs, city explorations, nature escapes, vlog series, travel inspiration, vietnam travel" />
                <link rel="canonical" href="https://claude-airplanes.web.app/vlog" />
            </Helmet>

            <div className="font-sans text-gray-800 min-h-screen bg-slate-100 overflow-x-hidden">
                <style jsx global>{`
                    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                    .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
                    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                    .animate-\\[fadeInUp_0\\.8s_ease-out_forwards\\] { animation: fadeInUp 0.8s ease-out forwards; }
                    .animate-\\[fadeInUp_1s_ease-out_forwards\\] { animation: fadeInUp 1s ease-out forwards; }
                    .clamp-2-lines { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }

                    .swiper-pagination-bullet {
                        width: 10px; height: 10px; background-color: #94a3b8; opacity: 0.7;
                        border-radius: 50%; transition: opacity 0.3s, background-color 0.3s, transform 0.3s;
                        margin: 0 5px !important;
                    }
                    .swiper-pagination-bullet-active {
                        background-color: #DC2626;
                        opacity: 1; transform: scale(1.2);
                    }
                    .swiper-container-horizontal > .swiper-pagination-bullets, .swiper-pagination-custom, .swiper-pagination-fraction {
                        bottom: -65px !important;
                        padding-top: 15px;
                    }
                    .swiper-button-next, .swiper-button-prev {
                        color: #ffffff !important; background-color: rgba(0, 0, 0, 0.5);
                        border-radius: 50%; width: 44px !important; height: 44px !important;
                        display: flex; align-items: center; justify-content: center;
                        transition: background-color 0.3s ease, transform 0.2s ease;
                        box-shadow: 0 3px 7px rgba(0,0,0,0.25);
                        z-index: 10;
                    }
                    .swiper-button-next:hover, .swiper-button-prev:hover {
                        background-color: rgba(0, 0, 0, 0.7); transform: scale(1.1);
                    }
                    .swiper-button-next:after, .swiper-button-prev:after {
                        font-size: 20px !important; font-weight: bold;
                    }
                    .swiper-button-next { right: 10px; }
                    .swiper-button-prev { left: 10px; }

                    .transition-max-height { transition-property: max-height; }
                    .transition-all { transition-property: all; }
                    .leaflet-popup-content-wrapper { border-radius: 8px; box-shadow: 0 3px 10px rgba(0,0,0,0.15); border: none; background-color: #ffffff; }
                    .leaflet-popup-content { margin: 0 !important; padding: 0 !important; line-height: 1.6; min-width: 176px;}
                    .leaflet-popup-content p { margin-bottom: 4px !important; display: flex; align-items: center; }
                    .leaflet-popup-content h4 { margin-bottom: 6px !important; padding-bottom: 6px !important; border-bottom: 1px solid #eee;}
                    .leaflet-popup-tip { background: white; }
                    .leaflet-marker-icon .relative.flex { filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3)); }
                `}</style>

                <div style={{ height: `${headerPlaceholderHeight}px` }}></div>

                <section
                    id="vlog-page-hero"
                    className="relative flex flex-col items-center justify-center text-white overflow-hidden"
                    style={{ height: `calc(100vh - ${headerPlaceholderHeight}px)` }}
                >
                    <div className="absolute inset-0 w-full h-full z-0" style={{ transform: `translateY(${videoParallaxOffset}px)` }}>
                        <iframe
                            className="absolute top-1/2 left-1/2 w-full h-full min-w-[177.77vh] min-h-[56.25vw] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ top: '50%', left: '50%'}}
                            src={`https://www.youtube.com/embed/${HERO_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${HERO_VIDEO_ID}&controls=0&showinfo=0&modestbranding=1&iv_load_policy=3&fs=0&rel=0&disablekb=1&vq=hd1080`}
                            title="Hero Video Background"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen={false}
                        ></iframe>
                    </div>
                    <div className="absolute inset-0 bg-black/50 z-10"></div>

                    <div
                        className="relative z-20 text-center p-4 sm:p-6 flex flex-col items-center justify-center w-full h-full max-w-5xl mx-auto"

                        >
                        <div className="opacity-0 translate-y-5 transition-all duration-1000 ease-out data-[loaded=true]:opacity-100 data-[loaded=true]:translate-y-0" data-loaded={pageLoaded}>
                            <h1 className="text-[4.5rem] mb-8 font-bold [text-shadow:2px_2px_5px_rgba(0,0,0,0.6)] lg:text-[5rem] sm:text-[3rem] leading-tight">
                                <span className="block">Lens on the Horizon</span>
                                <span className="block">Visual Odysseys</span>
                            </h1>
                            <p className="text-[1.3rem] mb-10 [text-shadow:1px_1px_3px_rgba(0,0,0,0.6)] lg:text-[1.6rem] sm:text-[1.1rem] max-w-3xl">
                                Immerse yourself in compelling narratives, stunning visuals, and unforgettable explorations from every corner of the map.
                            </p>
                            <div className="w-full max-w-md sm:max-w-lg mx-auto">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="Search destinations, themes, or keywords..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="w-full py-3.5 px-6 pl-14 text-md md:text-lg text-white rounded-full shadow-2xl focus:outline-none focus:ring-4 focus:ring-sky-400/70 transition-all duration-300 bg-white/25 placeholder-gray-200/90 backdrop-blur-lg hover:bg-white/30 focus:bg-white/35 border border-white/40 focus:border-white/60"
                                    />
                                    <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-200/90 group-hover:text-sky-100 transition-colors duration-300 text-lg pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <main className="max-w-[1200px] mx-auto my-0">
                    <section id="vlog-grid-title" className="px-8 py-24 md:px-6 md:py-16">
                        <StyledSectionHeader title="Destination Diaries" subtitle="Fresh perspectives, inspiring stories, and practical tips from our global explorers and travel experts." />

                        {loading && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                                {Array.from({ length: POSTS_PER_PAGE }).map((_, index) => (
                                    <PostCardSkeleton key={index} />
                                ))}
                            </div>
                        )}
                        {error && (
                            <div className="text-center text-red-700 py-20 bg-red-50 p-8 rounded-[15px] shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                                <FaExclamationTriangle className="text-6xl text-red-500 mb-5 inline-block" />
                                <p className="text-[1.6rem] font-semibold mb-3">Oops! Something went wrong.</p>
                                <p className="text-[1.15rem] text-[#555]">{error}</p>
                                <p className="mt-4 text-sm text-red-600">Please try refreshing the page or check back later. It's possible the server is having issues with search requests.</p>
                            </div>
                        )}
                        {!loading && !error && posts.length === 0 && (
                            <div className="text-center text-gray-600 py-20 bg-white p-10 rounded-[15px] shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                                <FaSearch className="text-6xl text-gray-400 mb-8 inline-block" />
                                <p className="text-[1.6rem] font-semibold mb-4 text-[#343a40]">No Vlogs Found</p>
                                <p className="text-[1.15rem] text-[#555] max-w-md mx-auto">
                                    {searchTerm ? `Sorry, we couldn't find any vlogs matching "${searchTerm}". Try a different keyword!` : 'Our adventurers are currently crafting new stories. Please check back soon for exciting vlogs!'}
                                </p>
                            </div>
                        )}
                        {!loading && !error && posts.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                                {posts.map((post, index) => (
                                    <Link
                                        to={`/vlog/${post.slug}`}
                                        key={post.id}
                                        className="post-card block rounded-[15px] shadow-[0_10px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-70 overflow-hidden hover:-translate-y-[5px] relative opacity-0 translate-y-5 data-[loaded=true]:opacity-100 data-[loaded=true]:translate-y-0"
                                        data-loaded={pageLoaded}
                                        style={{ transitionDelay: `${100 + index * 75}ms` }}
                                    >
                                        <div className="relative aspect-[3/1] overflow-hidden">
                                            <img
                                                loading="lazy"
                                                src={post.featured_image ? (post.featured_image.startsWith('/') ? API_URL + post.featured_image : post.featured_image) : 'https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg?auto=compress&cs=tinysrgb&w=600'}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 bg-gray-200"
                                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg?auto=compress&cs=tinysrgb&w=600'; }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end p-4 transition-opacity duration-300">
                                                <h3 title={post.title} className="text-2xl md:text-2xl font-semibold text-white group-hover:text-red-100 transition-colors duration-300 leading-tight clamp-2-lines [text-shadow:1px_1px_3px_rgba(0,0,0,0.6)]">
                                                    {post.title}
                                                </h3>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {!loading && !error && totalPages > 1 && (
                            <nav aria-label="Pagination" className="flex justify-center items-center space-x-2 sm:space-x-3 mt-20 md:mt-24">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-100 text-[#343a40] hover:text-red-700 text-sm font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <FaChevronLeft className="inline -ml-1 mr-1" /> Previous
                                </button>
                                <span className="text-[1rem] text-[#343a40] font-medium px-2">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-100 text-[#343a40] hover:text-red-700 text-sm font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    Next <FaChevronRight className="inline -mr-1 ml-1"/>
                                </button>
                            </nav>
                        )}
                    </section>

                    <section className="px-8 py-24 md:px-6 md:py-16 opacity-0 transition-opacity duration-700 delay-300 ease-in-out data-[loaded=true]:opacity-100" data-loaded={pageLoaded}>
                        <StyledSectionHeader
                            title="Ever Wondered?"
                            subtitle="Dive into these intriguing travel snippets that might just surprise you about the world we explore!"
                        />
                        <div className="bg-white p-8 md:p-12 rounded-[15px] shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                            {travelShockFacts.map((fact) => (
                                <FactItem
                                    key={fact.id}
                                    id={fact.id}
                                    question={fact.question}
                                    answer={fact.answer}
                                    activeHoverId={activeHoverFactId}
                                    setActiveHoverId={setActiveHoverFactId}
                                />
                            ))}
                        </div>
                    </section>
                    <section className="px-8 py-24 md:px-6 md:py-16 opacity-0 transition-opacity duration-700 delay-700 ease-in-out data-[loaded=true]:opacity-100" data-loaded={pageLoaded}>
                        <StyledSectionHeader title="Global Hubs Live" subtitle="Check current conditions at some of our key destinations around the world." />
                        <div className="bg-white p-6 md:p-8 rounded-[15px] shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                            <InteractiveWorldMap hubs={majorHubs} />
                        </div>
                    </section>

                    <section className="py-24 md:py-16 opacity-0 transition-opacity duration-700 delay-500 ease-in-out data-[loaded=true]:opacity-100" data-loaded={pageLoaded}>
                        <StyledSectionHeader title="Thematic Adventures" subtitle="Embark on curated visual journeys through our diverse collection of vlog themes." />
                        <Swiper
                            effect={'coverflow'}
                            grabCursor={true}
                            centeredSlides={true}
                            slidesPerView={'auto'}
                            loop={thematicCategories.length > 3}
                            coverflowEffect={{
                                rotate: 30,
                                stretch: -25,
                                depth: 100,
                                modifier: 1,
                                slideShadows: false,
                            }}
                            navigation={thematicCategories.length > 2}
                            modules={[EffectCoverflow, Navigation]}
                            className="pb-12 pt-5"
                        >
                            {thematicCategories.map((theme) => (
                                <SwiperSlide
                                    key={theme.name}
                                    style={{ width: '280px', height: '420px' }}
                                    className="rounded-[15px] overflow-hidden group"
                                >
                                    <Link
                                        to={theme.link}
                                        className="block w-full h-full relative shadow-[0_8px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-shadow duration-300 ease-in-out"
                                    >
                                        <img
                                            loading="lazy"
                                            src={theme.image}
                                            alt={theme.name}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                                        <div className="relative p-4 md:p-5 flex flex-col justify-end h-full">
                                            <h3 className="text-[1.3rem] font-semibold text-white group-hover:text-red-100 transition-colors [text-shadow:1px_1px_3px_rgba(0,0,0,0.75)] mt-auto pt-2">
                                                {theme.name}
                                            </h3>
                                            <p className="text-[0.95rem] text-gray-100 mt-1 clamp-2-lines opacity-80 group-hover:opacity-100 md:text-[1rem]">
                                                {theme.description}
                                            </p>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </section>
                </main>
            </div>
        </>
    );
};

export default VlogListPage;