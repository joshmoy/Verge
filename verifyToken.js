const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")

dotenv.config()

const verifyToken = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.status(400).send("token is not provided")
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
        if (decoded.is_admin == false) {
            return res.status(401).send("You are not Authorized")
        }
        next();
    } catch (error) {
        console.log(error)
        return res.status(400).send("Authentication Failed")
    }
}

const verifyUserToken = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.status(400).send("token is not provided")
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
        if (decoded.is_admin !== false) {
            return res.status(401).send("You are not Authorized")
        }
        next();
    } catch (error) {
        console.log(error)
        return res.status(400).send("Authentication Failed")
    }
}

const getDetailsFromToken = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.status(400).send("token is not provided")
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
        return res.status(400).send("Getting details Failed")
    }
}
module.exports = {
    verifyToken,
    verifyUserToken,
    getDetailsFromToken
}