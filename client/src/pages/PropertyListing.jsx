import React, { useEffect, useState, useCallback } from "react";
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
  background: rgba(30, 30, 40, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 8px 0;
  min-width: 180px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  z-index: 100;
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
  transform: translateY(${({ isOpen }) => isOpen ? '0' : '-10px'});
  transition: all 0.2s ease;
  
  @media (max-width: 480px) {
    min-width: 160px;
    right: 0;
  }
`;

const SortOption = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: ${({ active, theme }) => active ? (theme.primary + '30') : 'transparent'};
  border: none;
  border-left: 3px solid ${({ active, theme }) => active ? theme.primary : 'transparent'};
  color: ${({ active }) => active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.85)'};
  font-size: 14px;
  font-weight: ${({ active }) => active ? '500' : '400'};
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #FFFFFF;
    border-left-color: ${({ theme }) => theme.primary};
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

const LoadMoreButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 32px;
  margin: 32px auto 0;
  background: ${({ theme }) => theme.primary || '#FF385C'};
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const PropertyListing = () => {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const { location: loc } = location.state || {};

  const fetchProperties = useCallback(async (page = 1, append = false) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const res = await getAllProperty(loc || '', page, 12, sortBy);
      if (!res.data || !res.data.properties) {
        if (!append) setProperties([]);
        return;
      }
      
      if (append) {
        setProperties(prev => [...prev, ...res.data.properties]);
      } else {
        setProperties(res.data.properties);
      }
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [loc, sortBy]);

  useEffect(() => {
    fetchProperties(1, false);
  }, [fetchProperties]);

  const handleLoadMore = () => {
    if (pagination?.hasMore) {
      fetchProperties(pagination.currentPage + 1, true);
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(false);
    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [dropdownOpen]);

  const currentSortLabel = sortOptions.find(opt => opt.id === sortBy)?.label || 'Sort';

  return (
    <Container>
      <Header>
        <div>
          <PageTitle>
            {loc ? `Stays in ${loc}` : "All Stays"}
          </PageTitle>
          {!loading && pagination && (
            <ResultCount>
              Showing {properties.length} of {pagination.totalCount} properties
            </ResultCount>
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
                onClick={() => handleSortChange(option.id)}
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
      ) : properties.length > 0 ? (
        <>
          <PropertyGrid>
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </PropertyGrid>
          
          {pagination?.hasMore && (
            <LoadMoreButton 
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading...' : 'Load More Properties'}
            </LoadMoreButton>
          )}
        </>
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

