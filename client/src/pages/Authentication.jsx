import { Modal } from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";

import { Close } from "@mui/icons-material";
import SignIn from "../componnents/SignIn";
import Signup from "../componnents/Signup";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  flex-direction: column;
  padding: 40px;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1000px;
  height: auto;
  max-height: 90vh;
  background: white;
  border-radius: 20px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
  display: flex;
  
  @media (max-width: 768px) {
    max-height: 95vh;
    flex-direction: column;
    border-radius: 16px;
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  border-radius: 50%;
  padding: 6px;
  width: 36px;
  height: 36px;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  
  &:hover {
    background: #f5f5f5;
    transform: scale(1.05);
  }
  
  &:active {
    background: #e0e0e0;
    transform: scale(0.95);
  }
  
  @media (max-width: 768px) {
    top: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
  }
`;

// Decorative circles on the background
const DecorativeCircle = styled.div`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  
  &.circle1 {
    width: 120px;
    height: 120px;
    top: 60px;
    left: 80px;
  }
  
  &.circle2 {
    width: 80px;
    height: 80px;
    bottom: 100px;
    right: 150px;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Authentication = ({ openAuth, setOpenAuth, initialLogin = true }) => {
  const [login, setLogin] = useState(initialLogin);
  
  // Reset to initial state when modal opens
  React.useEffect(() => {
    if (openAuth) {
      setLogin(initialLogin);
    }
  }, [openAuth, initialLogin]);

  return (
    <Modal open={openAuth} onClose={() => setOpenAuth(false)} sx={{ zIndex: 10000 }}>
      <Container>
        <DecorativeCircle className="circle1" />
        <DecorativeCircle className="circle2" />
        <ContentWrapper>
          <CloseButton onClick={() => setOpenAuth(false)}>
            <Close sx={{ color: "#666", fontSize: 20 }} />
          </CloseButton>

          {login ? (
            <SignIn setOpenAuth={setOpenAuth} setLogin={setLogin} />
          ) : (
            <Signup setOpenAuth={setOpenAuth} setLogin={setLogin} />
          )}
        </ContentWrapper>
      </Container>
    </Modal>
  );
};

export default Authentication;
