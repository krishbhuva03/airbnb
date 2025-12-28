import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Dashboard,
  People,
  Home,
  BookOnline,
  Star,
  TrendingUp,
  Edit,
  Delete,
  Add,
} from "@mui/icons-material";
import { CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import Button from "../componnents/Button";
import { getAdminStats, getAdminUsers, getAllProperty, createProperty, deleteProperty } from "../api";

const Container = styled.div`
  min-height: calc(100vh - 80px);
  background: ${({ theme }) => theme.bg};
  padding: 40px;
  
  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin: 0 0 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  svg {
    color: ${({ theme }) => theme.primary};
  }
  
  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 24px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.card};
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px ${({ theme }) => theme.shadow};
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: ${({ color }) => color + '20'};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    font-size: 28px;
    color: ${({ color }) => color};
  }
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatValue = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const StatLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px ${({ theme }) => theme.shadow};
`;

const Th = styled.th`
  text-align: left;
  padding: 16px;
  background: ${({ theme }) => theme.table_header};
  color: ${({ theme }) => theme.menu_primary_text};
  font-weight: 600;
  font-size: 14px;
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.shadow};
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
`;

const Tr = styled.tr`
  &:hover {
    background: ${({ theme }) => theme.bgLight};
  }
  
  &:last-child td {
    border-bottom: none;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  color: ${({ theme, $danger }) => $danger ? theme.red : theme.text_secondary};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme, $danger }) => $danger ? theme.red + '20' : theme.shadow};
    color: ${({ theme, $danger }) => $danger ? theme.red : theme.primary};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

const UnauthorizedMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
  
  h2 {
    color: ${({ theme }) => theme.text_primary};
    margin-bottom: 12px;
  }
`;

const FormGrid = styled.div`
  display: grid;
  gap: 16px;
  padding: 8px 0;
`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newProperty, setNewProperty] = useState({
    title: "",
    desc: "",
    img: "",
    price: { org: "", mrp: "", off: "" }
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("roamly-app-token");
      
      const [statsRes, usersRes, propertiesRes] = await Promise.all([
        getAdminStats(token),
        getAdminUsers(token),
        getAllProperty("")
      ]);
      
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setProperties(propertiesRes.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.isAdmin) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const handleDeleteProperty = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    
    try {
      const token = localStorage.getItem("roamly-app-token");
      await deleteProperty(token, id);
      fetchData();
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Failed to delete property");
    }
  };

  const handleCreateProperty = async () => {
    try {
      const token = localStorage.getItem("roamly-app-token");
      await createProperty(token, {
        ...newProperty,
        price: {
          org: parseFloat(newProperty.price.org),
          mrp: parseFloat(newProperty.price.mrp),
          off: parseFloat(newProperty.price.off) || 0
        }
      });
      setOpenDialog(false);
      setNewProperty({ title: "", desc: "", img: "", price: { org: "", mrp: "", off: "" } });
      fetchData();
    } catch (error) {
      console.error("Error creating property:", error);
      alert("Failed to create property");
    }
  };

  if (!currentUser?.isAdmin) {
    return (
      <Container>
        <UnauthorizedMessage>
          <h2>Access Denied</h2>
          <p>You don't have permission to access the admin dashboard.</p>
          <Button text="Go Home" onClick={() => navigate("/")} style={{ marginTop: 20 }} />
        </UnauthorizedMessage>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle>
        <Dashboard /> Admin Dashboard
      </PageTitle>

      <StatsGrid>
        <StatCard>
          <StatIcon color="#4CAF50">
            <People />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats?.totalUsers || 0}</StatValue>
            <StatLabel>Total Users</StatLabel>
          </StatInfo>
        </StatCard>
        
        <StatCard>
          <StatIcon color="#2196F3">
            <Home />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats?.totalProperties || 0}</StatValue>
            <StatLabel>Properties</StatLabel>
          </StatInfo>
        </StatCard>
        
        <StatCard>
          <StatIcon color="#FF9800">
            <BookOnline />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats?.totalBookings || 0}</StatValue>
            <StatLabel>Bookings</StatLabel>
          </StatInfo>
        </StatCard>
        
        <StatCard>
          <StatIcon color="#E91E63">
            <Star />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats?.avgRating || 0}</StatValue>
            <StatLabel>Avg Rating</StatLabel>
          </StatInfo>
        </StatCard>
        
        <StatCard>
          <StatIcon color="#9C27B0">
            <TrendingUp />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats?.recentUsers || 0}</StatValue>
            <StatLabel>New Users (7d)</StatLabel>
          </StatInfo>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionHeader>
          <SectionTitle>Properties ({properties.length})</SectionTitle>
          <Button 
            text="Add Property" 
            small 
            onClick={() => setOpenDialog(true)}
            leftIcon={<Add />}
          />
        </SectionHeader>
        <Table>
          <thead>
            <tr>
              <Th>Title</Th>
              <Th>Price</Th>
              <Th>Rating</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {properties.slice(0, 10).map((property) => (
              <Tr key={property._id}>
                <Td>{property.title}</Td>
                <Td>${property.price?.org}</Td>
                <Td>⭐ {property.rating}</Td>
                <Td>
                  <ActionButton onClick={() => navigate(`/properties/${property._id}`)}>
                    <Edit fontSize="small" />
                  </ActionButton>
                  <ActionButton $danger onClick={() => handleDeleteProperty(property._id)}>
                    <Delete fontSize="small" />
                  </ActionButton>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section>
        <SectionTitle>Recent Users ({users.length})</SectionTitle>
        <Table style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Joined</Th>
            </tr>
          </thead>
          <tbody>
            {users.slice(0, 10).map((user) => (
              <Tr key={user._id}>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.isAdmin ? "Admin" : "User"}</Td>
                <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Property</DialogTitle>
        <DialogContent>
          <FormGrid>
            <TextField
              label="Title"
              fullWidth
              value={newProperty.title}
              onChange={(e) => setNewProperty({ ...newProperty, title: e.target.value })}
              margin="dense"
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={newProperty.desc}
              onChange={(e) => setNewProperty({ ...newProperty, desc: e.target.value })}
              margin="dense"
            />
            <TextField
              label="Image URL"
              fullWidth
              value={newProperty.img}
              onChange={(e) => setNewProperty({ ...newProperty, img: e.target.value })}
              margin="dense"
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              value={newProperty.price.org}
              onChange={(e) => setNewProperty({ 
                ...newProperty, 
                price: { ...newProperty.price, org: e.target.value } 
              })}
              margin="dense"
            />
            <TextField
              label="MRP"
              type="number"
              fullWidth
              value={newProperty.price.mrp}
              onChange={(e) => setNewProperty({ 
                ...newProperty, 
                price: { ...newProperty.price, mrp: e.target.value } 
              })}
              margin="dense"
            />
            <TextField
              label="Discount %"
              type="number"
              fullWidth
              value={newProperty.price.off}
              onChange={(e) => setNewProperty({ 
                ...newProperty, 
                price: { ...newProperty.price, off: e.target.value } 
              })}
              margin="dense"
            />
          </FormGrid>
        </DialogContent>
        <DialogActions>
          <Button text="Cancel" type="secondary" small onClick={() => setOpenDialog(false)} />
          <Button text="Create" small onClick={handleCreateProperty} />
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
