const router = require('express').Router();
const auth = require('./auth.routes');
const { index } = require('../controllers/index.controllers');

router.get('/', index);
router.use('/auth', auth);

module.exports = router;
