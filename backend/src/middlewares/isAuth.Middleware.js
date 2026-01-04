import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            console.log("No token found in cookies");
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            if (!decode || !decode.user) {
                console.log("Invalid token structure:", decode);
                return res.status(401).json({
                    message: "Invalid token",
                    success: false
                });
            }

            req.user = decode.user;
            next();
        } catch (jwtError) {
            console.error("JWT verification error:", jwtError);
            return res.status(401).json({
                message: "Invalid or expired token",
                success: false,
                error: jwtError.message
            });
        }
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