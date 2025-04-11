import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import Button from "./Button";
import { UserSignUp } from "../api";
import { FaAirbnb, FaGoogle, FaGithub } from 'react-icons/fa';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageWrapper = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  scroll-behavior: smooth;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
    &:hover {
      background: #555;
    }
  }
`;

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: row-reverse;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FF385C 0%, #E31C5F 100%);
  padding: 40px;
  position: relative;
  min-height: 100vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }

  @media (max-width: 768px) {
    padding: 40px 20px;
    min-height: 300px;
    max-height: none;
  }
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #fff;
  animation: ${slideIn} 0.6s ease-out;
  min-height: 100vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 10px;
    &:hover {
      background: #ccc;
    }
  }

  @media (max-width: 768px) {
    padding: 20px;
    min-height: auto;
    max-height: none;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  color: #000000;
  animation: ${slideIn} 0.6s ease-out;
`;

const WelcomeContainer = styled.div`
  text-align: center;
  color: white;
  animation: ${slideIn} 0.6s ease-out;
  z-index: 1;

  h1 {
    font-size: 48px;
    font-weight: 800;
    margin-bottom: 20px;
  }

  p {
    font-size: 18px;
    opacity: 0.9;
    line-height: 1.6;
    max-width: 500px;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 36px;
    }
    p {
      font-size: 16px;
    }
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;

  svg {
    font-size: 32px;
    color: #FF385C;
  }

  span {
    font-size: 24px;
    font-weight: 800;
    color: #222;
  }
`;

const SocialButtons = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 20px;
`;

const SocialButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  color: #222;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f8f9fa;
    border-color: #ccc;
  }

  svg {
    font-size: 18px;
  }
`;

const Error = styled.div`
  color: #FF385C;
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  color: #333;
  &:focus {
    outline: none;
    border-color: #FF385C;
  }
  &::placeholder {
    color: #999;
  }
`;

const Welcome = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
`;

const Text = styled.p`
  display: flex;
  gap: 12px;
  font-size: 14px;
  text-align: center;
  color: #666;
  margin: 20px 0;
  align-items: center;
  justify-content: center;
`;

const TextButton = styled.span`
  color: #FF385C;
  cursor: pointer;
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
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
    console.log('Signup button clicked');
    e.preventDefault();
    console.log('Form submission prevented');

    setEmailError("");
    setPasswordError("");
    setNameError("");
    console.log('Cleared previous errors');

    console.log('Current values:', { name, email, password });

    // Validation
    if (!name) {
      console.log('Name validation failed');
      setNameError("Name is required");
      return;
    }
    if (!email) {
      console.log('Email validation failed');
      setEmailError("Email is required");
      return;
    }
    if (!password) {
      console.log('Password validation failed');
      setPasswordError("Password is required");
      return;
    }

    try {
      console.log('Setting button states...');
      setButtonDisable(true);
      setButtonLoading(true);
      console.log('Button states set');

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.log('Email format validation failed');
        setEmailError("Please enter a valid email address");
        setButtonDisable(false);
        setButtonLoading(false);
        return;
      }

      if (password.length < 6) {
        console.log('Password length validation failed');
        setPasswordError("Password must be at least 6 characters long");
        setButtonDisable(false);
        setButtonLoading(false);
        return;
      }

      console.log('Calling UserSignUp API...');
      const response = await UserSignUp({ name, email, password });
      console.log('API response:', response);

      if (response?.status === 201 && response?.data?.token) {
        console.log('Signup successful, redirecting to login...');
        alert('Account created successfully! Please login.');
        setLogin(true);
      } else {
        console.log('Error in response');
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
    <PageWrapper>
      <Wrapper>
        <LeftSection>
          <WelcomeContainer>
            <h1>Become a Host</h1>
            <p>Join our community of hosts and share your unique space with travelers from around the world. Start earning and creating unforgettable experiences.</p>
          </WelcomeContainer>
        </LeftSection>
        <RightSection>
          <FormContainer>
            <Logo>
              <FaAirbnb />
              <span>airbnb</span>
            </Logo>
            <div>
              <Welcome>Create Account</Welcome>
              <form onSubmit={handleSignup}>
                <div style={{ marginBottom: "20px" }}>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {nameError && <Error>{nameError}</Error>}
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {emailError && <Error>{emailError}</Error>}
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {passwordError && <Error>{passwordError}</Error>}
                </div>
                <Button 
                  text="Sign Up" 
                  isLoading={buttonLoading}
                  isDisabled={buttonDisable}
                  type="submit"
                  onClick={handleSignup}
                  full
                />
                <Text>
                  Already have an account?{" "}
                  <TextButton onClick={() => setLogin(true)}>Sign In</TextButton>
                </Text>
                <div style={{ textAlign: "center", color: "#666", margin: "10px 0" }}>or continue with</div>
                <SocialButtons>
                  <SocialButton>
                    <FaGoogle /> Google
                  </SocialButton>
                  <SocialButton>
                    <FaGithub /> Github
                  </SocialButton>
                </SocialButtons>
              </form>
            </div>
          </FormContainer>
        </RightSection>
      </Wrapper>
    </PageWrapper>
  )
};

export default Signup;
