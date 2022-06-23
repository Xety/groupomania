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
        if(req.session && req.session.user) {
            next();
        } else {
            res.status(403).send({
                message: 'You must be logged in.'
            });
        }
    }
}

module.exports = AuthMiddleware;
