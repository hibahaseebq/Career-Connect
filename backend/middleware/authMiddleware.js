// Middleware function to check if user is authenticated
function isAuthenticated(req, res, next) {
    // If user is authenticated, proceed to the next middleware
    if (req.isAuthenticated()) {
        return next();
    }
    // If user is not authenticated, redirect to login page or return an unauthorized error
    res.status(401).json({ message: 'Unauthorized' });
}

module.exports = isAuthenticated;
