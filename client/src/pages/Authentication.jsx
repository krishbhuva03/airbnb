import { Modal } from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";

import { Close } from "@mui/icons-material";
import SignIn from "../componnents/SignIn";
import Signup from "../componnents/Signup";
import { color } from "framer-motion";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  background: white;
  flex-direction: column;
  padding: 40px;
  gap: 16px;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 1200px;
  max-height: 90vh;
  border-radius: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  
  @media (max-width: 768px) {
    max-width: 90vw;
    max-height: 85vh;
    padding: 32px 24px;
    border-radius: 16px;
  }
  
  @media (max-width: 480px) {
    max-width: 95vw;
    max-height: 90vh;
    padding: 24px 16px;
    border-radius: 12px;
    gap: 12px;
  }
  
  @media (max-height: 600px) and (orientation: landscape) {
    max-height: 95vh;
    padding: 16px;
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  border-radius: 50%;
  padding: 2px;
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
  min-width: 44px;
  
  &:hover {
    background: #f5f5f5;
  }
  
  @media (hover: none) and (pointer: coarse) {
    &:active {
      background: #e0e0e0;
    }
    
    &:hover {
      background: transparent;
    }
  }
  
  @media (max-width: 480px) {
    top: 16px;
    right: 16px;
    width: 36px;
    height: 36px;
  }
`;




const Authentication = ({ openAuth, setOpenAuth }) => {
  const [login, setLogin] = useState(true);
  console.log("setOpenAuth:", setOpenAuth);
  console.log("setLogin:", setLogin);

  return (
    <Modal open={openAuth} onClose={() => setOpenAuth(false)}>
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
