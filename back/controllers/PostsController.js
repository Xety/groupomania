const db = require("../models");
const Post = db.Post;

class PostsController
{
    /**
     * Get all sauces.
     *
     * @param {object} req The request object.
     * @param {object} res The response object.
     *
     * @returns {void}
     */
     async index(req, res)
     {
        try {
            const posts = await Post.findAll({
                order: [['createdAt', 'DESC']]
            });

            return res.status(200).json(posts);

        } catch (error) {
                res.status(500).json({
                    message: error.message
                });
        };
     }
}

module.exports = PostsController;