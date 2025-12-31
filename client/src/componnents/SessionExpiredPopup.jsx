import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 9999;
  animation: ${fadeIn} 0.3s ease;
`;

const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => theme.card || 'rgba(255, 255, 255, 0.95)'};
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  min-width: 320px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.1);
  z-index: 10000;
  animation: ${slideIn} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: 0 10px 30px rgba(238, 90, 36, 0.3);
`;

const WarningIcon = styled.div`
  font-size: 40px;
  color: white;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary || '#1a1a2e'};
  margin: 0 0 12px 0;
`;

const Message = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.text_secondary || '#666'};
  margin: 0 0 28px 0;
  line-height: 1.6;
`;

const OkButton = styled.button`
  background: linear-gradient(135deg, ${({ theme }) => theme.primary || '#ff385c'} 0%, #e31c5f 100%);
  color: white;
  border: none;
  padding: 14px 48px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 56, 92, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 56, 92, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SessionExpiredPopup = ({ onClose }) => {
  return (
    <>
      <Overlay onClick={onClose} />
      <PopupContainer>
        <IconWrapper>
          <WarningIcon>⚠️</WarningIcon>
        </IconWrapper>
        <Title>Session Expired</Title>
        <Message>
          This session has been expired because you logged in from another device. 
          Please sign in again to continue.
        </Message>
        <OkButton onClick={onClose}>OK</OkButton>
      </PopupContainer>
    </>
  );
};

export default SessionExpiredPopup;
