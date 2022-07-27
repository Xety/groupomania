const fs = require("fs");
const db = require("../models");
const Post = db.Post;
const User = db.User;

class PostsController
{
    /**
     * Get all posts.
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

    /**
     * Get a single post.
     *
     * @param {object} req The request object.
     * @param {object} res The response object.
     *
     * @returns {void}
     */
     async show(req, res)
     {
        try {
            const post = await Post.findByPk(req.params.id);

            return res.status(200).json(post);
        } catch (error) {
                res.status(404).json({
                    message: error.message
                });
        };
     }

    /**
     * Handle the creation of a post.
     *
     * @param {object} req The request object.
     * @param {object} res The response object.
     *
     * @returns {object|void} The response object.
     */
    async create(req, res)
    {
         const postObject = JSON.parse(req.body.post);

         // Check if Multer has allowed the image or not.
         if (typeof req.file === 'undefined') {
             return res.status(400).json({
                 message: 'Image non autorisé'
             });
         }

        try {
            const createdPost = await Post.create({
                ...postObject,
                UserId: req.userId,
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            });
            if (createdPost) {
                return res.status(201).json({
                    message: "The post has been created successfully!"
                });
            }
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    /**
     * Handle the update of a post.
     *
     * @param {object} req The request object.
     * @param {object} res The response object.
     *
     * @returns {object} The response object.
     */
     async update(req, res)
     {
        try {
            const user = await User.findByPk(req.userId);
            if (user === null) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const post = await Post.findByPk(req.params.id);
            if (post === null) {
                return res.status(404).json({
                    message: "Post not found"
                });
            }

            if (post.UserId != user.id && user.is_admin == false) {
                return res.status(403).json({
                    message: "You're not the creator of the post or admin."
                });
            }

            const filename = post.imageUrl.split("/images/")[1];

            // The file is not allowed or the user has not changed the original file.
            if (typeof req.file === 'undefined')  {
                const postObject = {...JSON.parse(req.body.post),};

                Post.update({...postObject}, {
                    where: {
                        id: post.id
                    }
                });

                return res.status(201).json({
                    message: "The post has been updated successfully!"
                });
            } else {

                const postObject = {
                    ...JSON.parse(req.body.post),
                    imageUrl: `${req.protocol}://${req.get("host")}/images/${ req.file.filename }`,
                };

                // Delete the old file.
                fs.unlink(`images/${filename}`, () => {
                    Post.update({...postObject}, {
                        where: {
                            id: post.id
                        }
                    });

                    return res.status(201).json({
                        message: "The post has been updated successfully!"
                    });
                });
            }
        } catch (error) {
                res.status(500).json({
                    message: error.message
                });
        };
    }

    /**
     * Delete a post.
     *
     * @param {object} req The request object.
     * @param {object} res The response object.
     *
     * @returns {object} The response object.
     */
    async destroy(req, res)
    {
        try {
            const user = await User.findByPk(req.userId);
            if (user === null) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const post = await Post.findByPk(req.params.id);
            if (post === null) {
                return res.status(404).json({
                    message: "Post not found"
                });
            }

            if (post.UserId != user.id && user.is_admin == false) {
                return res.status(403).json({
                    message: "You're not the creator of the post or admin."
                });
            }

            const filename = post.imageUrl.split("/images/")[1]; // Get filename.

            // Delete the file then delete the post in database.
            fs.unlink(`images/${filename}`, () => {
                Post.destroy({
                    where: {
                      id: post.id
                    }
                });

                return res.status(201).json({
                    message: "The post has been deleted successfully!"
                });
            });
        } catch (error) {
                res.status(500).json({
                    message: error.message
                });
        };
    }

    /**
     * Rate a post.
     *
     * Description:
     *
     *       1 : like
     *     -1 : dislike
     *      0 : cancel like/dislike
     *
     * @param {object} req The request object.
     * @param {object} res The response object.
     *
     * @returns {object} The response object.
     */
    async rate(req, res)
    {
        const type = req.body.type;
        const userId = req.userId;

        const post = await Post.findByPk(req.body.id);

        //Get the array of users that like/disliked the post.
        const { usersLiked, usersDisliked } = post;

        switch (type) {
            case 1:
                // Check if the user has not already liked the post.
                if (usersLiked.includes(userId)) {
                    return res.status(409).json({
                        message: error.message
                    });
                };

                usersLiked.push(userId);
                break;

            case 0:
                // If the usersLike array contain the user id, that means the user has liked the post
                // else it was a dislike, and we must delete the id from the array.
                if (usersLiked.includes(userId)) {
                    const index = usersLiked.indexOf(userId);

                    usersLiked.splice(index, 1);
                } else {
                    const index = usersDisliked.indexOf(userId);

                    usersDisliked.splice(index, 1);
                }
                break;

            case -1:
                // Check if the user has not already disliked the post.
                if (usersDisliked.includes(userId)) {
                    return res.status(409).json({
                        message: error.message
                    });
                };

                usersDisliked.push(userId);
                break;

            default:
            res.status(400).json({
                message: error.message
            });
        }

        try {
            await Post.update(
                {
                    likes: usersLiked.length,
                    dislikes: usersDisliked.length,
                    usersLiked: usersLiked,
                    usersDisliked: usersDisliked
                },
                {
                    where: {
                        id: req.body.id
                    }
                }
            );

            return res.status(200).json({
                message: 'Like/Dislike mis à jour avec succès'
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
}

module.exports = PostsController;