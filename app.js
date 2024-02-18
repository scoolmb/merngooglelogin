require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 6005;
require("./db/connect");
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2");
const userDb = require("./model/userSchema");
const CustomError = require("./utils/CustomError");
const errorHandler = require("./utils/errorHandler");
const clientId =
  "108207914740-3k2dsl1i59r5fsdu2qrudg196ee2csja.apps.googleusercontent.com";
const clientSecret = "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";

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: "2134s54dgsdgse",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy(
    {
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      console.log("profile", profile);
      try {
        let user = await userDb.findOne({ email: profile.emails[0].value });
        if (!user) {
          user = new userDb({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
app.get("/", (req, res) => {
  res.status(200).json("server start");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3001/dashboard",
    failureRedirect: "http://localhost:3001/login",
  })
);
app.all("*", (req, res, next) => {
  throw new CustomError(`can't found the ${req.originalUrl}`, 404);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
