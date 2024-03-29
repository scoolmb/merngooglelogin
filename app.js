require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 6005;
require("./db/connect");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2");
const userDb = require("./model/userSchema");

const jwtSecret = 'your-jwt-secret'; // Replace with your own secret key
const clientId =
  "108207914740-3k2dsl1i59r5fsdu2qrudg196ee2csja.apps.googleusercontent.com";
const clientSecret = "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";

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());

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
    session: false,
    successRedirect: "https://Vibey.io/app?token=token",
    failureRedirect: "http://localhost:3000/login",
  }),
  (req, res) => {

    res.json({ token:"testtoken" });
  }
);

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
