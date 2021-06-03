import { RequestHandler } from "express";
import createHttpError from "http-errors";
import User, { IUser } from "../model/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { SECRET } from "../config";

export const getUserById: RequestHandler = async (req, res, next) => {
  const userId = req.params.uid;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return next(createHttpError(404, "User Not found"));
    }
    const { name, id, email } = user;
    res.status(200).json({ name, id, email });
  } catch (error) {
    return next(
      createHttpError(501, "something went wrong | Unable to find user")
    );
  }
};

export const userSignup: RequestHandler = async (req, res, next) => {
  const { name, email, password }: IUser = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) return next(createHttpError(401, "Email Already exist"));
    console.log(existingUser);

    const salt = await bcrypt.genSalt();
    const modifedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      name,
      email,
      password: modifedPassword,
    });

    try {
      await user.save();
      const result = generateJwtToken(user);
      res.cookie("jwt", result, {
        maxAge: 1000 * 60 * 60 * 60,
        // httpOnly: true,
      });
      res.status(200).json({ ...result, message: "Signup completed." });
    } catch (error) {
      return next(
        createHttpError(500, "Unable to Sign Up user, Something went wrong")
      );
    }
  } catch (error) {
    createHttpError(500, "Unable to Sign Up user, Something went wrong");
  }
};

export const userSignin: RequestHandler = async (req, res, next) => {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      return next(createHttpError(404, "Invalid Email Id"));
    }

    if (await bcrypt.compare(password, existingUser.password)) {
      const result = generateJwtToken(existingUser);
      res.cookie("jwt", result, {
        maxAge: 1000 * 60 * 60 * 60,
        // httpOnly: true,
      });
      res.status(200).json(result);
    } else {
      return next(createHttpError(401, "Wrong Password"));
    }
  } catch (error) {
    return next(
      createHttpError(500, "Unable to Sign user, Something went wrong")
    );
  }
};

const generateJwtToken = (user: IUser): { userId: string; token: string } => {
  let token: string | undefined;
  if (user) {
    token = jwt.sign({ userId: user._id, email: user.email }, SECRET, {
      expiresIn: 60 * 60 * 60,
    });
  }
  let result = {
    userId: user._id,
    token: `Bearer ${token}`,
  };
  return result;
};
