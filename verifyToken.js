const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")

dotenv.config()

const verifyToken = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.status(404).json({
            message: "token is not provided"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            first_name: decoded.first_name,
            last_name: decoded.last_name,
            state: decoded.state,
            is_admin: decoded.is_admin,
        }
        res.locals.user = req.user;
        if (decoded.is_admin == false) {
            return res.status(401).json({
                message: "You are not Authorized"
            })
        }
        next();
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: "Authentication Failed"
        })
    }
}

const verifyUserToken = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.status(404).json({
            message: "token is not provided"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            first_name: decoded.first_name,
            last_name: decoded.last_name,
            is_admin: decoded.is_admin,
            state: decoded.state
        }
        res.locals.user = req.user;
        if (decoded.is_admin !== false) {
            return res.status(401).json({
                message: "You are not Authorized to carry out this action"
            })
        }
        next();
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: "Authentication Failed"
        })
    }
}

const getDetailsFromToken = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.status(404).json({
            message: "token is not provided"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            first_name: decoded.first_name,
            last_name: decoded.last_name,
            state: decoded.state,
            is_admin: decoded.is_admin,
        }
        res.locals.user = req.user;
        next();
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: "Getting details Failed"
        })
    }
}
module.exports = {
    verifyToken,
    verifyUserToken,
    getDetailsFromToken
}