import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Rating, CircularProgress } from "@mui/material";
import { DeleteOutline, PersonOutline } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { createReview, getPropertyReviews, deleteReview } from "../api";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  margin-top: 24px;
  box-shadow: 0 2px 8px ${({ theme }) => theme.shadow};
  
  @media (max-width: 768px) {
    padding: 16px;
    gap: 20px;
    margin-top: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Stats = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
`;

const AvgRating = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const ReviewForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: ${({ theme }) => theme.bgLight};
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.shadow};
`;

const FormTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
`;

const RatingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.shadow};
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.text_secondary};
  }
`;

const SubmitButton = styled.button`
  padding: 12px 24px;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: ${({ theme }) => theme.disabled};
    cursor: not-allowed;
    transform: none;
  }
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ReviewCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: ${({ theme }) => theme.bgLight};
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.shadow};
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.primary + '20'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.primary};
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const UserName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
`;

const ReviewDate = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.text_secondary};
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.red};
    background: ${({ theme }) => theme.red + '10'};
  }
`;

const ReviewComment = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
  line-height: 1.6;
  margin: 0;
`;

const NoReviews = styled.div`
  text-align: center;
  padding: 32px;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
`;

const LoginPrompt = styled.div`
  text-align: center;
  padding: 16px;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
  background: ${({ theme }) => theme.bgLight};
  border-radius: 8px;
`;

const ReviewSection = ({ propertyId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await getPropertyReviews(propertyId);
      setReviews(response.data.reviews);
      setAvgRating(response.data.avgRating);
      setTotalReviews(response.data.totalReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) {
      fetchReviews();
    }
  }, [propertyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userRating || !comment.trim()) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("roamly-app-token");
      await createReview(token, {
        propertyId,
        rating: userRating,
        comment: comment.trim(),
      });
      setUserRating(0);
      setComment("");
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    
    try {
      const token = localStorage.getItem("roamly-app-token");
      await deleteReview(token, reviewId);
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Container>
      <Header>
        <Title>
          ⭐ Reviews & Ratings
        </Title>
        <Stats>
          <AvgRating>{avgRating || "0"}</AvgRating>
          <Rating value={avgRating} readOnly precision={0.5} />
          <span>({totalReviews} reviews)</span>
        </Stats>
      </Header>

      {currentUser ? (
        <ReviewForm onSubmit={handleSubmit}>
          <FormTitle>Write a Review</FormTitle>
          <RatingWrapper>
            <span>Your Rating:</span>
            <Rating
              value={userRating}
              onChange={(e, newValue) => setUserRating(newValue)}
              size="large"
            />
          </RatingWrapper>
          <TextArea
            placeholder="Share your experience with this property..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
          />
          <SubmitButton 
            type="submit" 
            disabled={submitting || !userRating || !comment.trim()}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </SubmitButton>
        </ReviewForm>
      ) : (
        <LoginPrompt>
          Please sign in to write a review
        </LoginPrompt>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
          <CircularProgress />
        </div>
      ) : reviews.length > 0 ? (
        <ReviewsList>
          {reviews.map((review) => (
            <ReviewCard key={review._id}>
              <ReviewHeader>
                <UserInfo>
                  <Avatar>
                    <PersonOutline />
                  </Avatar>
                  <UserDetails>
                    <UserName>{review.userName}</UserName>
                    <ReviewDate>{formatDate(review.createdAt)}</ReviewDate>
                  </UserDetails>
                </UserInfo>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Rating value={review.rating} readOnly size="small" />
                  {currentUser && (currentUser.id === review.userId || currentUser.isAdmin) && (
                    <DeleteButton onClick={() => handleDelete(review._id)}>
                      <DeleteOutline fontSize="small" />
                    </DeleteButton>
                  )}
                </div>
              </ReviewHeader>
              <ReviewComment>{review.comment}</ReviewComment>
            </ReviewCard>
          ))}
        </ReviewsList>
      ) : (
        <NoReviews>
          No reviews yet. Be the first to review this property!
        </NoReviews>
      )}
    </Container>
  );
};

export default ReviewSection;
