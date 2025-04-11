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
`;

const Title = styled.h1`
  font-size: 24px;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 20px;
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
`;

const PropertyImage = styled.img`
  width: 200px;
  height: 140px;
  object-fit: cover;
  border-radius: 6px;
`;

const PropertyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PropertyTitle = styled.h2`
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
`;

const DateInfo = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const NoBookings = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  gap: 16px;
  color: ${({ theme }) => theme.text_secondary};
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
        const token = localStorage.getItem("airbnb-app-token");
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
