import { Router } from "express";
import {
  getUserById,
  userSignin,
  userSignup,
} from "../controller/userControllers";

const router = Router();
router.get("/:uid", getUserById);
router.post("/signup", userSignup);
router.post("/signin", userSignin);

export default router;
