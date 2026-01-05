import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getBlogs } from '../api';
import AdPlacement from '../componnents/AdPlacement';

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
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 16px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 12px;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 24px;
  }
`;

const BlogGrid = styled.div`
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

const BlogCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
  
  @media (max-width: 480px) {
    border-radius: 8px;
  }
  
  @media (hover: none) and (pointer: coarse) {
    &:hover {
      transform: none;
    }
    &:active {
      transform: scale(0.98);
    }
  }
`;

const BlogImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  
  @media (max-width: 768px) {
    height: 180px;
  }
  
  @media (max-width: 480px) {
    height: 160px;
  }
`;

const BlogContent = styled.div`
  padding: 20px;
  
  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const CategoryTag = styled.span`
  display: inline-block;
  background: ${({ theme }) => theme.primary || '#ff385c'};
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  text-transform: capitalize;
  margin-bottom: 10px;
`;

const BlogTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: white;
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
    margin-bottom: 8px;
  }
`;

const BlogExcerpt = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 15px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 12px;
    line-height: 1.5;
  }
`;

const BlogMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  margin-bottom: 15px;
`;

const ReadMore = styled.button`
  background: ${({ theme }) => theme.primary || '#ff385c'};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
  font-weight: 500;
  font-size: 0.95rem;

  &:hover {
    background: ${({ theme }) => theme.primary_dark || '#e61e4d'};
    transform: translateY(-2px);
  }
  
  @media (max-width: 480px) {
    padding: 10px 18px;
    font-size: 0.9rem;
    min-height: 40px;
  }
  
  @media (hover: none) and (pointer: coarse) {
    &:active {
      transform: scale(0.98);
    }
    &:hover {
      background: ${({ theme }) => theme.primary || '#ff385c'};
      transform: none;
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  color: rgba(255, 255, 255, 0.6);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.6);
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;
`;

const PageButton = styled.button`
  background: ${({ $active, theme }) => $active ? (theme.primary || '#ff385c') : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ $active, theme }) => $active ? (theme.primary_dark || '#e61e4d') : 'rgba(255, 255, 255, 0.2)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Blogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasMore: false
  });

  useEffect(() => {
    fetchBlogs(1);
  }, []);

  const fetchBlogs = async (page) => {
    try {
      setLoading(true);
      const response = await getBlogs(page, 9);
      setBlogs(response.data.blogs);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchBlogs(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Insert ad after every 3 blog posts
  const renderBlogsWithAds = () => {
    const items = [];
    blogs.forEach((blog, index) => {
      items.push(
        <BlogCard key={blog._id} onClick={() => navigate(`/blogs/${blog._id}`)}>
          <BlogImage src={blog.featuredImage} alt={blog.title} />
          <BlogContent>
            <CategoryTag>{blog.category}</CategoryTag>
            <BlogTitle>{blog.title}</BlogTitle>
            <BlogExcerpt>{blog.excerpt}</BlogExcerpt>
            <BlogMeta>
              <span>By {blog.author?.name || 'Travel Expert'}</span>
              <span>{blog.readTime} min read</span>
            </BlogMeta>
            <ReadMore>Read More</ReadMore>
          </BlogContent>
        </BlogCard>
      );
      
      // Add an ad placeholder after every 3 posts
      if ((index + 1) % 3 === 0 && index !== blogs.length - 1) {
        items.push(
          <div key={`ad-${index}`} style={{ gridColumn: '1 / -1' }}>
            <AdPlacement variant="between-posts" />
          </div>
        );
      }
    });
    return items;
  };

  if (loading) {
    return (
      <Container>
        <Title>Travel Blog</Title>
        <LoadingContainer>Loading blogs...</LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Title>Travel Blog</Title>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Travel Blog</Title>
      <Subtitle>
        Discover travel tips, destination guides, and inspiration for your next adventure.
        From budget hacks to luxury escapes, we've got you covered.
      </Subtitle>
      
      <BlogGrid>
        {renderBlogsWithAds()}
      </BlogGrid>
      
      {pagination.totalPages > 1 && (
        <Pagination>
          <PageButton 
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </PageButton>
          
          {[...Array(pagination.totalPages)].map((_, i) => (
            <PageButton
              key={i + 1}
              $active={pagination.currentPage === i + 1}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </PageButton>
          ))}
          
          <PageButton 
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasMore}
          >
            Next
          </PageButton>
        </Pagination>
      )}
    </Container>
  );
};

export default Blogs;
