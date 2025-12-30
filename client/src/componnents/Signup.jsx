import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { UserSignUp } from "../api";
import { MdEmail, MdLock, MdPerson } from 'react-icons/md';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  min-height: 550px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    min-height: auto;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: white;
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;
  transition: background 0.3s ease;

  @media (prefers-color-scheme: dark) {
    background: #1a1a1a;
  }

  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const RightSection = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80') center/cover;
    z-index: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top, rgba(255, 56, 92, 0.4) 0%, rgba(255, 56, 92, 0.15) 50%, rgba(0,0,0,0.1) 100%);
    z-index: 1;
  }

  @media (max-width: 768px) {
    min-height: 160px;
  }
`;

const RightContent = styled.div`
  position: relative;
  z-index: 2;
  padding: 40px;
  color: white;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const BrandTitle = styled.h2`
  font-family: 'Brush Script MT', cursive, 'Dancing Script', serif;
  font-size: 42px;
  font-weight: 400;
  margin-bottom: 12px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const BrandTagline = styled.p`
  font-size: 14px;
  opacity: 0.95;
  line-height: 1.5;
  max-width: 280px;

  @media (max-width: 768px) {
    font-size: 12px;
    max-width: 100%;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.6s ease-out 0.2s both;
`;

const WelcomeTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #FF385C;
  margin-bottom: 8px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
  text-align: center;

  @media (prefers-color-scheme: dark) {
    color: #aaa;
  }
`;

const InputWrapper = styled.div`
  margin-bottom: 14px;
  position: relative;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 12px;
  color: #FF385C;
  margin-bottom: 4px;
  font-weight: 500;
`;

const InputField = styled.div`
  display: flex;
  align-items: center;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px 14px;
  background: #fafafa;
  transition: all 0.3s ease;

  @media (prefers-color-scheme: dark) {
    background: #2a2a2a;
    border-color: #444;
  }

  &:focus-within {
    border-color: #FF385C;
    background: white;
    box-shadow: 0 0 0 3px rgba(255, 56, 92, 0.1);

    @media (prefers-color-scheme: dark) {
      background: #333;
    }
  }

  svg {
    color: #999;
    font-size: 18px;
    margin-right: 12px;

    @media (prefers-color-scheme: dark) {
      color: #888;
    }
  }
`;

const Input = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #333;
  outline: none;

  @media (prefers-color-scheme: dark) {
    color: #eee;
  }

  &::placeholder {
    color: #aaa;

    @media (prefers-color-scheme: dark) {
      color: #666;
    }
  }
`;

const RegisterButton = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #FF385C 0%, #E31C5F 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 8px;

  &:hover {
    background: linear-gradient(135deg, #E31C5F 0%, #C71850 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 56, 92, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;

    @media (prefers-color-scheme: dark) {
      background: #444;
    }
  }
`;



const LoginText = styled.p`
  text-align: center;
  font-size: 13px;
  color: #666;

  @media (prefers-color-scheme: dark) {
    color: #aaa;
  }

  span {
    color: #FF385C;
    font-weight: 600;
    cursor: pointer;
    margin-left: 4px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Error = styled.div`
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  padding-left: 4px;
`;

const Signup = ({ setOpenAuth, setLogin }) => {
  const [buttonDisable, setButtonDisable] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const handleSignup = async (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setNameError("");

    // Validation
    if (!name) {
      setNameError("Name is required");
      return;
    }
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    try {
      setButtonDisable(true);
      setButtonLoading(true);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Please enter a valid email address");
        setButtonDisable(false);
        setButtonLoading(false);
        return;
      }

      if (password.length < 6) {
        setPasswordError("Password must be at least 6 characters");
        setButtonDisable(false);
        setButtonLoading(false);
        return;
      }

      const response = await UserSignUp({ name, email, password });

      if (response?.status === 201 && response?.data?.token) {
        alert('Account created successfully! Please login.');
        setLogin(true);
      } else {
        alert('Signup failed: Please try again');
      }
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setButtonDisable(false);
      setButtonLoading(false);
    }
  }

  return (
    <Wrapper>
      <LeftSection>
        <FormContainer>
          <WelcomeTitle>Join Us</WelcomeTitle>
          <Subtitle>Create your account</Subtitle>
          
          <form onSubmit={handleSignup}>
            <InputWrapper>
              <InputLabel>Full Name</InputLabel>
              <InputField>
                <MdPerson />
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </InputField>
              {nameError && <Error>{nameError}</Error>}
            </InputWrapper>

            <InputWrapper>
              <InputLabel>Email</InputLabel>
              <InputField>
                <MdEmail />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputField>
              {emailError && <Error>{emailError}</Error>}
            </InputWrapper>

            <InputWrapper>
              <InputLabel>Password</InputLabel>
              <InputField>
                <MdLock />
                <Input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputField>
              {passwordError && <Error>{passwordError}</Error>}
            </InputWrapper>
            
            <RegisterButton type="submit" disabled={buttonDisable}>
              {buttonLoading ? 'Creating account...' : 'REGISTER'}
            </RegisterButton>
          </form>

          <LoginText style={{ marginTop: '24px' }}>
            Already have an account?
            <span onClick={() => setLogin(true)}>Sign In</span>
          </LoginText>
        </FormContainer>
      </LeftSection>
      
      <RightSection>
        <RightContent>
          <BrandTitle>Roamly</BrandTitle>
          <BrandTagline>
            Begin your adventure and explore breathtaking destinations across the globe
          </BrandTagline>
        </RightContent>
      </RightSection>
    </Wrapper>
  )
};

export default Signup;
