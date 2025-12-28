import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CircularProgress, Rating } from "@mui/material";
import { useSelector } from "react-redux";
import { getBookedProperty } from "../api";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  padding: 20px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  @media (max-width: 768px) {
    padding: 16px;
    gap: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 8px;
    gap: 14px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 22px;
    margin-bottom: 16px;
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
    margin-bottom: 12px;
  }
`;

const BookingCard = styled.div`
  display: flex;
  gap: 20px;
  padding: 16px;
  background: ${({ theme }) => theme.card};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    gap: 12px;
  }
  
  @media (hover: none) and (pointer: coarse) {
    &:hover {
      transform: none;
    }
    &:active {
      transform: scale(0.98);
    }
  }
`;

const PropertyImage = styled.img`
  width: 200px;
  height: 140px;
  object-fit: cover;
  border-radius: 6px;
  
  @media (max-width: 640px) {
    width: 100%;
    height: 180px;
  }
  
  @media (max-width: 480px) {
    height: 160px;
    border-radius: 8px;
  }
`;

const PropertyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const PropertyTitle = styled.h2`
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
  
  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const DateInfo = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  
  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const NoBookings = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  gap: 16px;
  color: ${({ theme }) => theme.text_secondary};
  text-align: center;
  
  @media (max-width: 480px) {
    padding: 0 16px;
    height: 180px;
    gap: 12px;
    
    h3 {
      font-size: 1.1rem;
    }
    
    p {
      font-size: 0.9rem;
    }
  }
`;

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("roamly-app-token");
        if (!token) {
          navigate("/");
          return;
        }
        const response = await getBookedProperty(token);
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  if (!currentUser) {
    navigate("/");
    return null;
  }

  return (
    <Container>
      <Title>Your Bookings</Title>
      {loading ? (
        <CircularProgress />
      ) : bookings.length === 0 ? (
        <NoBookings>
          <h3>No bookings found</h3>
          <p>You haven't made any bookings yet.</p>
        </NoBookings>
      ) : (
        bookings.map((booking) => (
          <BookingCard
            key={booking._id}
            onClick={() => navigate('/properties/' + booking.propertyId._id)}
          >
            <PropertyImage src={booking.propertyId.img} />
            <PropertyInfo>
              <PropertyTitle>{booking.propertyId.title}</PropertyTitle>
              <Rating value={booking.propertyId.rating} readOnly size="small" />
              <DateInfo>
                From: {new Date(booking.startDate).toLocaleDateString()}
              </DateInfo>
              <DateInfo>
                To: {new Date(booking.endDate).toLocaleDateString()}
              </DateInfo>
            </PropertyInfo>
          </BookingCard>
        ))
      )}
    </Container>
  );
};

export default Bookings;
