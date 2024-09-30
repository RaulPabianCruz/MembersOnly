const isAuth = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

const isAdmin = (req, res, next) => {
    if(req.isAuthenticated() && req.user.admin) {
        next();
    } else {
        res.status(401).json({ msg: 'You are not authorized to delete a message.' });
    }
}

module.exports = { isAuth, isAdmin };