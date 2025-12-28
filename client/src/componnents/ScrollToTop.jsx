import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { KeyboardArrowUp } from "@mui/icons-material";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px);
  }
`;

const ScrollButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 4000;
  transition: all 0.3s ease;
  animation: ${({ $visible }) => ($visible ? fadeIn : fadeOut)} 0.3s ease forwards;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(-2px);
  }
  
  svg {
    font-size: 28px;
  }
  
  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    width: 42px;
    height: 42px;
    
    svg {
      font-size: 22px;
    }
  }
  
  @media (max-width: 480px) {
    bottom: 16px;
    right: 16px;
    width: 38px;
    height: 38px;
    
    svg {
      font-size: 20px;
    }
  }
`;

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollY > 300) {
        setVisible(true);
        setShouldRender(true);
      } else {
        setVisible(false);
        // Delay unmounting to allow fade out animation
        setTimeout(() => {
          if (window.pageYOffset <= 300) {
            setShouldRender(false);
          }
        }, 300);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!shouldRender) return null;

  return (
    <ScrollButton 
      onClick={scrollToTop} 
      $visible={visible}
      aria-label="Scroll to top"
    >
      <KeyboardArrowUp />
    </ScrollButton>
  );
};

export default ScrollToTop;
