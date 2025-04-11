import styled, { ThemeProvider } from "styled-components";
import { lightTheme } from "./utils/Themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./componnents/Navbar";
import { useState } from "react";
import Home from "./pages/Home";
import Authentication from "./pages/Authentication";
import { useSelector } from "react-redux";
import PropertyDetails from "./pages/PropertyDetails";
import PropertyListing from "./pages/PropertyListing";
import Bookings from "./pages/Bookings";
import background from "./utils/Images/Background.svg";
import Contact from "./pages/Contact";
import Blogs from "./pages/Blogs";
import { SpeedInsights } from "@vercel/speed-insights"
import { Analytics } from "@vercel/analytics/react"
import BlogDetails from "./pages/BlogDetails";
import Favorites from "./pages/Favorites";

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text_primary};
  overflow-x: hidden;
  overflow-y: auto;
  transition: all 0.2s ease;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.5)),
    url(${({ background }) => background});
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.primary} rgba(255, 255, 255, 0.1);
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.primary};
    border-radius: 4px;
  }
`;

function App() {
  const { currentUser } = useSelector((state)=> state.user)
  const [openAuth, setOpenAuth] = useState(false);
  return (
  <ThemeProvider theme={lightTheme}>
    <BrowserRouter>
      <Container background={background}>
        <Navbar 
        setOpenAuth={setOpenAuth}
        openAuth={openAuth}
        currentUser={currentUser}
        />
        <Analytics/>
        <SpeedInsights/>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="properties" exact element={<PropertyListing />} />
          <Route path="/properties/:id" exact element={<PropertyDetails />} />
          <Route path="/bookings" exact element={<Bookings />} />
          <Route path="/contact" exact element={<Contact />} />
          <Route path="/blogs" exact element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />
          <Route path="/favourite" element={<Favorites />} />
        </Routes>

        {openAuth && (
            <Authentication setOpenAuth={setOpenAuth} openAuth={openAuth} />
        )}

      </Container>
    </BrowserRouter>
  </ThemeProvider>
  )
}

export default App;
