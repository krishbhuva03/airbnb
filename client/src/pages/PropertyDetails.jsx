import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CircularProgress, Rating, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { getPropertyDetails, bookProperty } from "../api";
import Button from "../componnents/Button";
import ReviewSection from "../componnents/ReviewSection";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 80px);
  background: ${({ theme }) => theme.bg};
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const HeroImageContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  height: 50vh;
  min-height: 350px;
  max-height: 500px;
  position: relative;
  overflow: hidden;
  border-radius: 0 0 20px 20px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(to top, ${({ theme }) => theme.bg} 0%, transparent 100%);
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    height: 40vh;
    min-height: 280px;
    border-radius: 0;
    max-width: 100%;
  }
  
  @media (max-width: 480px) {
    height: 35vh;
    min-height: 220px;
  }
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
`;

const ContentSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border || 'rgba(0,0,0,0.1)'};
  
  @media (max-width: 768px) {
    padding: 20px 0;
    gap: 12px;
  }
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  line-height: 1.3;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 26px;
  }
  
  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  span {
    color: ${({ theme }) => theme.text_secondary || '#666'};
    font-size: 14px;
  }
`;

const Desc = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary || theme.text_primary};
  line-height: 1.7;
  margin: 0;
  
  @media (max-width: 480px) {
    font-size: 15px;
    line-height: 1.6;
  }
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const Price = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  
  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const OriginalPrice = styled.span`
  font-size: 18px;
  color: ${({ theme }) => theme.text_secondary || '#999'};
  text-decoration: line-through;
`;

const Discount = styled.span`
  font-size: 14px;
  color: white;
  background: #22c55e;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
`;

const BottomSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  padding: 32px 0;
  align-items: start;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const BookingCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.card || theme.bg};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.border || 'rgba(0,0,0,0.1)'};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  justify-content: space-between;
  
  .MuiTextField-root {
    width: 100%;
  }
  
  .MuiInputLabel-root {
    color: ${({ theme }) => theme.text_secondary || '#666'};
  }
  
  .MuiOutlinedInput-root {
    color: ${({ theme }) => theme.text_primary};
    
    .MuiOutlinedInput-notchedOutline {
      border-color: ${({ theme }) => theme.text_secondary || 'rgba(255,255,255,0.3)'};
    }
    
    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: ${({ theme }) => theme.text_primary || '#fff'};
    }
    
    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: ${({ theme }) => theme.primary || '#FF385C'};
    }
  }
  
  .MuiSvgIcon-root {
    color: ${({ theme }) => theme.text_secondary || '#666'};
  }
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const BookingTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
`;

const DateRow = styled.div`
  display: flex;
  gap: 12px;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const ReviewWrapper = styled.div`
  flex: 1;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
`;

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState({ title: '', content: '' });

  const getpropertyDetailsByID = async () => {
    try {
      setLoading(true);
      const res = await getPropertyDetails(id);
      setProperty(res.data);
    } catch (error) {
      console.error("Error fetching property details:", error);
    } finally {
      setLoading(false);
    }
  };  

  const handleBooking = async () => {
    try {
      setBookingLoading(true);
      const token = localStorage.getItem("roamly-app-token");
      
      if (!token) {
        setDialogMessage({
          title: 'Authentication Required',
          content: 'Please log in to book a property'
        });
        setOpenDialog(true);
        return;
      }

      if (!startDate || !endDate) {
        setDialogMessage({
          title: 'Date Selection Required',
          content: 'Please select both start and end dates'
        });
        setOpenDialog(true);
        return;
      }

      const bookingData = {
        propertyId: id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };

      const response = await bookProperty(token, bookingData);
      setDialogMessage({
        title: 'Booking Successful',
        content: 'Your property has been booked successfully!'
      });
      setOpenDialog(true);
    } catch (err) {
      console.error('Booking error:', err);
      setDialogMessage({
        title: 'Booking Failed',
        content: err.response?.data?.message || 'Failed to book property. Please try again.'
      });
      setOpenDialog(true);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    if (dialogMessage.title === 'Booking Successful') {
      navigate('/bookings');
    }
  };

  useEffect(() => {
    getpropertyDetailsByID();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      ) : (
        <Container>
          <HeroImageContainer>
            <HeroImage src={property?.img} alt={property?.title} />
          </HeroImageContainer>
          
          <ContentSection>
            <InfoSection>
              <Title>{property?.title}</Title>
              
              <RatingRow>
                <Rating value={property?.rating} readOnly size="small" />
                <span>({property?.rating} rating)</span>
              </RatingRow>
              
              <Desc>{property?.desc}</Desc>
              
              <PriceRow>
                <Price>${property?.price?.org}</Price>
                <OriginalPrice>${property?.price?.mrp}</OriginalPrice>
                <Discount>{property?.price?.off}% OFF</Discount>
              </PriceRow>
            </InfoSection>
            
            <BottomSection>
              <BookingCard>
                <BookingTitle>Book this property</BookingTitle>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateRow>
                    <DatePicker
                      label="Check-in"
                      value={startDate}
                      onChange={(newValue) => setStartDate(newValue)}
                      slotProps={{
                        textField: {
                          variant: "outlined",
                          fullWidth: true,
                          size: "small"
                        }
                      }}
                      minDate={new Date()}
                    />
                    <DatePicker
                      label="Check-out"
                      value={endDate}
                      onChange={(newValue) => setEndDate(newValue)}
                      slotProps={{
                        textField: {
                          variant: "outlined",
                          fullWidth: true,
                          size: "small"
                        }
                      }}
                      minDate={startDate || new Date()}
                    />
                  </DateRow>
                </LocalizationProvider>
                <Button
                  text={currentUser ? "Book Now" : "Sign in to Book"}
                  onClick={handleBooking}
                  isLoading={bookingLoading}
                  isDisabled={!startDate || !endDate}
                  full
                />
              </BookingCard>
              
              <ReviewWrapper>
                <ReviewSection propertyId={id} />
              </ReviewWrapper>
            </BottomSection>
          </ContentSection>
        </Container>
      )}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{dialogMessage.title}</DialogTitle>
        <DialogContent>
          <p>{dialogMessage.content}</p>
        </DialogContent>
        <DialogActions>
          <Button text="OK" onClick={handleCloseDialog} />
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PropertyDetails;
