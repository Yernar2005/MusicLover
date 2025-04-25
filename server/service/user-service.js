const bcrypt = require('bcrypt');
const uuid = require('uuid');


const UserModel = require('../models/user-model')
const tokenService = require('../service/token-service')
const UserDto = require("../dtos/user-dto");
const MailService = require("../service/mail-service");
const ApiError = require('../exceptions/api-error');


class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequestError("User already exist");
        }

        const hashedPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4()

        const user = await UserModel.create({email, password: hashedPassword, activationLink})
        await MailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)
        const userDto = new UserDto(user)


        const tokens = tokenService.generateToken({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {...tokens, user: userDto}
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw new Error("User not found")
        }
        user.isActivated = true
        await user.save();

    }

    async login(email, password) {
        const user = await UserModel.findOne({email})

        if (!user) {
            throw ApiError.BadRequestError("User not found")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            throw ApiError.BadRequestError("Invalid password")

        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateToken({...userDto})

        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}

    }

    async logout(refreshToken) {
        return await tokenService.removeToken(refreshToken)
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.BadRequestError("Refresh token is not provided")
        }

        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError("Refresh token is not valid")

        }

        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateToken({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async getAllUsers(){
        const users = await UserModel.find();
        return users;
    }

}


module.exports = new UserService()