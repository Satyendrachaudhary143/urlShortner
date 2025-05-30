import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }

        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        if (!decode || !decode.user) {
            return res.status(401).json({
                message: "Invalid token",
                success: false
            });
        }
        
        req.id = decode.user._id;
        req.user = decode.user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({
            message: "Authentication failed",
            success: false,
            error: error.message
        });
    }
}

export default isAuthenticated;