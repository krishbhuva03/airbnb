import { CircularProgress } from "@mui/material";
import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  border: none;
  outline: none;
  background: none;
  width: ${({ full }) => (full ? '100%' : 'auto')};
  border-radius: 10px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: min-content;
  padding: 16px 26px;
  box-shadow: 1px 20px 35px 0px ${({ theme }) => theme.primary + 40};
  border: 1px solid ${({ theme }) => theme.primary};
  min-height: 44px;
  
  @media (hover: none) and (pointer: coarse) {
    &:active {
      transform: scale(0.98);
    }
    
    &:hover {
      transform: none;
    }
  }
  
  @media (max-width: 768px) {
    padding: 14px 24px;
    font-size: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 8px;
  }

  ${({ type, theme }) =>
    type === "secondary"
      ? `
  background: ${theme.secondary};
border: 1px solid ${theme.secondary};
  box-shadow: 1px 20px 35px 0px ${theme.secondary + 40};
color: ${theme.text_primary};
  `
      : `
  background: ${theme.primary};
`}

  ${({ isDisabled }) =>
    isDisabled &&
    `
  opacity: 0.8;
  cursor: not-allowed;

  `}
  ${({ isLoading }) =>
    isLoading &&
    `
    opacity: 0.8;
  cursor: not-allowed;
`}
${({ flex }) =>
    flex &&
    `
    flex: 1;
`}

${({ small }) =>
    small &&
    `
padding: 10px 28px;

@media (max-width: 480px) {
  padding: 8px 20px;
}
`}
  ${({ outlined, theme }) =>
    outlined &&
    `
background: transparent;
color: #FFFFFF;
border: 1px solid rgba(255,255,255,0.5);
box-shadow: none;

&:hover {
  background: rgba(255,255,255,0.1);
  border-color: #FFFFFF;
}
`}
  ${({ full }) =>
    full &&
    `
  width: 100%;`}
`;

const Button = ({
  text,
  isLoading,
  isDisabled,
  rightIcon,
  leftIcon,
  type,
  onClick,
  flex,
  small,
  outlined,
  full,
}) => {
  const handleClick = (e) => {
    if (isDisabled || isLoading) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <StyledButton
      onClick={handleClick}
      isDisabled={isDisabled}
      type={type}
      isLoading={isLoading}
      flex={flex}
      small={small}
      outlined={outlined}
      full={full}
    >
      {isLoading && (
        <CircularProgress
          style={{ width: "18px", height: "18px", color: "inherit" }}
        />
      )}
      {leftIcon}
      {text}
      {isLoading && <> . . .</>}
      {rightIcon}
    </StyledButton>
  );
};

export default Button;
