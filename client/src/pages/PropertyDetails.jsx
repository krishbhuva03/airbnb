import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CircularProgress, Rating, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import styled, { keyframes } from "styled-components";
import { useSelector } from "react-redux";
import { getPropertyDetails, bookProperty } from "../api";
import Button from "../componnents/Button";
import ReviewSection from "../componnents/ReviewSection";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 80px);
  background: ${({ theme }) => `
    linear-gradient(135deg, ${theme.bg} 0%, ${theme.bg} 100%),
    radial-gradient(ellipse at 0% 0%, ${theme.primary || '#FF385C'}08 0%, transparent 50%),
    radial-gradient(ellipse at 100% 0%, ${theme.primary || '#FF385C'}05 0%, transparent 40%),
    radial-gradient(ellipse at 50% 100%, ${theme.primary || '#FF385C'}06 0%, transparent 50%)
  `};
  background-blend-mode: normal;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, ${({ theme }) => theme.primary || '#FF385C'}06 0%, transparent 25%),
      radial-gradient(circle at 80% 80%, ${({ theme }) => theme.primary || '#FF385C'}04 0%, transparent 25%);
    pointer-events: none;
    z-index: 0;
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
`;

// Image Gallery Grid (Airbnb-style)
const ImageGallery = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
  height: 60vh;
  min-height: 400px;
  max-height: 550px;
  border-radius: 16px;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    height: 45vh;
    min-height: 300px;
    padding: 0;
    border-radius: 0;
  }
`;

const MainImage = styled.div`
  grid-row: 1 / 3;
  position: relative;
  overflow: hidden;
  border-radius: 16px 0 0 16px;
  cursor: pointer;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
  
  &:hover img {
    transform: scale(1.03);
  }
  
  @media (max-width: 900px) {
    border-radius: 0;
    grid-row: 1;
  }
`;

const SubImage = styled.div`
  position: relative;
  overflow: hidden;
  cursor: pointer;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
  
  &:nth-child(3) {
    border-radius: 0 16px 0 0;
  }
  
  &:nth-child(5) {
    border-radius: 0 0 16px 0;
  }
  
  @media (max-width: 900px) {
    display: none;
  }
`;

const ShowAllPhotosBtn = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: white;
  color: #222;
  border: 1px solid #222;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  z-index: 10;
  
  &:hover {
    background: #f7f7f7;
    transform: scale(1.02);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

// Main Content Layout
const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 48px;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 0 16px 100px;
  }
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 48px;
  position: relative;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.5s ease-out 0.2s both;
`;

const RightColumn = styled.div`
  @media (max-width: 900px) {
    order: -1;
  }
`;

// Sticky Booking Card
const StickyBookingWrapper = styled.div`
  position: sticky;
  top: 100px;
  animation: ${fadeIn} 0.5s ease-out 0.3s both;
  
  @media (max-width: 900px) {
    position: relative;
    top: 0;
  }
`;

const BookingCard = styled.div`
  background: ${({ theme }) => theme.card || theme.bg};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.border || 'rgba(0,0,0,0.08)'};
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  .MuiTextField-root {
    width: 100%;
  }
  
  .MuiInputLabel-root {
    color: ${({ theme }) => theme.text_secondary || '#666'};
  }
  
  .MuiOutlinedInput-root {
    color: ${({ theme }) => theme.text_primary};
    background: ${({ theme }) => theme.bg};
    
    .MuiOutlinedInput-notchedOutline {
      border-color: ${({ theme }) => theme.border || 'rgba(0,0,0,0.2)'};
    }
    
    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: ${({ theme }) => theme.text_primary || '#222'};
    }
    
    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: ${({ theme }) => theme.primary || '#FF385C'};
      border-width: 2px;
    }
  }
  
  .MuiSvgIcon-root {
    color: ${({ theme }) => theme.text_secondary || '#666'};
  }
`;

const BookingHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
`;

