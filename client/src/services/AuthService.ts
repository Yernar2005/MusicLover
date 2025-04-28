import {AxiosResponse} from 'axios';


import $api from "../http";
import {AuthResponse} from "../models/response/AuthResponse.ts";

export default class AuthService {
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/api/login', {email, password})
    }

    static async registration(email: string, password: string, secretKey: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/api/registration', {email, password, secretKey})
    }

    static async logout(): Promise<void> {
        return $api.post('/logout')
    }
}