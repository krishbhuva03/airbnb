import React from "react";
import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const Card = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-radius: 16px;
  overflow: hidden;
  background: ${({ theme }) => theme.card};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.disabled + '20'} 25%,
    ${({ theme }) => theme.disabled + '40'} 50%,
    ${({ theme }) => theme.disabled + '20'} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`;

const ImageSkeleton = styled(SkeletonBase)`
  width: 100%;
  height: 220px;
  border-radius: 0;
  
  @media (max-width: 768px) {
    height: 200px;
  }
  
  @media (max-width: 480px) {
    height: 180px;
  }
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px 20px;
  
  @media (max-width: 480px) {
    padding: 12px 16px 16px;
    gap: 10px;
  }
`;

const TitleSkeleton = styled(SkeletonBase)`
  height: 20px;
  width: 80%;
`;

const DescSkeleton = styled(SkeletonBase)`
  height: 16px;
  width: 100%;
`;

const LocationSkeleton = styled(SkeletonBase)`
  height: 28px;
  width: 120px;
  border-radius: 14px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
`;

const PriceSkeleton = styled(SkeletonBase)`
  height: 28px;
  width: 80px;
`;

const OldPriceSkeleton = styled(SkeletonBase)`
  height: 16px;
  width: 50px;
`;

const SkeletonCard = () => {
  return (
    <Card>
      <ImageSkeleton />
      <Details>
        <TitleSkeleton />
        <DescSkeleton />
        <LocationSkeleton />
        <PriceRow>
          <PriceSkeleton />
          <OldPriceSkeleton />
        </PriceRow>
      </Details>
    </Card>
  );
};

export default SkeletonCard;