const BookingPrice = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  
  span {
    font-size: 16px;
    font-weight: 400;
    color: ${({ theme }) => theme.text_secondary || '#666'};
  }
`;

const BookingRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
  
  svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
  }
`;

const DateInputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid ${({ theme }) => theme.border || 'rgba(0,0,0,0.2)'};
  border-radius: 12px;
  overflow: hidden;
  
  > div {
    border: none !important;
    
    .MuiOutlinedInput-notchedOutline {
      border: none !important;
    }
    
    &:first-child {
      border-right: 1px solid ${({ theme }) => theme.border || 'rgba(0,0,0,0.2)'} !important;
    }
  }
`;

const PriceBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.border || 'rgba(0,0,0,0.1)'};
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  color: ${({ theme }) => theme.text_primary};
  
  &.total {
    font-weight: 600;
    font-size: 17px;
    padding-top: 12px;
    border-top: 1px solid ${({ theme }) => theme.border || 'rgba(0,0,0,0.1)'};
  }
`;

// Header Section
const HeaderSection = styled.div`
  padding: 24px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border || 'rgba(0,0,0,0.08)'};
`;

const PropertyTypeBadge = styled.span`
  display: inline-block;
  background: ${({ theme }) => theme.primary || '#FF385C'}15;
  color: ${({ theme }) => theme.primary || '#FF385C'};
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  line-height: 1.2;
  margin: 0 0 12px 0;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const SubtitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary || '#666'};
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const RatingBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  
  svg {
    color: ${({ theme }) => theme.primary || '#FF385C'};
    fill: ${({ theme }) => theme.primary || '#FF385C'};
  }
`;

const Divider = styled.span`
  color: ${({ theme }) => theme.text_secondary || '#999'};
`;

const LocationText = styled.span`
  text-decoration: underline;
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.text_primary};
  }
`;

// Property Stats
const PropertyStats = styled.div`
  display: flex;
  gap: 20px;
  padding: 24px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border || 'rgba(0,0,0,0.08)'};
  flex-wrap: wrap;
`;

const StatBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: ${({ theme }) => theme.card || 'rgba(0,0,0,0.02)'};
  border-radius: 12px;
  font-size: 15px;
  color: ${({ theme }) => theme.text_primary};
  
  svg {
    width: 22px;
    height: 22px;
    color: ${({ theme }) => theme.primary || '#FF385C'};
  }
`;

// Generic Section
const Section = styled.div`
  padding: 28px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border || 'rgba(0,0,0,0.08)'};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin: 0 0 20px 0;
`;

const Description = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
  line-height: 1.7;
  margin: 0;
`;

// Amenities
const AmenitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const AmenityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  font-size: 15px;
  color: ${({ theme }) => theme.text_primary};
  
  .icon-wrapper {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.primary || '#FF385C'}15;
    border-radius: 8px;
    
    svg {
      width: 18px;
      height: 18px;
      color: ${({ theme }) => theme.primary || '#FF385C'};
    }
  }
`;

// Host Section
const HostCard = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.card || 'rgba(0,0,0,0.02)'};
  border-radius: 16px;
`;

const HostAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.primary || '#FF385C'}, #ff6b8a);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  font-weight: 600;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const HostInfo = styled.div`
  flex: 1;
  
  h4 {
    font-size: 17px;
    font-weight: 600;
    color: ${({ theme }) => theme.text_primary};
    margin: 0 0 4px 0;
  }
  
  p {
    font-size: 14px;
    color: ${({ theme }) => theme.text_secondary || '#666'};
    margin: 0;
  }
