const isAuthenticated = (req, res, next) => {
    if ( req.session.userId) {
        return next();
    }
   // res.status(401).json({ message: 'Unauthorized' });
   // Redirect to login page if not authenticated
    res.redirect('/login');
};

module.exports = { isAuthenticated };