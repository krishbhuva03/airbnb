import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import Button from "./Button";
import UserProfile from "./UserProfile";
import {
  FavoriteBorder,
  MenuRounded,
  SearchRounded,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { useThemeMode } from "../utils/ThemeContext";
import LogoImg from "../utils/Images/Logo.png";

const Nav = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 5000;
  color: white;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 480px) {
    padding: 8px;
  }
`;
const NavbarContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 24px;
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  
  @media (max-width: 768px) {
    padding: 0 16px;
    gap: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 0 12px;
    gap: 8px;
  }
`;
const NavLogo = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 6px;
  font-weight: 500;
  font-size: 18px;
  text-decoration: none;
  gap: 12px;
`;
const Logo = styled.img`
  height: 40px;
  display: none;
  
  @media (max-width: 768px) {
    height: 36px;
  }
  
  @media (max-width: 480px) {
    height: 32px;
  }
`;

const LogoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.primary};
  
  svg {
    font-size: 28px;
  }
`;

const LogoText = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: -0.5px;
`;
const NavItems = styled.ul`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 0 6px;
  list-style: none;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;
const Navlink = styled(NavLink)`
  display: flex;
  align-items: center;
  color: #FFFFFF;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  &:hover {
    border-bottom: 1.8px solid ${({ theme }) => theme.primary};
  }
  &.active {
    color: #FFFFFF;
    border-bottom: 1.8px solid #FFFFFF;
  }
`;
const ButtonContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 28px;
  align-items: center;
  padding: 0 6px;
  color: ${({ theme }) => theme.text_primary};
  @media screen and (max-width: 768px) {
    display: none;
  }
`;
const MobileIcon = styled.div`
  color: ${({ theme }) => theme.text_primary};
  display: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  min-height: 44px;
  min-width: 44px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  list-style: none;
  padding: 20px 24px 28px;
  color: #FFFFFF;
  background: #1A1A24;
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  width: 100%;
  max-height: calc(100vh - 60px);
  overflow-y: auto;
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.2s ease;
  transform-origin: top;
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-110%)')};
  border-radius: 0 0 20px 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  z-index: 5100;

  ${Navlink} {
    color: #FFFFFF;
    border-bottom: none;
    padding-bottom: 4px;
    font-size: 1.1rem;
    padding: 8px 0;
    width: 100%;
  }

  ${Navlink}.active {
    color: ${({ theme }) => theme.primary};
    border-bottom: 2px solid ${({ theme }) => theme.primary};
  }
  
  @media (max-width: 480px) {
    padding: 16px 16px 24px;
    gap: 12px;
    top: 56px;
    max-height: calc(100vh - 56px);
    border-radius: 0 0 16px 16px;
  }
  
  @media (max-width: 320px) {
    padding: 12px 12px 20px;
    gap: 10px;
    border-radius: 0 0 12px 12px;
  }
`;

const Mobileicons = styled.div`
  color: ${({ theme }) => theme.text_primary};
  display: none;
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 5050;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};
  transition: opacity 0.2s ease;
`;

const ThemeToggle = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: white;
  min-width: 40px;
  min-height: 40px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
  
  svg {
    font-size: 22px;
  }
`;

const MobileThemeToggle = styled(ThemeToggle)`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const Navbar = ({setOpenAuth, openAuth, currentUser}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useThemeMode();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return ( 
  <Nav>
    <NavbarContainer>
      <MobileIcon onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu" role="button">
        <MenuRounded style={{color : "white"}}/>
      </MobileIcon>
      <NavLogo>
        <LogoIcon>
          <img src={LogoImg} alt="Logo" style={{ height: "30px" }} />
        </LogoIcon>
        <LogoText>Roamly</LogoText>
      </NavLogo>
      
      <MobileThemeToggle onClick={toggleTheme} aria-label="Toggle dark mode">
        {isDarkMode ? <LightMode /> : <DarkMode />}
      </MobileThemeToggle>

      <Backdrop isOpen={isOpen} onClick={() => setIsOpen(false)} />
      {isOpen && (
        <MobileMenu isOpen={isOpen}>
          <Navlink to="/" onClick={()=> setIsOpen(false)}>Home</Navlink>
          <Navlink to="/properties" onClick={()=> setIsOpen(false)}>Properties</Navlink>
          <Navlink to="/discover" onClick={()=> setIsOpen(false)}>Discover</Navlink>
          <Navlink to="/blogs" onClick={()=> setIsOpen(false)}>Blogs</Navlink>
          <Navlink to="/concierge" onClick={()=> setIsOpen(false)}>Concierge</Navlink>
          <div 
          style={{
            width: "100%",
            display: "flex",
            gap: "12px",
            marginTop: "8px",
            paddingTop: "16px",
            borderTop: "1px solid rgba(255,255,255,0.15)",
          }}>
            <Button 
            outlined
            text="Sign Up" 
            small
            flex
            onClick={() => { setIsOpen(false); setOpenAuth(true); }}
            />
            <Button 
            text="Sign In" 
            small
            flex
            onClick={()=> { setIsOpen(false); setOpenAuth(true); }}
            />
          </div>

        </MobileMenu>)}

      <NavItems>
        <Navlink to="/">Home</Navlink>
        <Navlink to="/properties">Properties</Navlink>
        <Navlink to="/discover">Discover</Navlink>
        <Navlink to="/blogs">Blogs</Navlink>
        <Navlink to="/concierge">Concierge</Navlink>
      </NavItems>

      

      <ButtonContainer>
        <ThemeToggle onClick={toggleTheme} aria-label="Toggle dark mode">
          {isDarkMode ? <LightMode /> : <DarkMode />}
        </ThemeToggle>
        {currentUser ? (
        <>
          <Navlink to="/favourite">
            <FavoriteBorder sx={{ color: "inherit", fontSize: "28px"}} />
          </Navlink>
          <UserProfile />
        </>
        ) : (
          <Button
          type="secondary"
          text="SignIn"
          small
          onClick={() => setOpenAuth(!openAuth)}
          />
        )}
      </ButtonContainer>
    </NavbarContainer>
  </Nav> )
};

export default Navbar;
