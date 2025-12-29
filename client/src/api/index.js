import axios from "axios";


const API = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:8080/api/",
})

// Interceptor to handle session expiry (single device login)
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token and dispatch session expired event
            localStorage.removeItem('roamly-app-token');
            window.dispatchEvent(new CustomEvent('session-expired'));
        }
        return Promise.reject(error);
    }
);

export const UserSignUp = async (data) => await API.post("user/signup", data)

export const UserSignIn = async (data) => await API.post("user/signin", data)

export const getAllProperty = async (filter) => await API.get(`/property/get?${filter}`)

export const getPropertyDetails = async (id) => await API.get(`/property/${id}`)

export const getFavourite = async (token) => await API.get(`/user/getFavorites/`, {
    headers: {Authorization: `Bearer ${token}`}
})

export const addToFavourite = async (propertyId, token) => await API.post(`/user/addToFavorites/`, 
    { propertyId }, 
    { headers: { Authorization: `Bearer ${token}` } }
)

export const bookProperty = async (token, data) =>
    await API.post(`/user/booking`, data, {
        headers: {Authorization: `Bearer ${token}`}
});

export const getBookedProperty = async (token) =>
    await API.get(`/user/getBooking`, {
        headers: {Authorization: `Bearer ${token}`}
});

export const deleteFromFavourite = async (propertyId, token) => 
    await API.post(`/user/removeFavorite`, 
        { propertyId },
        { headers: { Authorization: `Bearer ${token}` } }
    )

// Chat APIs
export const getChatRooms = async (token) =>
    await API.get(`/chat/rooms`, {
        headers: { Authorization: `Bearer ${token}` }
    });

export const checkAdminStatus = async (token) =>
    await API.get(`/chat/admin-status`, {
        headers: { Authorization: `Bearer ${token}` }
    });

export const getChatHistory = async (roomId, token) =>
    await API.get(`/chat/history/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

// Review APIs
export const createReview = async (token, data) =>
    await API.post(`/reviews/create`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });

export const getPropertyReviews = async (propertyId) =>
    await API.get(`/reviews/property/${propertyId}`);

export const deleteReview = async (token, reviewId) =>
    await API.delete(`/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

// Admin APIs
export const getAdminStats = async (token) =>
    await API.get(`/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
    });

export const getAdminUsers = async (token) =>
    await API.get(`/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
    });

export const createProperty = async (token, data) =>
    await API.post(`/admin/property`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });

export const updateProperty = async (token, id, data) =>
    await API.put(`/admin/property/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });

export const deleteProperty = async (token, id) =>
    await API.delete(`/admin/property/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });