import axios from "axios";

const API = axios.create({
    baseURL: "https://server-eta-sable.vercel.app/api/",
})

export const UserSignUp = async (data) => await API.post("user/signup", data)

export const UserSignIn = async (data) => await API.post("user/signin", data)

export const getAllProperty = async (filter) => {
    try {
        const response = await API.get(`/property/get?${filter}`);
        console.log('API Response:', response);
        return response;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

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