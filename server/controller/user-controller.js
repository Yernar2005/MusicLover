const {validationResult} = require('express-validator');


const userService = require('../service/user-service.js');
const ApiError = require('../exceptions/api-error')


class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequestError("Mistake in registration data", errors.array()))

            }

            const {email, password, secretKey} = req.body;
            const userData = await userService.registration(email, password, secretKey);
            res.cookie('refreshToken', userData.refreshToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 30,
            });
            return res.json(userData);
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 30,
            });
            return res.json(userData);

        } catch (e) {
            console.log("Error in login")
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;

            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken');
            return res.json(token)

        } catch (e) {
            console.log("Error in logout")
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {email, password} = req.body;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 30,
            });
            return res.json(userData);

        } catch (e) {
            console.log("Error in refresh")
            next(e)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)

        } catch (e) {
            console.log("Error in activate")
            next(e)
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers()
            return res.json(users)
        } catch (e) {
            console.log("Error in getUsers")
            next(e)
        }
    }


}

const userController = new UserController();
module.exports = userController;