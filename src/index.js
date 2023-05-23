const e = require("express");
const express = require("express");
const passport = require("passport");
const dotenv = require("dotenv").config();
const FacebookStrategy = require("passport-facebook").Strategy;

const app = express();

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.DOMAIN}/callback/facebook`,
      passReqToCallback: true,
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);
app.get("/", (req, res) => {
  res.send("<a href='/redirect/facebook'>Đăng nhập bằng facebook</a>");
});
app.route("/redirect/facebook").get(passport.authenticate("facebook"));

app.get(
  "/callback/facebook",
  passport.authenticate("facebook", {
    session: false,
  }),
  function (req, res) {
    try {
      res.json({ user: req.user.profile });
    } catch (error) {
      res.json({
        message: "Có lỗi",
        error,
      });
    }
  }
);

// gắn nghe cho app và gán vào server
const server = app.listen(process.env.PORT || 80, () => {
  console.log(`Server đang chạy ở cổng ${process.env.PORT}`);
});
