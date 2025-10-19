import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import Button from "./Button";
import UserProfile from "./UserProfile";
import {
  FavoriteBorder,
  MenuRounded,
  SearchRounded,
} from "@mui/icons-material";
import LogoImg from "../utils/Images/Logo.svg";

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
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.1);
  
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
  
  @media (max-width: 768px) {
    height: 36px;
  }
  
  @media (max-width: 480px) {
    height: 32px;
  }
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
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  cursor: pointer;
  transition: all 1s slide-in;
  text-decoration: none;
  &:hover {
    border-bottom: 1.8px solid ${({ theme }) => theme.primary};
  }
  &.active {
    color: ${({ theme }) => theme.white};
    border-bottom: 1.8px solid ${({ theme }) => theme.white};
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
  color: ${({ theme }) => theme.text_primary};
  background: ${({ theme }) => theme.white + 'F2'};
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
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  z-index: 5100;
  backdrop-filter: blur(10px);

  ${Navlink} {
    color: ${({ theme }) => theme.text_primary};
    border-bottom: none;
    padding-bottom: 4px;
  }

  ${Navlink}.active {
    color: ${({ theme }) => theme.primary};
    border-bottom: 2px solid ${({ theme }) => theme.primary};
  }
  
  @media (max-width: 480px) {
    padding: 16px 16px 20px;
    gap: 16px;
    top: 56px;
    max-height: calc(100vh - 56px);
    border-radius: 0 0 16px 16px;
  }
  
  @media (max-width: 320px) {
    padding: 12px 12px 16px;
    gap: 14px;
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

const Navbar = ({setOpenAuth, openAuth, currentUser}) => {
  const [isOpen, setIsOpen] = useState(false);

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
        <Logo src={LogoImg} />
      </NavLogo>

      <Backdrop isOpen={isOpen} onClick={() => setIsOpen(false)} />
      {isOpen && (
        <MobileMenu isOpen={isOpen}>
          <Navlink to="/" onClick={()=> setIsOpen(false)}>Home</Navlink>
          <Navlink to="/properties" onClick={()=> setIsOpen(false)}>Place to stay</Navlink>
          <Navlink to="/contact" onClick={()=> setIsOpen(false)}>Contact</Navlink>
          <Navlink to="/blogs" onClick={()=> setIsOpen(false)}>Blogs</Navlink>
          <div 
          style={{
            flex:1,
            display: "flex",
            gap: "16px",
          }}>
            <Button 
            type="secondary" 
            text="Signup" 
            small
            onClick={() => { setIsOpen(false); setOpenAuth(true); }}
            />
            <Button 
            text="SignIn" 
            small
            onClick={()=> { setIsOpen(false); setOpenAuth(true); }}
            />
          </div>

        </MobileMenu>)}

      <NavItems>
        <Navlink to="/">Home</Navlink>
        <Navlink to="/properties">Place to stay</Navlink>
        <Navlink to="/contact">Contact</Navlink>
        <Navlink to="/blogs">Blogs</Navlink>
      </NavItems>

      

      <ButtonContainer>
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
