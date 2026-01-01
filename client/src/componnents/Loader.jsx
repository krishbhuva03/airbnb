import React from "react";
import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const dash = keyframes`
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const LoaderOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${({ theme }) => theme.bg};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  transition: opacity 0.4s ease-out, visibility 0.4s ease-out;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const SVGContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SpinnerRing = styled.svg`
  position: absolute;
  width: 120px;
  height: 120px;
  animation: ${rotate} 2s linear infinite;
`;

const SpinnerCircle = styled.circle`
  fill: none;
  stroke: ${({ theme }) => theme.primary};
  stroke-width: 3;
  stroke-linecap: round;
  animation: ${dash} 1.5s ease-in-out infinite;
`;

const LogoText = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  letter-spacing: 3px;
  margin: 0;
  text-transform: lowercase;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.primary} 0%,
    ${({ theme }) => theme.primary}88 50%,
    ${({ theme }) => theme.primary} 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  animation: ${shimmer} 2s linear infinite;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const dotBounce = keyframes`
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.primary};
  animation: ${dotBounce} 1.4s ease-in-out infinite;
  animation-delay: ${({ delay }) => delay || "0s"};
`;

const Loader = ({ isLoading = true }) => {
  return (
    <LoaderOverlay $isVisible={isLoading}>
      <LogoContainer>
        <SVGContainer>
          {/* Animated spinner ring */}
          <SpinnerRing viewBox="0 0 50 50">
            <SpinnerCircle cx="25" cy="25" r="20" />
          </SpinnerRing>
          
          {/* Home Logo SVG */}
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* House roof */}
            <path
              d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--primary, #D3004D)" }}
            />
          </svg>
        </SVGContainer>
        
        <LogoText>roamly</LogoText>
        
        <LoadingDots>
          <Dot delay="0s" />
          <Dot delay="0.2s" />
          <Dot delay="0.4s" />
        </LoadingDots>
      </LogoContainer>
    </LoaderOverlay>
  );
};

export default Loader;
