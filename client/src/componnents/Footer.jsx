import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";
import LogoImg from "../utils/Images/Logo.png";

const FooterContainer = styled.footer`
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: ${({ theme }) => theme.menu_primary_text};
  padding: 24px;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    flex-direction: row;
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
  font-size: 22px;
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: -0.5px;
`;

const QuickLinks = styled.div`
  display: flex;
  gap: 24px;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
  }
`;

const FooterLink = styled(NavLink)`
  font-size: 14px;
  color: ${({ theme }) => theme.menu_secondary_text};
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 12px;
`;

const SocialIcon = styled.a`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.menu_primary_text};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.primary};
    transform: translateY(-2px);
  }
  
  svg {
    font-size: 16px;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <LogoSection>
          <LogoIcon>
            <img src={LogoImg} alt="Logo" style={{ height: "30px" }} />
          </LogoIcon>
          <LogoText>Roamly</LogoText>
        </LogoSection>

        <QuickLinks>
          <FooterLink to="/">Home</FooterLink>
          <FooterLink to="/properties">Properties</FooterLink>
          <FooterLink to="/discover">Discover</FooterLink>
          <FooterLink to="/blogs">Blogs</FooterLink>
        </QuickLinks>

        <RightSection>
          <SocialLinks>
            <SocialIcon href="#" aria-label="Facebook">
              <Facebook />
            </SocialIcon>
            <SocialIcon href="#" aria-label="Twitter">
              <Twitter />
            </SocialIcon>
            <SocialIcon href="#" aria-label="Instagram">
              <Instagram />
            </SocialIcon>
            <SocialIcon href="#" aria-label="LinkedIn">
              <LinkedIn />
            </SocialIcon>
          </SocialLinks>
        </RightSection>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
