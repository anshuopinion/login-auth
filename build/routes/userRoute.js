"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllers_1 = require("../controller/userControllers");
const router = express_1.Router();
router.get("/:uid", userControllers_1.getUserById);
router.post("/signup", userControllers_1.userSignup);
router.post("/signin", userControllers_1.userSignin);
exports.default = router;
//# sourceMappingURL=userRoute.js.map