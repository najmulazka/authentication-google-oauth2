const prisma = require('../libs/prisma.libs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

module.exports = {
  register: async (req, res, next) => {
    try {
      let { name, email, password, password_confirmation } = req.body;

      if (password != password_confirmation) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'password and password confirmation not same',
          data: null,
        });
      }

      let userExist = await prisma.user.findUnique({ where: { email } });
      if (userExist) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'User already exist',
          data: null,
        });
      }

      let encryptedPassword = await bcrypt.hash(password, 10);
      let user = await prisma.user.create({
        data: {
          name,
          email,
          password: encryptedPassword,
        },
      });

      return res.status(201).json({
        status: true,
        message: 'OK',
        err: null,
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  },

  getLogin: async (req, res, next) => {
    let path = `${req.protocol}://${req.get('host')}`;
    res.render('login', { path });
  },

  login: async (req, res, next) => {
    try {
      let { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'Invalid email or password',
          data: null,
        });
      }

      if (!user.password && user.googleId) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'Silahkan login menggunakan google Oauth untuk login',
        });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'Invalid email or password',
          data: null,
        });
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY);

      res.status(200).json({
        status: true,
        message: 'OK',
        err: null,
        data: { user, token },
      });
    } catch (err) {
      next(err);
    }
  },

  whoami: async (req, res, next) => {
    res.status(200).json({
      status: true,
      message: 'OK',
      err: null,
      data: { user: req.user },
    });
  },

  googleOauth2: async (req, res, next) => {
    const token = jwt.sign({ id: req.user.id }, JWT_SECRET_KEY);

    let path = `${req.protocol}://${req.get('host')}`;
    let name = req.user.name;
    let email = req.user.email;
    res.render('home-callback', { path, name, email });
    // res.status(200).json({
    //   status: true,
    //   message: 'OK',
    //   err: null,
    //   data: { user: req.user, token },
    // });
  },
};
