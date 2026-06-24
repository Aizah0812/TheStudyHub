import { Routes, Route, useLocation } from "react-router-dom";

// Navbar
import Navbar from "./components/Navbar/Navbar";

// Pages
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Services from "./components/Services/Services";
import Admission from "./components/Admission/Admission";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import Login from "./components/Login/Login";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import Dashboard from "./components/Dashboard/Dashboard";
import Notices from "./components/Notice/Notices";

// Gallery
import Gallery from "./components/Gallery/Gallery";

// Privacy & Terms
import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy";
import TermsConditions from "./components/TermsConditions/TermsConditions";

// Protected Routes
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoutes";
import AdminRoute from "./components/ProtectedRoutes/AdminRoute";

// Admin
import AdminLayout from "./components/AdminDashboard/AdminLayout";

// Home Page
const Home = () => {
return (
<> <Hero /> <About /> <Services /> <Gallery /> <Admission /> <Contact /> <Footer />
</>
);
};

function App() {
const location = useLocation();

// Future use
const hideNavbar = false;

return ( <div className="App">
{!hideNavbar && <Navbar />}

  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Home />} />

    <Route path="/about" element={<About />} />

    <Route path="/services" element={<Services />} />

    <Route path="/contact" element={<Contact />} />

    <Route path="/login" element={<Login />} />

    <Route
      path="/reset-password/:token"
      element={<ResetPassword />}
    />

    <Route path="/notices" element={<Notices />} />

    {/* Privacy & Terms */}
    <Route
      path="/privacy-policy"
      element={<PrivacyPolicy />}
    />

    <Route
      path="/terms-and-conditions"
      element={<TermsConditions />}
    />

    {/* Protected Admission */}
    <Route
      path="/admission"
      element={
        <ProtectedRoute>
          <Admission />
        </ProtectedRoute>
      }
    />

    {/* User Dashboard */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />

    {/* Admin Dashboard */}
    <Route
      path="/admin-dashboard"
      element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }
    />
  </Routes>
</div>


);
}

export default App;
