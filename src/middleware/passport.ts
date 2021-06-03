import User from "../model/User.js";
import { SECRET } from "../config/index.js";
import passportJwt, { ExtractJwt } from "passport-jwt";
import { PassportStatic } from "passport";

const { Strategy } = passportJwt;

const optionsJwt = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET,
};

export default (passport: PassportStatic) => {
  passport.use(
    new Strategy(optionsJwt, async (payload, done) => {
      await User.findById(payload.userId)
        .then((user) => {
          user ? done(null, user) : done(null, false);
        })
        .catch(() => done(null, false));
    })
  );
};

// for http only cookie system

// const cookieExtractor = (req: any) => {
//   let jwt = null;

//   if (req && req.cookies) {
//     jwt = req.cookies?.jwt?.token;
//   }

//   return jwt;
// };
// const optionsCookie = {
//   jwtFromRequest: cookieExtractor,
//   secretOrKey: SECRET,
// };
// export default (passport: PassportStatic) => {
//   passport.use(
//     new Strategy(optionsCookie, async (payload, done) => {
//       await User.findById(payload.uid)
//         .then((user) => {
//           user ? done(null, user) : done(null, false);
//         })
//         .catch(() => done(null, false));
//     })
//   );
// };
