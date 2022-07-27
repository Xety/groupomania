const Jwt = require('jsonwebtoken');

class AuthMiddleware
{
    /**
     * Verify that the user is connected by cheking the session.
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    verify(req, res, next)
    {
        // We get the header and do various test to get the token.
        const bearerHeader = req.headers["authorization"];

        if (typeof bearerHeader === 'undefined') {
            return res.status(403).send({
                message: "No token provided!"
            });
        }

        const token = bearerHeader.split(' ')[1];

        if (typeof token === 'undefined') {
            return res.status(403).send({
                message: "No token provided!"
            });
        }

    // We verify the token.
    Jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "Unauthorized!"
                });
            }

            // Assign the userId to the request so we can use it in our controllers.
            req.userId = decoded.userId;

            next();
        });
    }
}

module.exports = AuthMiddleware;
