const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await prisma.user.upsert({
          where: { email: profile.emails[0].value },
          update: { googleId: profile.id },
          create: {
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
          },
        });
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;
