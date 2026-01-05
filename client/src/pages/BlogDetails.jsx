import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogById } from '../api';
import AdPlacement from '../componnents/AdPlacement';

const PageWrapper = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  gap: 30px;
  
  @media (max-width: 968px) {
    flex-direction: column;
    gap: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 8px;
  }
`;

const MainContent = styled.div`
  flex: 1;
  max-width: 800px;
  color: white;
`;

const Sidebar = styled.aside`
  width: 300px;
  flex-shrink: 0;
  
  @media (max-width: 968px) {
    width: 100%;
    display: none; /* Hide sidebar on mobile, show in-content ads instead */
  }
`;

const StickyWrapper = styled.div`
  position: sticky;
  top: 100px;
`;

const BackButton = styled.button`
  background: ${({ theme }) => theme.primary || '#ff385c'};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s ease;
  min-height: 44px;

  &:hover {
    background: ${({ theme }) => theme.primary_dark || '#e61e4d'};
  }
  
  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 14px;
    margin-bottom: 16px;
  }
  
  @media (hover: none) and (pointer: coarse) {
    &:active {
      transform: scale(0.98);
    }
    &:hover {
      background: ${({ theme }) => theme.primary || '#ff385c'};
    }
  }
`;

const BlogHeader = styled.div`
  margin-bottom: 30px;
  
  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
`;

const CategoryTag = styled.span`
  display: inline-block;
  background: ${({ theme }) => theme.primary || '#ff385c'};
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  text-transform: capitalize;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 16px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.6rem;
    margin-bottom: 12px;
    line-height: 1.3;
  }
  
  @media (max-width: 320px) {
    font-size: 1.4rem;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 20px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
  
  @media (max-width: 480px) {
    gap: 10px;
    font-size: 14px;
    margin-bottom: 16px;
  }
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const FeaturedImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    height: 300px;
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    height: 220px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 320px) {
    height: 180px;
  }
`;

const Content = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  line-height: 1.8;
  font-size: 1.1rem;

  h2 {
    margin-top: 30px;
    margin-bottom: 15px;
    font-size: 1.6rem;
    color: white;
  }

  p {
    margin-bottom: 20px;
  }
  
  @media (max-width: 768px) {
    padding: 24px;
    font-size: 1rem;
    line-height: 1.7;
    
    h2 {
      font-size: 1.4rem;
    }
    
    p {
      margin-bottom: 16px;
    }
  }
  
  @media (max-width: 480px) {
    padding: 20px 16px;
    font-size: 0.95rem;
    border-radius: 8px;
    line-height: 1.6;
    
    h2 {
      font-size: 1.25rem;
      margin-top: 24px;
      margin-bottom: 12px;
    }
    
    p {
      margin-bottom: 14px;
    }
  }
`;

const MobileAd = styled.div`
  display: none;
  
  @media (max-width: 968px) {
    display: block;
    margin: 20px 0;
  }
`;

const InArticleAd = styled.div`
  margin: 30px 0;
  
  @media (max-width: 968px) {
    display: none;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Tag = styled.span`
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.6);
`;

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await getBlogById(id);
        setBlog(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Blog not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Insert ad into content after 2 paragraphs
  const renderContentWithAds = (content) => {
    if (!content) return null;
    
    // Split content by </p> to find paragraph breaks
    const parts = content.split('</p>');
    const result = [];
    
    parts.forEach((part, index) => {
      if (part.trim()) {
        result.push(
          <span key={index} dangerouslySetInnerHTML={{ __html: part + '</p>' }} />
        );
        
        // Insert in-article ad after the 2nd paragraph
        if (index === 1) {
          result.push(
            <InArticleAd key="in-article-ad">
              <AdPlacement variant="in-article" />
            </InArticleAd>
          );
        }
      }
    });
    
    return result;
  };

  if (loading) {
    return (
      <PageWrapper>
        <MainContent>
          <BackButton onClick={() => navigate('/blogs')}>← Back to Blogs</BackButton>
          <LoadingContainer>Loading article...</LoadingContainer>
        </MainContent>
      </PageWrapper>
    );
  }

  if (error || !blog) {
    return (
      <PageWrapper>
        <MainContent>
          <BackButton onClick={() => navigate('/blogs')}>← Back to Blogs</BackButton>
          <ErrorContainer>
            <h2>Oops! Blog not found</h2>
            <p>{error}</p>
          </ErrorContainer>
        </MainContent>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <MainContent>
        <BackButton onClick={() => navigate('/blogs')}>← Back to Blogs</BackButton>
        
        <BlogHeader>
          <CategoryTag>{blog.category}</CategoryTag>
          <Title>{blog.title}</Title>
          <MetaInfo>
            <MetaItem>
              <span>👤</span>
              <span>{blog.author?.name || 'Travel Expert'}</span>
            </MetaItem>
            <MetaItem>
              <span>📅</span>
              <span>{formatDate(blog.publishedAt)}</span>
            </MetaItem>
            <MetaItem>
              <span>⏱️</span>
              <span>{blog.readTime} min read</span>
            </MetaItem>
            <MetaItem>
              <span>👁️</span>
              <span>{blog.viewCount} views</span>
            </MetaItem>
          </MetaInfo>
        </BlogHeader>
        
        <FeaturedImage src={blog.featuredImage} alt={blog.title} />
        
        {/* Mobile ad - shown on small screens */}
        <MobileAd>
          <AdPlacement variant="mobile-banner" />
        </MobileAd>
        
        <Content>
          {renderContentWithAds(blog.content)}
          
          {blog.tags && blog.tags.length > 0 && (
            <TagsContainer>
              {blog.tags.map((tag, index) => (
                <Tag key={index}>#{tag}</Tag>
              ))}
            </TagsContainer>
          )}
        </Content>
      </MainContent>
      
      {/* Desktop sidebar */}
      <Sidebar>
        <StickyWrapper>
          <AdPlacement variant="sidebar" margin="0 0 20px 0" />
          <AdPlacement variant="between-posts" margin="0" />
        </StickyWrapper>
      </Sidebar>
    </PageWrapper>
  );
};

export default BlogDetails;
