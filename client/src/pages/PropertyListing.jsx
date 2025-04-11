import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import PropertyCard from "../componnents/Cards/PropertyCard";
import { getAllProperty } from "../api";
import { CircularProgress } from "@mui/material";
import { useLocation } from "react-router-dom";

const PropertyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding-bottom: 40px; // Add padding at bottom for better scroll experience
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
    padding-bottom: 20px;
  }
`;

const Container = styled.div`
  height: calc(100vh - 80px);
  overflow-y: auto;
  background: ${({ theme }) => theme.bg};
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
  
  @media (max-width: 768px) {
    padding: 20px;
    height: calc(100vh - 60px);
  }
`;

const PropertyListing = () => {
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
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

  return (
    <Container>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </div>
      ) : (
        <PropertyGrid>
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </PropertyGrid>
      )}
    </Container>
  );
};


export default PropertyListing;
