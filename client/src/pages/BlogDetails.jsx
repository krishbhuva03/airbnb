import React from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
  color: white;
`;

const BackButton = styled.button`
  background: ${({ theme }) => theme.primary};
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

  &:hover {
    background: ${({ theme }) => theme.primary_dark};
  }
`;

const BlogHeader = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 20px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;
`;

const FeaturedImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 30px;
`;

const Content = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  line-height: 1.8;
  font-size: 1.1rem;

  p {
    margin-bottom: 20px;
  }
`;

// Sample blog data - replace with your actual data source
const blogData = {
  1: {
    title: 'Top 10 Vacation Spots',
    date: 'April 11, 2025',
    author: 'Travel Expert',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    content: `
      <p>Discovering the perfect vacation spot can transform an ordinary trip into an unforgettable adventure. In this comprehensive guide, we'll explore ten breathtaking destinations that offer unique experiences for every type of traveler.</p>
      
      <p>From the pristine beaches of the Maldives to the snow-capped peaks of the Swiss Alps, each location has been carefully selected based on factors such as natural beauty, cultural significance, and visitor experience.</p>
      
      <p>1. Santorini, Greece - Known for its stunning sunsets and white-washed buildings perched on cliffs overlooking the Aegean Sea.</p>
      
      <p>2. Bali, Indonesia - A perfect blend of spiritual tranquility and tropical paradise, offering everything from pristine beaches to ancient temples.</p>
      
      <p>3. Banff National Park, Canada - A wilderness wonderland featuring turquoise lakes, majestic mountains, and abundant wildlife.</p>
      
      <p>Continue reading to discover the remaining seven destinations that made our carefully curated list...</p>
    `
  },
  2: {
    title: 'Budget Travel Tips',
    date: 'April 10, 2025',
    author: 'Budget Explorer',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2074&q=80',
    content: `
      <p>Traveling on a budget doesn't mean compromising on experiences. With careful planning and smart choices, you can explore the world without breaking the bank.</p>
      
      <p>Here are some proven strategies to help you maximize your travel budget:</p>
      
      <p>1. Travel during off-peak seasons to take advantage of lower prices and fewer crowds.</p>
      
      <p>2. Use flight comparison tools and set price alerts to find the best deals on airfare.</p>
      
      <p>3. Consider alternative accommodation options like hostels, guesthouses, or vacation rentals.</p>
      
      <p>Read on to discover more money-saving tips that will help you travel further for less...</p>
    `
  },
  3: {
    title: 'Luxury Homestay Guide',
    date: 'April 9, 2025',
    author: 'Luxury Travel Expert',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    content: `
      <p>Luxury homestays have revolutionized the way we experience high-end travel, offering the perfect blend of comfort, privacy, and authentic local experiences.</p>
      
      <p>What sets luxury homestays apart:</p>
      
      <p>1. Personalized service and attention to detail that exceeds traditional hotel experiences.</p>
      
      <p>2. Unique architectural designs that complement the local environment while providing modern amenities.</p>
      
      <p>3. Exclusive locations offering privacy and stunning views that aren't available in conventional accommodations.</p>
      
      <p>Discover more about how to find and book the perfect luxury homestay for your next adventure...</p>
    `
  }
};

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = blogData[id];

  if (!blog) {
    return (
      <Container>
        <BackButton onClick={() => navigate('/blogs')}>← Back to Blogs</BackButton>
        <h2>Blog not found</h2>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton onClick={() => navigate('/blogs')}>← Back to Blogs</BackButton>
      <BlogHeader>
        <Title>{blog.title}</Title>
        <MetaInfo>
          <span>By {blog.author}</span>
          <span>•</span>
          <span>{blog.date}</span>
        </MetaInfo>
      </BlogHeader>
      <FeaturedImage src={blog.image} alt={blog.title} />
      <Content dangerouslySetInnerHTML={{ __html: blog.content }} />
    </Container>
  );
};

export default BlogDetails;
