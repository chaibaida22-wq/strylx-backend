const adminMiddleware = (req, res, next) => {

    if (req.user.role !== "admin") {

        return res.status(403).json({
            success: false,
            message: "Accès réservé aux administrateurs"
        });

    }

    next();

};

export default adminMiddleware;