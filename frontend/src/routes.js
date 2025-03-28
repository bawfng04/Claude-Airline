import { Route } from "react-router-dom";

//components
import ExampleComponent from "./pages/client/ExampleComponent/ExampleComponent";
import NotFound from "./pages/client/NotFound/NotFound";
import Unauthorized from "./pages/client/Unauthorized/Unauthorized";
import Homepage from "./pages/client/Homepage/Homepage";
import ContactPage from "./pages/client/ContactPage/ContactPage";
import Login from "./pages/client/authentication/Login/Login";
import Register from "./pages/client/authentication/Register/Register";

const routes = (
  <>
    <Route path="/" element={<Homepage />} />
    <Route path="/home" element={<Homepage />} />
    <Route path="/example" element={<ExampleComponent />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/unauthorized" element={<Unauthorized />} />
    <Route path="*" element={<NotFound />} />
  </>
);

export default routes;
