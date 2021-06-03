"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuth = void 0;
const passport_1 = __importDefault(require("passport"));
exports.userAuth = passport_1.default.authenticate("jwt", { session: false });
//# sourceMappingURL=Auth.js.map