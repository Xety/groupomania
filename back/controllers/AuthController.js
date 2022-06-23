const bcrypt = require('bcrypt');
const db = require("../models");
const User = db.User;

class AuthController
{
    /**
     * Function to signup an user.
     *
     * @param {object} req The request object.
     * @param {object} res The response object.
     *
     * @returns {void}
     */
    async signup(req, res)
    {
        // Save User to Database
        try {
            const user = await User.create({
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 8),
            });
            if (user) {
                return res.status(201).json({
                    message: "Your account has been created successfully!"
                });
            }
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    /**
     * Function to signin an user.
     *
     * @param {object} req The request object.
     * @param {object} res The response object.
     *
     * @returns {void}
     */
    async signin(req, res)
    {
        try {
            const user = await User.findOne({
                where: {
                email: req.body.email,
                },
            });
            if (!user) {
                return res.status(404).json({
                    message: 'User not found!'
                });
            }

            // Check the password.
            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    message: 'Password incorrect',
                });
            }

            //Get users fields as object and delete password from the object then set in the session.
            const userWithoutPassword = user.get();
            delete userWithoutPassword.password;
            req.session.user = {...userWithoutPassword};

            return res.status(200).json({
                ...userWithoutPassword
            });

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        };
    }

    signout(req, res)
    {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send({
                    message: "'Could not log out.'"
                });
            }

            res.status(200).send({
                message: "You've been signed out!"
            });
        });
     };

    login(req, res)
     {
        if (req.session && req.session.user) {
            return res.status(200).send({
                loggedIn: true,
                user: req.session.user
            });
        }

        res.status(200).send({loggedIn: false})
     }
}

module.exports = AuthController;