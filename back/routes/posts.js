const express = require('express');
const router = express.Router();
let AuthMiddleware = require('../middlewares/AuthMiddleware');
AuthMiddleware = new AuthMiddleware();

let MulterMiddleware = require('../middlewares/MulterMiddleware');
MulterMiddleware = new MulterMiddleware();

let PostsController = require ('../controllers/PostsController');
PostsController = new PostsController();

router.get('/', AuthMiddleware.verify, PostsController.index);
/*router.get('/:id', AuthJwtMiddleware, SaucesController.show);
router.post('/', AuthJwtMiddleware, MulterMiddleware.create(), SaucesController.create);
router.put('/:id', AuthJwtMiddleware, MulterMiddleware.create(), SaucesController.update);
router.delete('/:id', AuthJwtMiddleware, SaucesController.destroy);
router.post('/:id/like', AuthJwtMiddleware, SaucesController.rate);*/


module.exports = router;