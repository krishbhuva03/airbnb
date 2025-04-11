import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { CircularProgress, Rating } from "@mui/material";
import styled from "styled-components";
import {
  AddShoppingCartOutlined,
  FavoriteBorder,
  FavoriteRounded,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { openSnackbar } from "../../redux/reducers/snackbarSlice";
import { addFavorite, removeFavorite } from "../../redux/reducers/favoritesSlice";
import {
  addToCart,
  addToFavourite,
  deleteFromFavourite,
  getFavourite,
} from "../../api";

const Card = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s ease-out;
  cursor: pointer;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;
const Image = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  transition: all 0.3s ease-out;
`;

const Menu = styled.div`
  position: absolute;
  z-index: 10;
  color: ${({ theme }) => theme.text_primary};
  top: 14px;
  right: 14px;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const MenuItem = styled.div`
  border-radius: 50%;
  width: 36px;
  height: 36px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
  }
`;
const Rate = styled.div`
  position: absolute;
  z-index: 10;
  color: ${({ theme }) => theme.text_primary};
  bottom: 12px;
  left: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  background: white;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 6px;
  transition: all 0.3s ease-out;

  &:hover {
    background-color: ${({ theme }) => theme.primary};
  }
  &:hover ${Image} {
    opacity: 0.9;
  }
  &:hover ${Menu} {
    opacity: 1;
    transform: translateY(0);
  }
`;
const Details = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
  padding: 16px 20px 20px;
`;
const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;
const Desc = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Location = styled.div`
  width: fit-content;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 20px;
  background: ${({ theme }) => theme.disabled + 20};
  color: ${({ theme }) => theme.text_secondary};
`;

const Price = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-top: 4px;
`;
const Strike = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary + 60};
  text-decoration: line-through;
  text-decoration-color: ${({ theme }) => theme.text_secondary + 50};
`;
const Span = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
`;
const Percent = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: green;
`;

const PropertyCard = ({ property }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [favorite, setFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const favorites = useSelector((state) => state.favorites.items);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation(); // Prevent navigation when clicking favorite
    try {
      setFavoriteLoading(true);
      const token = localStorage.getItem("airbnb-app-token");
      
      if (!token) {
        dispatch(openSnackbar({ message: 'Please login to add favorites', severity: 'warning' }));
        return;
      }

      if (favorite) {
        const response = await deleteFromFavourite(property._id, token);
        if (response.status === 200) {
          dispatch(removeFavorite(property._id));
          setFavorite(false);
          dispatch(openSnackbar({ message: 'Removed from favorites', severity: 'success' }));
        }
      } else {
        const response = await addToFavourite(property._id, token);
        if (response.status === 200) {
          dispatch(addFavorite(property));
          setFavorite(true);
          dispatch(openSnackbar({ message: 'Added to favorites', severity: 'success' }));
        }
      }
    } catch (err) {
      console.error('Error handling favorite:', err);
      dispatch(openSnackbar({ 
        message: err.response?.data?.message || 'Error updating favorites', 
        severity: 'error' 
      }));
    } finally {
      setFavoriteLoading(false);
    }
  };

  useEffect(() => {
    // Check if the property is in favorites
    const isFavorite = favorites.some(fav => fav._id === property._id);
    setFavorite(isFavorite);
  }, [favorites, property._id]);

  const checkFavourite = async () => {
    try {
      setFavoriteLoading(true);
      const token = localStorage.getItem("airbnb-app-token");
      
      if (!token) {
        console.log('No token found in localStorage');
        return;
      }
      console.log('Token found:', token.substring(0, 10) + '...');
      
      const response = await getFavourite(token);
      console.log('Favorites response:', response.data);
      
      const isFavorite = response.data?.some(
        (favorite) => favorite._id === property?._id
      );
      setFavorite(isFavorite);
    } catch (err) {
      console.error('Error in checkFavourite:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        // Token might be invalid or expired
        localStorage.removeItem("airbnb-app-token");
      }
    } finally {
      setFavoriteLoading(false);
    }
  }

  useEffect(() => {
    checkFavourite()
  }, [])

  return (
  <Card>
    <Top>
      <Image src={property?.img} />
      <Menu>
        <MenuItem onClick={handleFavoriteClick}>
        {favoriteLoading ? (
          <CircularProgress size={20} />
        ) : (
          <>
          {favorite ? (
            <FavoriteRounded sx={{ fontSize: "20px", color: "red" }}/>
          ) : (
            <FavoriteBorder sx={{fontSize: "20px", color: "#666"}}/>
          )}
          </>
          )}
        </MenuItem>
      </Menu>
      <Rate>
        <Rating 
        value={property?.rating}
        sx={{fontSize:"14px"}}/>
      </Rate>
    </Top>
    <Details onClick={()=> navigate(`/properties/${property?._id}`)}>
      <Title>{property?.title}</Title>
      <Desc>{property?.Desc}</Desc>
      <Location>{property?.location}</Location>
      <Price>
        ${property?.price?.org}
        <Strike>${property?.price.mrp}</Strike>
        <Percent>${property?.price.off}% OFF</Percent>
      </Price>
    </Details>
  </Card>
  )
};

export default PropertyCard;
