const db = require("../models");

class SignUpMiddleware
{

    async checkDuplicateEmail(req, res, next)
    {
        try {
            // Check if the mail is already used.
            let user = await db.User.findOne({
                where: {
                    email: req.body.email
                }
            });

            if (user) {
                return res.status(409).json({
                    message: "Email is already in use!"
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Unable to validate unique Email!"
            });
        }
    }

    checkPassword(req, res, next)
    {
        if (!req.body.password || req.body.password < 6) {
            return res.status(409).json({
                message: "Password must be at least 6 characters!"
            });
        }

        next();
    }
}

module.exports = SignUpMiddleware;