`;

const SuperhostBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #ff385c, #ff6b8a);
  color: white;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  margin-top: 6px;
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

// House Rules
const RulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const RuleCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${({ theme }) => theme.card || 'rgba(0,0,0,0.02)'};
  border-radius: 12px;
  
  .icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.primary || '#FF385C'}15;
    border-radius: 10px;
    flex-shrink: 0;
    
    svg {
      width: 20px;
      height: 20px;
      color: ${({ theme }) => theme.primary || '#FF385C'};
    }
  }
  
  .content {
    span:first-child {
      display: block;
      font-size: 12px;
      color: ${({ theme }) => theme.text_secondary || '#666'};
      margin-bottom: 2px;
    }
    
    span:last-child {
      font-size: 15px;
      font-weight: 600;
      color: ${({ theme }) => theme.text_primary};
    }
  }
`;

const RuleItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  font-size: 15px;
  color: ${({ theme }) => theme.text_primary};
  
  svg {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.text_secondary || '#666'};
  }
`;

// Location Section
const LocationCard = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.card || 'rgba(0,0,0,0.02)'};
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  
  svg {
    width: 24px;
    height: 24px;
    color: ${({ theme }) => theme.primary || '#FF385C'};
    flex-shrink: 0;
  }
  
  p {
    margin: 0;
    font-size: 15px;
    color: ${({ theme }) => theme.text_primary};
    line-height: 1.5;
  }
`;

