import { SearchRounded, LocationOnOutlined, CalendarMonthOutlined } from "@mui/icons-material";
import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  padding: 80px 30px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 40px;
  min-height: calc(100vh - 80px);
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3));

  @media (max-width: 768px) {
    padding: 40px 12px;
  }
`;

const Heading = styled.h1`
  color: white;
  font-size: 3rem;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subheading = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 40px;
  max-width: 600px;
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 30px;
  }
`;

const SearchContainer = styled.div`
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  max-width: 900px;
  width: 100%;
  gap: 10px;
  font-size: 14px;
  padding: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  @media (max-width: 991px) {
    flex-wrap: wrap;
  }
`;

const InputWrapper = styled.div`
  margin-left: 20px;
  border-radius: 33px;
  display: flex;
  flex-direction: column;
  align-items: start;
  @media (max-width: 991px) {
    padding: 0 20px;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.text_primary};

  svg {
    font-size: 20px;
    color: ${({ theme }) => theme.primary};
  }
`;

const Title = styled.div`
  color: #000;
  font-weight: 500;
  width: fit-content;
`;

const Desc = styled.input`
  width: 100%;
  padding: 8px 0;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 400;
  margin-top: 8px;
  font-size: 16px;
  border: none;
  outline: none;
  background: transparent;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }

  &[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
    filter: invert(0.6);
    opacity: 0.6;
    transition: 0.3s;
  }

  &[type="date"]::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
  }

  &::placeholder {
    color: rgba(0, 0, 0, 0.5);
  }
  color: rgba(0, 0, 0, 0.7);
  font-weight: 400;
  margin-top: 14px;
  font-size: 16px;
  border: none;
  outline: none;
`;



const SearchWrapper = styled.div`
  border-radius: 33px;
  display: flex;
  gap: 1px;
`;

const SearchButton = styled.button`
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  font-weight: 400;
  padding: 20px 22px;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const Home = () => {

  const[location, setLocation] = useState("")
  const[CheckInDate, setCheckInDate] = useState("")
  const[CheckOutDate, setCheckOutDate] = useState("")
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate ("/properties", {
      state :{location, CheckInDate, CheckOutDate}
    })
  }
  

  return (
    <Container>
      <div>
        <Heading>Find Your Perfect Stay</Heading>
        <Subheading>
          Discover unique homes and experiences around the world. Book with confidence and travel with ease.
        </Subheading>
      </div>
      <SearchContainer>
        <InputWrapper>
          <IconWrapper>
            <LocationOnOutlined />
            <Title>Location</Title>
          <Desc 
          placeholder="Where are going" 
          type="text" 
          value={location}
          onChange={(e)=> setLocation(e.target.value)}
          />
          </IconWrapper>
        </InputWrapper>

        <InputWrapper>
          <IconWrapper>
            <CalendarMonthOutlined />
            <Title>Check In Date</Title>
          <Desc 
          placeholder="Start date" 
          type="date"
          value={CheckInDate}
          onChange={(e)=> setCheckInDate(e.target.value)}
          />
          </IconWrapper>
        </InputWrapper>

        <InputWrapper>
          <IconWrapper>
            <CalendarMonthOutlined />
            <Title>Check Out Date</Title>
          <Desc 
          placeholder="End date" 
          type="date"
          value={CheckOutDate}
          onChange={(e)=> setCheckOutDate(e.target.value)}
          />
          </IconWrapper>
        </InputWrapper>

        <SearchWrapper>
          <SearchButton onClick={handleSearchClick}>
            <SearchRounded sx={{color:"inherit", fontSize : "30px"}}/>
          </SearchButton>
        </SearchWrapper>

      </SearchContainer>
    </Container>
  );
};

export default Home;
