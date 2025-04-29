import { Route } from "react-router-dom";

//components
// import ExampleComponent from "./pages/client/ExampleComponent/ExampleComponent";
import NotFound from "./pages/client/NotFound/NotFound";
import Unauthorized from "./pages/client/Unauthorized/Unauthorized";
import Homepage from "./pages/client/Homepage/Homepage";
import ContactPage from "./pages/client/ContactPage/ContactPage";
import Login from "./pages/client/authentication/Login/Login";
import Register from "./pages/client/authentication/Register/Register";
import FAQPage from "./pages/client/FAQ/FAQPage";
import AboutUs from "./pages/client/AboutUs/AboutUs";
import Planes from "./pages/client/allPlanes/planes";
import UserDetail from "./pages/client/UserDetail/UserDetail";

// admin
import Admin from "./pages/admin/Admin";
import ManageTopDestination from "./pages/admin/ManageTopDestination";
import ManageContactLocation from "./pages/admin/ManageContactLocation";
import ManageTravelPackage from "./pages/admin/ManageTravelPackage";
import ManageServices from "./pages/admin/ManageServices";
import ManageTestimonials from "./pages/admin/ManageTestimonials";
import ManageImageCarousel from "./pages/admin/ManageImageCarousel";
import EditProfile from "./pages/client/UserDetail/EditProfile";

const routes = (
  <>
    <Route path="/" element={<Homepage />} />
    <Route path="/home" element={<Homepage />} />
    {/* <Route path="/example" element={<ExampleComponent />} /> */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/unauthorized" element={<Unauthorized />} />
    <Route path="/faq" element={<FAQPage />} />
    <Route path="/about" element={<AboutUs />} />
    <Route path="/our-fleet" element={<Planes />} />
    <Route path="/user-detail" element={<UserDetail />} />
    <Route path="/profile/edit" element={<EditProfile />} />
    {/* admin */}
    <Route path="/admin" element={<Admin />} />
    <Route path="/manage-top-destination" element={<ManageTopDestination />} />
    <Route
      path="/manage-contact-location"
      element={<ManageContactLocation />}
    />
    <Route
      path="/manage-travel-package"
      element={<ManageTravelPackage />}
    />
    <Route
      path="/manage-testimonials"
    element={<ManageTestimonials/>}
    />
    <Route
      path="/manage-image-carousel"
      element={<ManageImageCarousel />}
    />
    <Route path="/manage-services" element={<ManageServices />} />
    <Route path="*" element={<NotFound />} />
  </>
);

export default routes;
