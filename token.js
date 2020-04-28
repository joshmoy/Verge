const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const hashPassword = password => bcrypt.hashSync(password, salt);

const validateEmail = (email) => {
    const regEx = /\S+@\S+\.\S+/;
    return regEx.test(email);
};

const validatePassword = (password) => {
    if (password.length <= 6) {
        return false;
    } return true;
};

const comparePassword = (hashedPassword, password) => {
    return bcrypt.compareSync(password, hashedPassword)
}

const generateToken = ( id, email, first_name, last_name, state, is_admin) => {
    const key = process.env.SECRET_KEY;
    const token = jwt.sign({ id, email, first_name, last_name, state, is_admin }, key, { expiresIn: 86400 });
    return token;
}

module.exports = {
    hashPassword,
    validateEmail,
    validatePassword,
    generateToken,
    comparePassword
}
