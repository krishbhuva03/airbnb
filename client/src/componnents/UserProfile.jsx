import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { FaUser, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/reducers/userSlice';

const ProfileContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ProfileDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
  padding: 16px;
  min-width: 200px;
  z-index: 1000;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
  margin-bottom: 12px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;

  svg {
    color: #FF385C;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px;
  border: none;
  background: none;
  color: #FF385C;
  cursor: pointer;
  font-size: 14px;
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    background: #fff1f1;
  }

  svg {
    font-size: 16px;
  }
`;

const UserProfile = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
  };

  return (
    <ProfileContainer>
      <ProfileButton onClick={() => setIsOpen(!isOpen)}>
        <FaUser />
        {user?.name || 'User'}
      </ProfileButton>

      {isOpen && (
        <ProfileDropdown>
          <ProfileInfo>
            <InfoItem>
              <FaUser />
              {user?.name}
            </InfoItem>
            <InfoItem>
              <FaEnvelope />
              {user?.email}
            </InfoItem>
          </ProfileInfo>
          <LogoutButton onClick={handleLogout}>
            <FaSignOutAlt />
            Sign Out
          </LogoutButton>
        </ProfileDropdown>
      )}
    </ProfileContainer>
  );
};

export default UserProfile;
