const router = require('express').Router();
const { register, getLogin, login, whoami, googleOauth2 } = require('../controllers/auth.controllers');
const { restrict } = require('../middleware/restrict.middleware');
const passport = require('../libs/passport.libs');

router.post('/register', register);
router.get('/login', getLogin);
router.post('/login', login);
router.get('/whoami', restrict, whoami);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/api/v1/auth/google',
  }),
  googleOauth2
);

module.exports = router;
