import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 12px;
    line-height: 1.5;
  }
`;

const ReadMore = styled.button`
  background: ${({ theme }) => theme.primary};
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
    background: ${({ theme }) => theme.primary_dark};
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
      background: ${({ theme }) => theme.primary};
      transform: none;
    }
  }
`;

const Blogs = () => {
  const navigate = useNavigate();
  // Sample blog data - replace with your actual data
  const blogs = [
    {
      id: 1,
      title: 'Top 10 Vacation Spots',
      excerpt: 'Discover the most breathtaking destinations for your next getaway...',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 2,
      title: 'Budget Travel Tips',
      excerpt: 'Learn how to make the most of your travel budget with these expert tips...',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2074&q=80'
    },
    {
      id: 3,
      title: 'Luxury Homestay Guide',
      excerpt: 'Everything you need to know about finding the perfect luxury homestay...',
      image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
    }
  ];

  return (
    <Container>
      <Title>Travel Blog</Title>
      <BlogGrid>
        {blogs.map(blog => (
          <BlogCard key={blog.id}>
            <BlogImage src={blog.image} alt={blog.title} />
            <BlogContent>
              <BlogTitle>{blog.title}</BlogTitle>
              <BlogExcerpt>{blog.excerpt}</BlogExcerpt>
              <ReadMore onClick={() => navigate(`/blogs/${blog.id}`)}>Read More</ReadMore>
            </BlogContent>
          </BlogCard>
        ))}
      </BlogGrid>
    </Container>
  );
};

export default Blogs;
