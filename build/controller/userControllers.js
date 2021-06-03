"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSignin = exports.userSignup = exports.getUserById = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const User_1 = __importDefault(require("../model/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../config");
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.uid;
    try {
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return next(http_errors_1.default(404, "User Not found"));
        }
        const { name, id, email } = user;
        res.status(200).json({ name, id, email });
    }
    catch (error) {
        return next(http_errors_1.default(501, "something went wrong | Unable to find user"));
    }
});
exports.getUserById = getUserById;
const userSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const existingUser = yield User_1.default.findOne({ email: email });
        if (existingUser)
            return next(http_errors_1.default(401, "Email Already exist"));
        console.log(existingUser);
        const salt = yield bcrypt_1.default.genSalt();
        const modifedPassword = yield bcrypt_1.default.hash(password, salt);
        const user = new User_1.default({
            name,
            email,
            password: modifedPassword,
        });
        try {
            yield user.save();
            const result = generateJwtToken(user);
            res.cookie("jwt", result, {
                maxAge: 1000 * 60 * 60 * 60,
            });
            res.status(200).json(Object.assign(Object.assign({}, result), { message: "Signup completed." }));
        }
        catch (error) {
            return next(http_errors_1.default(500, "Unable to Sign Up user, Something went wrong"));
        }
    }
    catch (error) {
        http_errors_1.default(500, "Unable to Sign Up user, Something went wrong");
    }
});
exports.userSignup = userSignup;
const userSignin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const existingUser = yield User_1.default.findOne({ email: email });
        if (!existingUser) {
            return next(http_errors_1.default(404, "Invalid Email Id"));
        }
        if (yield bcrypt_1.default.compare(password, existingUser.password)) {
            const result = generateJwtToken(existingUser);
            res.cookie("jwt", result, {
                maxAge: 1000 * 60 * 60 * 60,
            });
            res.status(200).json(result);
        }
        else {
            return next(http_errors_1.default(401, "Wrong Password"));
        }
    }
    catch (error) {
        return next(http_errors_1.default(500, "Unable to Sign user, Something went wrong"));
    }
});
exports.userSignin = userSignin;
const generateJwtToken = (user) => {
    let token;
    if (user) {
        token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, config_1.SECRET, {
            expiresIn: 60 * 60 * 60,
        });
    }
    let result = {
        userId: user._id,
        token: `Bearer ${token}`,
    };
    return result;
};
//# sourceMappingURL=userControllers.js.map