// Loading State
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

  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const pricePerNight = property?.price?.org || 0;
    const subtotal = nights * pricePerNight;
    const serviceFee = Math.round(subtotal * 0.12);
    return { nights, subtotal, serviceFee, total: subtotal + serviceFee };
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

  const getLocationString = () => {
    if (!property?.location) return '';
    if (typeof property.location === 'string') return property.location;
    return [property.location.city, property.location.state, property.location.country]
      .filter(Boolean)
      .join(', ');
  };

  const pricing = calculateTotal();

  // Generate placeholder images for gallery if only one image exists
  const galleryImages = property?.images?.length > 0 
    ? property.images 
    : property?.img 
      ? [property.img, property.img, property.img, property.img, property.img]
      : [];

  return (
    <>
      {loading ? (
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      ) : (
        <Container>
          {/* Image Gallery */}
          <ImageGallery>
            <MainImage>
              <img src={property?.img || galleryImages[0]} alt={property?.title} />
              <ShowAllPhotosBtn>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                Show all photos
              </ShowAllPhotosBtn>
            </MainImage>
            {galleryImages.slice(1, 5).map((img, index) => (
              <SubImage key={index}>
                <img src={img} alt={`${property?.title} ${index + 2}`} />
              </SubImage>
            ))}
          </ImageGallery>
          
          <ContentWrapper>
            <TwoColumnLayout>
              {/* Left Column - Property Details */}
              <LeftColumn>
                <HeaderSection>
                  {property?.propertyType && (
                    <PropertyTypeBadge>{property.propertyType}</PropertyTypeBadge>
                  )}
                  <Title>{property?.title}</Title>
                  <SubtitleRow>
                    <RatingBadge>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                      {property?.rating || '4.8'}
                    </RatingBadge>
                    <Divider>·</Divider>
                    <LocationText>{getLocationString()}</LocationText>
                  </SubtitleRow>
                </HeaderSection>

                <PropertyStats>
                  <StatBadge>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                    {property?.maxGuests || 2} guests
                  </StatBadge>
                  <StatBadge>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    {property?.bedrooms || 1} bedrooms
                  </StatBadge>
                  <StatBadge>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                    </svg>
                    {property?.bathrooms || 1} bathrooms
                  </StatBadge>
                </PropertyStats>

                {/* Description */}
                <Section>
                  <Description>{property?.desc}</Description>
                </Section>

                {/* Amenities */}
                {property?.amenities && property.amenities.length > 0 && (
                  <Section>
                    <SectionTitle>What this place offers</SectionTitle>
                    <AmenitiesGrid>
                      {property.amenities.slice(0, 8).map((amenity, index) => (
                        <AmenityItem key={index}>
                          <div className="icon-wrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          {amenity.name || amenity}
                        </AmenityItem>
                      ))}
                    </AmenitiesGrid>
                  </Section>
                )}


                {/* Location */}
                {property?.location && (
                  <Section>
                    <SectionTitle>Where you'll be</SectionTitle>
                    <LocationCard>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <p>
                        {typeof property.location === 'string' 
                          ? property.location 
                          : (
                            <>
                              {property.location.address && <>{property.location.address}<br /></>}
                              {[property.location.city, property.location.state, property.location.country]
                                .filter(Boolean)
                                .join(', ')}
                            </>
                          )
                        }
                      </p>
                    </LocationCard>
                  </Section>
                )}

                {/* House Rules */}
                {((property?.houseRules && property.houseRules.length > 0) || property?.checkInTime || property?.checkOutTime) && (
                  <Section>
                    <SectionTitle>House rules</SectionTitle>
                    <RulesGrid>
                      <RuleCard>
                        <div className="icon">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                          </svg>
                        </div>
                        <div className="content">
                          <span>Check-in</span>
                          <span>{property?.checkInTime || "3:00 PM"}</span>
                        </div>
                      </RuleCard>
                      <RuleCard>
                        <div className="icon">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                          </svg>
                        </div>
                        <div className="content">
                          <span>Check-out</span>
                          <span>{property?.checkOutTime || "11:00 AM"}</span>
                        </div>
                      </RuleCard>
                    </RulesGrid>
                    {property?.houseRules && property.houseRules.length > 0 && (
                      <div style={{ marginTop: '16px' }}>
                        {property.houseRules.map((rule, index) => (
                          <RuleItem key={index}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                            {rule}
                          </RuleItem>
                        ))}
                      </div>
                    )}
                  </Section>
                )}

                {/* Reviews */}
                <Section>
                  <ReviewSection propertyId={id} />
                </Section>
              </LeftColumn>

              {/* Right Column - Sticky Booking */}
              <RightColumn>
                <StickyBookingWrapper>
                  <BookingCard>
                    <BookingHeader>
                      <BookingPrice>
                        ${property?.price?.org} <span>/ night</span>
                      </BookingPrice>
                      <BookingRating>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" />
                        </svg>
                        {property?.rating || '4.8'}
                      </BookingRating>
                    </BookingHeader>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateInputGrid>
                        <DatePicker
                          label="CHECK-IN"
                          value={startDate}
                          onChange={(newValue) => setStartDate(newValue)}
                          slotProps={{
                            textField: {
                              variant: "outlined",
                              size: "small"
                            }
                          }}
                          minDate={new Date()}
                        />
                        <DatePicker
                          label="CHECK-OUT"
                          value={endDate}
                          onChange={(newValue) => setEndDate(newValue)}
                          slotProps={{
                            textField: {
                              variant: "outlined",
                              size: "small"
                            }
                          }}
                          minDate={startDate || new Date()}
                        />
                      </DateInputGrid>
                    </LocalizationProvider>

                    <Button
                      text={currentUser ? "Reserve" : "Sign in to Reserve"}
                      onClick={handleBooking}
                      isLoading={bookingLoading}
                      isDisabled={!startDate || !endDate}
                      full
                    />

                    {pricing.nights > 0 && (
                      <PriceBreakdown>
                        <PriceRow>
                          <span>${property?.price?.org} x {pricing.nights} nights</span>
                          <span>${pricing.subtotal}</span>
                        </PriceRow>
                        <PriceRow>
                          <span>Service fee</span>
                          <span>${pricing.serviceFee}</span>
                        </PriceRow>
                        <PriceRow className="total">
                          <span>Total</span>
                          <span>${pricing.total}</span>
                        </PriceRow>
                      </PriceBreakdown>
                    )}
                  </BookingCard>
                </StickyBookingWrapper>
              </RightColumn>
            </TwoColumnLayout>
          </ContentWrapper>
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
