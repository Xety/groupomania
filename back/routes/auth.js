const express = require('express');
const router = express.Router();
let AuthController = require ('../controllers/AuthController');
AuthController = new AuthController();

let SignUpMiddleware = require('../middlewares/SignUpMiddleware');
SignUpMiddleware = new SignUpMiddleware();

router.post('/signup', [
    SignUpMiddleware.checkDuplicateEmail,
    SignUpMiddleware.checkPassword
], AuthController.signup);
router.post('/signin', AuthController.signin);
router.post('/signout', AuthController.signout);
router.get('/login', AuthController.login);


module.exports = router;