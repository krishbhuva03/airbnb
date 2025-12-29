import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./utils/Themes";
import { ThemeModeProvider, useThemeMode } from "./utils/ThemeContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./componnents/Navbar";
import { Analytics } from "@vercel/analytics/react"
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Authentication from "./pages/Authentication";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./redux/reducers/userSlice";
import PropertyDetails from "./pages/PropertyDetails";
import PropertyListing from "./pages/PropertyListing";
import Bookings from "./pages/Bookings";
import darkBackground from "./utils/Images/DarkBackground.jpg";
import lightBackground from "./utils/Images/LightBackground.jpg";
import Discover from "./pages/Discover";
import Blogs from "./pages/Blogs";
import BlogDetails from "./pages/BlogDetails";
import Favorites from "./pages/Favorites";
import LiveServices from "./pages/LiveServices";
import AdminDashboard from "./pages/AdminDashboard";
import Footer from "./componnents/Footer";
import ScrollToTop from "./componnents/ScrollToTop";

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text_primary};
  overflow-x: hidden;
  overflow-y: auto;
  transition: all 0.3s ease;
  background: ${({ theme, $isDark }) => 
    $isDark 
      ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url(${darkBackground})`
      : `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url(${lightBackground})`
  };
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.primary} ${({ theme, $isDark }) => $isDark ? '#1a1a24' : 'rgba(255, 255, 255, 0.1)'};
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ $isDark }) => $isDark ? '#121218' : 'rgba(255, 255, 255, 0.1)'};
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.primary};
    border-radius: 4px;
  }
`;

const MainContent = styled.main`
  flex: 1;
`;

function AppContent() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { isDarkMode } = useThemeMode();
  const [openAuth, setOpenAuth] = useState(false);
  const [initialLogin, setInitialLogin] = useState(true);
  
  // Listen for session expiry from other devices
  useEffect(() => {
    const handleSessionExpired = () => {
      dispatch(logout());
      // Silently logout and redirect to home - no popup needed
    };
    
    window.addEventListener('session-expired', handleSessionExpired);
    return () => window.removeEventListener('session-expired', handleSessionExpired);
  }, [dispatch]);
  
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <BrowserRouter>
        <Container $isDark={isDarkMode}>
          <Navbar 
            setOpenAuth={setOpenAuth}
            openAuth={openAuth}
            currentUser={currentUser}
            setInitialLogin={setInitialLogin}
          />
          <MainContent>
            <Routes>
              <Route path="/" exact element={<Home />} />
              <Route path="properties" exact element={<PropertyListing />} />
              <Route path="/properties/:id" exact element={<PropertyDetails />} />
              <Route path="/bookings" exact element={<Bookings />} />
              <Route path="/discover" exact element={<Discover />} />
              <Route path="/blogs" exact element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogDetails />} />
              <Route path="/favourite" element={<Favorites />} />
              <Route path="/concierge" element={<LiveServices />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </MainContent>

          {openAuth && (
            <Authentication setOpenAuth={setOpenAuth} openAuth={openAuth} initialLogin={initialLogin} />
          )}

          <Footer />
          <ScrollToTop />
        </Container>
        <Analytics />
      </BrowserRouter>
    </ThemeProvider>
  );
}

function App() {
  return (
    <ThemeModeProvider>
      <AppContent />
    </ThemeModeProvider>
  );
}

export default App;

