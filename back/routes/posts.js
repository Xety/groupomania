const express = require('express');
const router = express.Router();
let AuthMiddleware = require('../middlewares/AuthMiddleware');
AuthMiddleware = new AuthMiddleware();

let MulterMiddleware = require('../middlewares/MulterMiddleware');
MulterMiddleware = new MulterMiddleware();

let PostsController = require ('../controllers/PostsController');
PostsController = new PostsController();

router.get('/', AuthMiddleware.verify, PostsController.index);
router.get('/:id', AuthMiddleware.verify, PostsController.show);
router.post('/', AuthMiddleware.verify, MulterMiddleware.create(), PostsController.create);
router.put('/:id', AuthMiddleware.verify, MulterMiddleware.create(), PostsController.update);
router.delete('/:id', AuthMiddleware.verify, PostsController.destroy);
router.post('/:id/rate', AuthMiddleware.verify, PostsController.rate);


module.exports = router;