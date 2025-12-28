import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { 
  BeachAccess, 
  Landscape, 
  LocationCity, 
  Spa, 
  Favorite, 
  FamilyRestroom,
  Explore,
  ArrowForward,
  CheckCircle,
  Refresh
} from '@mui/icons-material';
import { getAllProperty } from '../api';
import PropertyCard from '../componnents/Cards/PropertyCard';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const Container = styled.div`
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const Title = styled.h1`
  text-align: center;
  color: #FFFFFF;
  font-size: 2.5rem;
  margin-bottom: 16px;
  animation: ${fadeIn} 0.6s ease-out;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin-bottom: 48px;
  max-width: 600px;
  animation: ${fadeIn} 0.6s ease-out 0.1s both;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 32px;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  max-width: 400px;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  margin-bottom: 40px;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out 0.2s both;
`;

const Progress = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.primary};
  border-radius: 3px;
  transition: width 0.5s ease;
  width: ${({ progress }) => progress}%;
`;

const QuestionContainer = styled.div`
  width: 100%;
  max-width: 800px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Question = styled.h2`
  text-align: center;
  color: #FFFFFF;
  font-size: 1.5rem;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 24px;
  }
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  width: 100%;
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

const OptionCard = styled.div`
  background: ${({ selected, theme }) => 
    selected ? theme.primary : 'rgba(255, 255, 255, 0.1)'};
  border: 2px solid ${({ selected, theme }) => 
    selected ? theme.primary : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 16px;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: translateY(-4px);
    border-color: ${({ theme }) => theme.primary};
    background: ${({ selected, theme }) => 
      selected ? theme.primary : 'rgba(255, 255, 255, 0.15)'};
  }
  
  svg {
    font-size: 36px;
    color: ${({ selected }) => selected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.9)'};
  }
  
  @media (max-width: 480px) {
    padding: 20px 12px;
    
    svg {
      font-size: 28px;
    }
  }
`;

const OptionLabel = styled.span`
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 40px;
  justify-content: center;
  
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    gap: 12px;
  }
`;

const Button = styled.button`
  padding: 14px 32px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  ${({ primary, theme }) => primary ? `
    background: ${theme.primary};
    color: white;
    
    &:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }
  ` : `
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
  }
`;

const ResultContainer = styled.div`
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
  width: 100%;
  max-width: 1200px;
`;

const ResultIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  animation: ${pulse} 2s infinite;
  
  svg {
    font-size: 40px;
    color: white;
  }
`;

const ResultTitle = styled.h2`
  color: #FFFFFF;
  font-size: 2rem;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ResultDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin-bottom: 24px;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 40px;
`;

const Tag = styled.span`
  background: rgba(255, 255, 255, 0.15);
  color: #FFFFFF;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  backdrop-filter: blur(5px);
`;

const RecommendationsSection = styled.div`
  width: 100%;
  margin-top: 32px;
`;

const RecommendationsTitle = styled.h3`
  color: #FFFFFF;
  font-size: 1.3rem;
  margin-bottom: 24px;
  text-align: center;
`;

const PropertiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  width: 100%;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const LoadingText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  text-align: center;
`;

const questions = [
  {
    id: 'vibe',
    question: "What's your travel vibe?",
    options: [
      { id: 'beach', label: 'Beach & Sun', icon: BeachAccess },
      { id: 'mountain', label: 'Mountains', icon: Landscape },
      { id: 'city', label: 'City Explorer', icon: LocationCity },
      { id: 'wellness', label: 'Wellness', icon: Spa },
      { id: 'romantic', label: 'Romantic', icon: Favorite },
      { id: 'family', label: 'Family Fun', icon: FamilyRestroom },
    ]
  },
  {
    id: 'duration',
    question: 'How long is your trip?',
    options: [
      { id: 'weekend', label: 'Weekend (2-3 days)', icon: null },
      { id: 'week', label: 'Week (5-7 days)', icon: null },
      { id: 'extended', label: 'Extended (2+ weeks)', icon: null },
      { id: 'flexible', label: 'Flexible', icon: null },
    ]
  },
  {
    id: 'budget',
    question: 'What\'s your budget range?',
    options: [
      { id: 'budget', label: 'Budget-friendly', icon: null },
      { id: 'moderate', label: 'Moderate', icon: null },
      { id: 'luxury', label: 'Luxury', icon: null },
      { id: 'any', label: 'No limit', icon: null },
    ]
  }
];

const results = {
  beach: {
    title: 'Beach Paradise Awaits! 🏖️',
    description: 'You love the sound of waves and the feel of sand between your toes. Here are some perfect coastal getaways for you.',
    tags: ['Beachfront', 'Ocean View', 'Pool', 'Tropical']
  },
  mountain: {
    title: 'Mountain Adventure Calls! 🏔️',
    description: 'Fresh air and stunning views are your thing. Check out these cozy retreats nestled in nature.',
    tags: ['Cabin', 'Scenic', 'Hiking', 'Nature']
  },
  city: {
    title: 'Urban Explorer! 🌆',
    description: 'You thrive in the energy of city life. Discover these stylish stays in vibrant neighborhoods.',
    tags: ['Downtown', 'Walkable', 'Nightlife', 'Culture']
  },
  wellness: {
    title: 'Zen Retreat Found! 🧘',
    description: 'Peace and tranquility are calling. These serene spaces are perfect for relaxation.',
    tags: ['Spa', 'Peaceful', 'Garden', 'Meditation']
  },
  romantic: {
    title: 'Romance in the Air! 💕',
    description: 'Love is in the details. These intimate hideaways are perfect for creating memories together.',
    tags: ['Couples', 'Private', 'Scenic', 'Cozy']
  },
  family: {
    title: 'Family Fun Awaits! 👨‍👩‍👧‍👦',
    description: 'Making memories with loved ones is priceless. These spacious stays have room for everyone.',
    tags: ['Spacious', 'Kid-friendly', 'Games', 'Kitchen']
  }
};

const Discover = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await getAllProperty('');
      if (response?.data) {
        // Shuffle and pick 3-4 random properties as recommendations
        const shuffled = [...response.data].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, Math.min(4, shuffled.length));
        setProperties(selected);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showResult) {
      fetchProperties();
    }
  }, [showResult]);

  const handleOptionSelect = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleExploreAll = () => {
    navigate('/properties');
  };

  const handleStartOver = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResult(false);
    setProperties([]);
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const result = showResult && answers.vibe ? results[answers.vibe] : null;

  return (
    <Container>
      {!showResult ? (
        <>
          <Title>Discover Your Perfect Stay</Title>
          <Subtitle>
            Answer a few quick questions and we'll find the ideal getaway for you
          </Subtitle>
          
          <ProgressBar>
            <Progress progress={progress} />
          </ProgressBar>

          <QuestionContainer key={currentStep}>
            <Question>{currentQuestion.question}</Question>
            
            <OptionsGrid>
              {currentQuestion.options.map(option => (
                <OptionCard
                  key={option.id}
                  selected={answers[currentQuestion.id] === option.id}
                  onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
                >
                  {option.icon && <option.icon />}
                  <OptionLabel>{option.label}</OptionLabel>
                </OptionCard>
              ))}
            </OptionsGrid>

            <ButtonRow>
              {currentStep > 0 && (
                <Button onClick={handleBack}>
                  Back
                </Button>
              )}
              <Button 
                primary 
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
              >
                {currentStep === questions.length - 1 ? 'See Results' : 'Next'}
                <ArrowForward />
              </Button>
            </ButtonRow>
          </QuestionContainer>
        </>
      ) : (
        <ResultContainer>
          <ResultIcon>
            <CheckCircle />
          </ResultIcon>
          <ResultTitle>{result?.title}</ResultTitle>
          <ResultDescription>{result?.description}</ResultDescription>
          
          <TagsContainer>
            {result?.tags.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </TagsContainer>

          <RecommendationsSection>
            <RecommendationsTitle>✨ Recommended Stays For You</RecommendationsTitle>
            
            {loading ? (
              <LoadingText>Finding perfect stays...</LoadingText>
            ) : properties.length > 0 ? (
              <PropertiesGrid>
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </PropertiesGrid>
            ) : (
              <LoadingText>No properties available at the moment</LoadingText>
            )}
          </RecommendationsSection>

          <ButtonRow>
            <Button onClick={handleStartOver}>
              <Refresh />
              Start Over
            </Button>
            <Button primary onClick={handleExploreAll}>
              <Explore />
              View All Stays
            </Button>
          </ButtonRow>
        </ResultContainer>
      )}
    </Container>
  );
};

export default Discover;
