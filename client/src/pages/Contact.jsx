import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  color: white;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 8px;
  }
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    padding: 24px 20px;
    gap: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 20px 16px;
    gap: 14px;
    border-radius: 8px;
  }
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
  
  @media (max-width: 480px) {
    padding: 14px 12px;
    font-size: 16px; /* Prevents iOS zoom */
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
  min-height: 150px;
  resize: vertical;
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
  
  @media (max-width: 480px) {
    min-height: 120px;
    padding: 14px 12px;
    font-size: 16px; /* Prevents iOS zoom */
  }
`;

const SuccessMessage = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 24px;
  background: rgba(46, 213, 115, 0.9);
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateX(${({ show }) => (show ? '0' : '120%')});
  transition: transform 0.3s ease-in-out;
  backdrop-filter: blur(10px);
  z-index: 1000;
  
  @media (max-width: 480px) {
    left: 12px;
    right: 12px;
    top: 12px;
    padding: 14px 16px;
    font-size: 14px;
    text-align: center;
  }
`;

const ErrorMessage = styled(SuccessMessage)`
  background: rgba(255, 71, 87, 0.9);
`;

const Button = styled.button`
  padding: 12px;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
  &:hover {
    background: ${({ theme }) => theme.primary_dark};
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  @media (max-width: 480px) {
    padding: 14px;
    font-size: 15px;
  }
  
  @media (hover: none) and (pointer: coarse) {
    &:active {
      transform: scale(0.98);
    }
    &:hover {
      background: ${({ theme }) => theme.primary};
    }
  }
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Sending data:', formData);
      const response = await axios.post('http://localhost:8080/api/contact/submit', formData);
      console.log('Response:', response.data);
      
      if (response.data.success) {
        setShowSuccess(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });

        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to send message. Please try again.');
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Title>Contact Us</Title>
      <ContactForm onSubmit={handleSubmit}>
        <Input 
          type="text" 
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name" 
          required 
        />
        <Input 
          type="email" 
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email" 
          required 
        />
        <Input 
          type="text" 
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Subject" 
          required 
        />
        <TextArea 
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Message" 
          required 
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </ContactForm>
      <SuccessMessage show={showSuccess}>
        Message sent successfully! 
      </SuccessMessage>
      <ErrorMessage show={showError}>
        {errorMessage}
      </ErrorMessage>
    </Container>
  );
};

export default Contact;
