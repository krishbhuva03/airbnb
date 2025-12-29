import { Modal } from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";

import { Close } from "@mui/icons-material";
import SignIn from "../componnents/SignIn";
import Signup from "../componnents/Signup";
import { color } from "framer-motion";

const Container = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  background: white;
  flex-direction: column;
  padding: 0;
  gap: 0;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 1000px;
  max-height: 600px;
  border-radius: 20px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  
  @media (max-width: 768px) {
    max-width: 90vw;
    max-height: 550px;
    border-radius: 16px;
  }
  
  @media (max-width: 480px) {
    max-width: 95vw;
    max-height: 520px;
    border-radius: 12px;
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  border-radius: 50%;
  padding: 6px;
  width: 40px;
  height: 40px;
  background: white;
  border: 1px solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  
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
    width: 44px;
    height: 44px;
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
        <CloseButton onClick={() => setOpenAuth(false)}>
          <Close sx={{ color: "#666" }} />
        </CloseButton>

        {login ? (
          <>
            <SignIn setOpenAuth={setOpenAuth} setLogin={setLogin} />
          </>
        ) : (
          <>
            <Signup setOpenAuth={setOpenAuth} setLogin={setLogin} />
          </>
        )}
      </Container>
    </Modal>
  );
};

export default Authentication;
