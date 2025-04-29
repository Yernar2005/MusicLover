import axios from 'axios';
import {AuthResponse} from "../models/response/AuthResponse.ts";


export const VITE_API_URL = process.env.VITE_API_URL;

const $api = axios.create({
    withCredentials: true,
    baseURL: VITE_API_URL,
})


$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`
    return config;
})

$api.interceptors.response.use((response) => {
    return response;
}, async (error) => {

    const originalRequest = error.config;

    if (error.response?.status === 401) {
        try {
            const response = await axios.get<AuthResponse>(`${VITE_API_URL}/refresh`, {withCredentials: true})
            localStorage.setItem('token', response.data.accessToken);
            return $api.request(originalRequest)
        } catch (e) {
            console.log("User is not authorized: ", e);
        }
    }

})


export default $api;