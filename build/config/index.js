"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET = exports.PORT = exports.DB = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.DB = process.env.DB;
exports.PORT = parseInt(process.env.PORT);
exports.SECRET = process.env.SECRET;
//# sourceMappingURL=index.js.map