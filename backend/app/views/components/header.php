<header class="mb-5">
        <div class="header-top">
            <div class="container">
                <div class="logo">
                    <a href="public/home"> <!-- Absolute path -->
                        <img src="assets/compiled/svg/logo.svg" alt="Logo"> <!-- Consider absolute path for assets too -->
                    </a>
                </div>
                <div class="header-top-right">

                    <div class="dropdown">
                        <a href="#" id="topbarUserDropdown" class="user-dropdown d-flex align-items-center dropend dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            <div class="avatar avatar-md2">
                                <img src="assets/compiled/jpg/1.jpg" alt="Avatar"> <!-- Consider absolute path for assets too -->
                            </div>
                            <div class="text">
                                <h6 class="user-dropdown-name">John Ducky</h6>
                                <p class="user-dropdown-status text-sm text-muted">Admin</p>
                            </div>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end shadow-lg" aria-labelledby="topbarUserDropdown">
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="#">Logout</a></li> <!-- Assuming logout is handled differently -->
                        </ul>
                    </div>

                    <!-- Burger button responsive -->
                    <a href="#" class="burger-btn d-block d-xl-none">
                        <i class="bi bi-justify fs-3"></i>
                    </a>
                </div>
            </div>
        </div>
        <nav class="main-navbar">
            <div class="container">
                <ul>
                    <li class="menu-item">
                        <a href="users" class="menu-link"> <!-- Absolute path -->
                            <span><i class="bi bi-person-circle"></i> Users</span>
                        </a>
                    </li>
                    <li class="menu-item">
                        <a href="faq" class="menu-link"> <!-- Absolute path -->
                            <span><i class="bi bi-patch-question-fill"></i> FAQ</span>
                        </a>
                    </li>
                    <li class="menu-item  has-sub">
                        <a href="#" class='menu-link'>
                            <span><i class="bi bi-stack"></i> About Us</span>
                        </a>
                        <div class="submenu">
                            <div class="submenu-group-wrapper">
                                <ul class="submenu-group">
                                    <li class="submenu-item  ">
                                        <a href="leadershipteam" class="submenu-link"> <!-- Absolute path -->
                                            <span><i class="bi bi-people-fill"></i> Leadership Team</span>
                                        </a>
                                    </li>
                                    <li class="submenu-item  ">
                                        <a href="airlineexperience" class="submenu-link"> <!-- Absolute path -->
                                            <span><i class="bi bi-activity"></i> Experiences</span>
                                        </a>
                                    </li>
                                    <li class="submenu-item  ">
                                        <a href="achievements" class="submenu-link"> <!-- Absolute path -->
                                            <span><i class="bi bi-trophy-fill"></i> Achievements</span>
                                        </a>
                                    </li>
                                    <li class="submenu-item  ">
                                        <a href="aboutus" class="submenu-link"> <!-- Absolute path -->
                                            <span><i class="bi bi-info-circle-fill"></i> About Us</span>
                                        </a>
                                    </li>
                                    <li class="submenu-item  ">
                                        <a href="corevalue" class="submenu-link"> <!-- Absolute path -->
                                            <span><i class="bi bi-chat-left-heart-fill"></i> Core Value</span>
                                        </a>
                                    </li>
                                    <li class="submenu-item  ">
                                        <a href="airlinefleet" class="submenu-link"> <!-- Absolute path -->
                                            <span><i class="bi bi-airplane-fill"></i> Airline Fleet</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                    <li class="menu-item  has-sub">
                        <a href="#" class='menu-link'>
                            <span><i class="bi bi-house-door-fill"></i> Homepage</span>
                        </a>
                        <div class="submenu">
                            <div class="submenu-group-wrapper">
                                <ul class="submenu-group">
                                    <li class="submenu-item  ">
                                        <a href="topdestination/manage" class="submenu-link"> <!-- Absolute path -->
                                            <span><i class="bi bi-airplane-engines-fill"></i> Top Destinations</span>
                                        </a>
                                    </li>
                                    <li class="submenu-item  ">
                                        <a href="travelpackage/manage" class="submenu-link"> <!-- Absolute path -->
                                            <span><i class="bi bi-suitcase-fill"></i> Travel Packages</span>
                                        </a>
                                    </li>
                                    <li class="submenu-item  ">
                                        <a href="services/manage" class="submenu-link"> <!-- Absolute path -->
                                            <span><i class="bi bi-gear-fill"></i> Services</span>
                                        </a>
                                    </li>
                                    <li class="submenu-item  ">
                                        <a href="Testimonial/manage" class="submenu-link"> <!-- Absolute path -->
                                            <span><i class="bi bi-chat-fill"></i> Testimonials</span>
                                        </a>
                                    </li>
                                    <li class="submenu-item  ">
                                        <a href="imagecarousel/manage" class="submenu-link"> <!-- Absolute path -->
                                            <span><i class="bi bi-camera-fill"></i> Image Carousel</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                    <li class="menu-item">
                        <a href="contactlocation/manage" class="menu-link"> <!-- Absolute path -->
                            <span><i class="bi bi-pin-map-fill"></i> Contact Locations</span>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>