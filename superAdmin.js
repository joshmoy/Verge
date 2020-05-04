const moment = require("moment");
const queries = require('./query');
const db = require('./database');
const { hashPassword, generateToken } = require("./token");



async function createSuperAdmin(email) {
    const queryObj = {
        text: queries.findUserEmail,
        values: [email],
    };
    const { rowCount } = await db.query(queryObj);
    if (rowCount == 0) {
        const date = new Date();
        const created_at = moment(date).format("YYYY-MM-DD HH:mm:ss");
        const password = "Yahoomail"
        const hashedPassword = hashPassword(password);
        const queryObj = {
            text: queries.addNewUser,
            values: ["superAdmin@verge.com", hashedPassword, "Joshua", "Miyachi", "Lagos", created_at, created_at, true],
        };
        const { rows } = await db.query(queryObj);
        const result = rows[0];
        const tokens = generateToken(result.id, result.email, result.first_name, result.last_name, result.state, result.is_admin);
    }
}
createSuperAdmin();