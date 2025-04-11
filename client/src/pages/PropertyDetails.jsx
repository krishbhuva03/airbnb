import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CircularProgress, Rating, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { getPropertyDetails, bookProperty } from "../api";
import Button from "../componnents/Button";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 50px;
  padding: 20px;
  height: 95vh;
  margin: 0 20px;
  background: ${({ theme }) => theme.bg};
  border-radius: 12px 12px 0 0;
  overflow-y: scroll;
`;

const Image = styled.img`
  width: 50%;
  border-radius: 6px;
  object-fit: cover;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const Desc = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
`;

const Price = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;

const Span = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary};
  text-decoration: line-through;
  margin-left: 8px;
`;

const Percent = styled.span`
  font-size: 16px;
  color: green;
  margin-left: 8px;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BookingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 300px;
  
  .MuiTextField-root {
    width: 100%;
    background: ${({ theme }) => theme.bg};
  }
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
      const token = localStorage.getItem("airbnb-app-token");
      
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

  // Debug logs
  useEffect(() => {
    console.log('Auth state:', {
      currentUser,
      token: localStorage.getItem('airbnb-app-token'),
      datesSelected: { startDate, endDate },
      isDisabled: !currentUser || !startDate || !endDate
    });
  }, [currentUser, startDate, endDate]);


  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <Container>
          <Image src={property?.img} />
          <Right>
            <Title>{property?.title}</Title>
            <Desc>{property?.desc}</Desc>
            <Price>
              ${property?.price.org}
              <Span>${property?.price.mrp}</Span>
              <Percent>{property?.price.off}% OFF</Percent>
            </Price>
            <RatingContainer>
              <Rating value={property?.rating} readOnly />
              <span>({property?.rating})</span>
            </RatingContainer>
            <BookingContainer>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => {
                    console.log('New start date:', newValue);
                    setStartDate(newValue);
                  }}
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      fullWidth: true
                    }
                  }}
                  minDate={new Date()}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => {
                    console.log('New end date:', newValue);
                    setEndDate(newValue);
                  }}
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      fullWidth: true
                    }
                  }}
                  minDate={startDate || new Date()}
                />
              </LocalizationProvider>
              <Button
                text={currentUser ? "Book Now" : "Sign in to Book"}
                onClick={handleBooking}
                isLoading={bookingLoading}
                isDisabled={!startDate || !endDate}
              />
            </BookingContainer>
          </Right>
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
