import React, { useEffect, useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import PropertyCard from "../componnents/Cards/PropertyCard";
import SkeletonCard from "../componnents/Cards/SkeletonCard";
import { getAllProperty } from "../api";
import { useLocation } from "react-router-dom";
import { Sort, KeyboardArrowDown } from "@mui/icons-material";

const Container = styled.div`
  min-height: calc(100vh - 80px);
  overflow-y: auto;
  background: transparent;
  padding: 40px;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.text_secondary + '40'} transparent;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.text_secondary + '40'};
    border-radius: 20px;
    border: 3px solid transparent;
  }

  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  
  @media (max-width: 1024px) {
    padding: 32px 24px;
  }
  
  @media (max-width: 768px) {
    padding: 24px 16px;
  }
  
  @media (max-width: 480px) {
    padding: 16px 12px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto 32px;
  gap: 16px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const SortContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #FFFFFF;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  svg {
    font-size: 18px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 13px;
  }
`;

const SortDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: ${({ theme }) => theme.card || '#1E1E28'};
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 8px 0;
  min-width: 180px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  z-index: 100;
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
  transform: translateY(${({ isOpen }) => isOpen ? '0' : '-10px'});
  transition: all 0.2s ease;
`;

const SortOption = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: ${({ active, theme }) => active ? (theme.primary + '20') : 'transparent'};
  border: none;
  color: ${({ active }) => active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)'};
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #FFFFFF;
  }
`;

const PropertyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding-bottom: 40px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 24px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
    padding-bottom: 20px;
  }
  
  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding-bottom: 16px;
  }
`;

const NoResults = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  
  h3 {
    font-size: 20px;
    margin-bottom: 8px;
    color: #FFFFFF;
  }
  
  p {
    font-size: 14px;
  }
`;

const ResultCount = styled.span`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
`;

const sortOptions = [
  { id: 'newest', label: 'Newest First' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'rating', label: 'Top Rated' },
];

const PropertyListing = () => {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const { location: loc } = location.state || {};
  const filter = loc ? `location=${loc}` : '';

  const getproperty = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllProperty(filter);
      if (!res.data) {
        setProperties([]);
        return;
      }
      setProperties(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    getproperty();
  }, [getproperty]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(false);
    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [dropdownOpen]);

  // Sort properties based on selected option
  const sortedProperties = useMemo(() => {
    const sorted = [...properties];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price.org - b.price.org);
      case 'price-high':
        return sorted.sort((a, b) => b.price.org - a.price.org);
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest':
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [properties, sortBy]);

  const currentSortLabel = sortOptions.find(opt => opt.id === sortBy)?.label || 'Sort';

  return (
    <Container>
      <Header>
        <div>
          <PageTitle>
            {loc ? `Stays in ${loc}` : "All Stays"}
          </PageTitle>
          {!loading && properties.length > 0 && (
            <ResultCount>{properties.length} properties found</ResultCount>
          )}
        </div>
        
        <SortContainer onClick={(e) => e.stopPropagation()}>
          <SortButton onClick={() => setDropdownOpen(!dropdownOpen)}>
            <Sort />
            {currentSortLabel}
            <KeyboardArrowDown style={{ 
              transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)', 
              transition: '0.2s' 
            }} />
          </SortButton>
          
          <SortDropdown isOpen={dropdownOpen}>
            {sortOptions.map(option => (
              <SortOption
                key={option.id}
                active={sortBy === option.id}
                onClick={() => {
                  setSortBy(option.id);
                  setDropdownOpen(false);
                }}
              >
                {option.label}
              </SortOption>
            ))}
          </SortDropdown>
        </SortContainer>
      </Header>

      {loading ? (
        <PropertyGrid>
          {[...Array(8)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </PropertyGrid>
      ) : sortedProperties.length > 0 ? (
        <PropertyGrid>
          {sortedProperties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </PropertyGrid>
      ) : (
        <NoResults>
          <h3>No properties found</h3>
          <p>Try adjusting your search or browse all our listings.</p>
        </NoResults>
      )}
    </Container>
  );
};

export default PropertyListing;
