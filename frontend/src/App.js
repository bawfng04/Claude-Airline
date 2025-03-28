// in frontend/src/App.js
import "./App.css";
import { BrowserRouter, Routes, useLocation } from "react-router-dom";
import routes from "./routes";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function AppContent() {
  const location = useLocation();
  // ẩn header và footer ở các trang login và register
  const hideHeaderFooter = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeaderFooter && <Header />}
      <div className="flex-[1]">
        <Routes>{routes}</Routes>
      </div>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
