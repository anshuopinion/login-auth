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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const passport_2 = __importDefault(require("./middleware/passport"));
const http_errors_1 = __importDefault(require("http-errors"));
const config_1 = require("./config");
const Auth_1 = require("./utils/Auth");
const app = express_1.default();
const port = config_1.PORT || 9000;
app.use(morgan_1.default("tiny"));
app.use(cors_1.default({ origin: "*" }));
app.use(cookie_parser_1.default());
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
passport_2.default(passport_1.default);
app.get("/api", Auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({ message: "You are logged in" });
}));
app.use("/api/user", userRoute_1.default);
app.use(() => {
    const error = http_errors_1.default(404, "Could not find this route");
    throw error;
});
const errorHandler = (error, req, res, next) => {
    console.log(error.message, error.statusCode);
    if (res.headersSent) {
        return next(error);
    }
    res
        .status(error.statusCode || 500)
        .json({ message: error.message || "An Unknown error occured" });
};
app.use(errorHandler);
mongoose_1.default
    .connect(config_1.DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
})
    .then(() => {
    console.log("Connected to db");
    app.listen(port, () => {
        console.log(`Listening On Port ${port}`);
    });
})
    .catch(() => {
    throw http_errors_1.default(501, "Unable to connect database");
});
//# sourceMappingURL=index.js.map