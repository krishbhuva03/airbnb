import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import PropertyCard from '../componnents/Cards/PropertyCard';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
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
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 32px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 24px;
  }
`;

const FavoritesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  padding: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    padding: 16px;
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 12px 0;
  }
  
  @media (max-width: 480px) {
    gap: 16px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);

  h2 {
    margin-bottom: 20px;
    color: ${({ theme }) => theme.text_primary};
  }

  p {
    color: ${({ theme }) => theme.text_secondary};
    margin-bottom: 20px;
  }
  
  @media (max-width: 768px) {
    padding: 32px 24px;
  }
  
  @media (max-width: 480px) {
    padding: 24px 16px;
    border-radius: 8px;
    
    h2 {
      font-size: 1.3rem;
      margin-bottom: 16px;
    }
    
    p {
      font-size: 0.9rem;
      margin-bottom: 16px;
    }
  }
`;

const ExploreButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;
  min-height: 44px;

  &:hover {
    background: ${({ theme }) => theme.primary_dark};
  }
  
  @media (max-width: 480px) {
    padding: 14px 28px;
    width: 100%;
    font-size: 0.95rem;
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

const Favorites = () => {
  // Get favorites from Redux store - you'll need to implement this in your Redux state
  const favorites = useSelector((state) => state.favorites?.items || []);
  const { currentUser } = useSelector((state) => state.user);

  // Navigate function for the Explore button
  const handleExplore = () => {
    window.location.href = '/properties';
  };

  if (!currentUser) {
    return (
      <Container>
        <EmptyState>
          <h2>Please Log In</h2>
          <p>You need to be logged in to view your favorites</p>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Your Favorite Properties</Title>
      {favorites.length > 0 ? (
        <FavoritesGrid>
          {favorites.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </FavoritesGrid>
      ) : (
        <EmptyState>
          <h2>No Favorites Yet</h2>
          <p>Start exploring properties and save your favorites!</p>
          <ExploreButton onClick={handleExplore}>
            Explore Properties
          </ExploreButton>
        </EmptyState>
      )}
    </Container>
  );
};

export default Favorites;
