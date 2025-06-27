const { verifyToken } = require("./jwtUtil");

const authMiddleware = (req, res, next) => {
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Invalid authorization header" });
    }

    console.log(authorizationHeader);
    const token = authorizationHeader.replace("Bearer ", "");
    console.log(token, !token, token == undefined);
    if (!token) {
        return res.status(401).json({ success: false, message: "Authorization token not found" });
    }

    try {
        const decoded = verifyToken(token);
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ success: false, login: true, message: "Session expired! Login again" });
    }
};

module.exports = authMiddleware;
