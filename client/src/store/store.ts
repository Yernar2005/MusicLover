import {makeAutoObservable} from "mobx";
import {IUser} from "../models/IUser";
import AuthService from "../services/AuthService.ts";


export default class Store {
    user = {} as IUser;
    isAuthenticated = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuthenticated = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }


    async login(email: string, password: string) {
        try {

            const response = await AuthService.login(email, password);
            console.log(response)
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(
                {
                    id: response.data.user.id,
                    email: response.data.user.email,
                    isActivated: response.data.user.isActivated,
                    role: response.data.user.role,
                }
            )
        } catch (e) {
            console.log(e)
        }
    }



    async registration(email: string, password: string, secretKey:string) {
        try {
            const response = await AuthService.registration(email, password, secretKey);
            console.log("Ответ от сервера:", response);

            if (!response || !response.data) {
                console.error("Ответ от сервера отсутствует или не содержит данных");
                return;
            }

            if (!response.data.accessToken) {
                console.error("Токен отсутствует в ответе:", response.data);
                return;
            }

            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);

            if (!response.data.user) {
                console.error("Информация о пользователе отсутствует:", response.data);
                return;
            }

            this.setUser(response.data.user);
        } catch (e) {
            console.error("Ошибка при регистрации:", e);
            console.log("Детали ошибки:", e || "Неизвестная ошибка");
        }
    }

    async logout(){
        const response = await AuthService.logout();
        localStorage.removeItem('token');
        this.setAuth(false);
        this.setUser({} as IUser);
        return response;
    }
}