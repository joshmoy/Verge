const moment = require("moment");
const queries = require('./query');
const db = require('./database');
const { hashPassword, generateToken, comparePassword } = require("./token");

async function createNewUser(body) {
    const date = new Date();
    const created_at = moment(date).format("YYYY-MM-DD HH:mm:ss");
    const { first_name, last_name, email, password, state } = body;
    const is_admin = false;
    const hashedPassword = hashPassword(password);
    const queryObj = {
        text: queries.addNewUser,
        values: [email, hashedPassword, first_name, last_name, state, created_at, created_at, is_admin],
    };
    try {
        const { rows } = await db.query(queryObj);
        const result = rows[0];
        const tokens = generateToken(result.id, result.email, result.first_name, result.last_name, result.state, result.is_admin);
        const data = {
            token: tokens,
            result: {
                id: result.id,
                email: result.email
            }
        }
        return Promise.resolve({
            status: "Success!",
            code: 201,
            message: `You have successfully signed up on Verge ${first_name} ${last_name}`, data
        })
    } catch (e) {
        console.log(e);
        return Promise.reject({
            status: "Error",
            code: 500,
            message: "Error signing up. Try again.",
        });
    }
}

async function createNewAdmin(body) {
    const d = new Date();
    const created_at = moment(d).format("YYYY-MM-DD HH:mm:ss");
    const { first_name, last_name, email, password, state } = body;
    const is_admin = true;
    const hashedPassword = hashPassword(password);
    const queryObj = {
        text: queries.addNewUser,
        values: [email, hashedPassword, first_name, last_name, state, created_at, created_at, is_admin],
    };
    try {
        const { rows } = await db.query(queryObj);
        const result = rows[0];
        const tokens = generateToken(result.id, result.email, result.first_name, result.last_name, result.state, result.is_admin);
        const data = {
            token: tokens,
            result: {
                id: result.id,
                email: result.email
            }
        }
        return Promise.resolve({
            status: "Success!",
            code: 201,
            message: `You have successfully created an admin with name: ${first_name} ${last_name}`, data
        })
    } catch (e) {
        console.log(e);
        return Promise.reject({
            status: "Error",
            code: 500,
            message: "Error signing up. Try again.",
        });
    }
}

async function checkIfUserDoesNotExistBefore(email) {
    const queryObj = {
        text: queries.findUserEmail,
        values: [email],
    }
    try {
        const { rowCount } = await db.query(queryObj);
        if (rowCount == 0) {
            return Promise.resolve();
        }
        if (rowCount > 0) {
            return Promise.reject({
                status: "error",
                code: 409,
                message: "Email Already Exists. Input another e-mail",
            });
        }
    } catch (e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error finding user",
        });
    }
}

async function checkIfUserExistById(id) {
    const queryObj = {
        text: queries.findUserId,
        values: [id],
    };
    try {
        const { rowCount } = await db.query(queryObj);
        if (rowCount == 0) {
            return Promise.reject({
                status: "error",
                code: 404,
                message: "User does not exist. Kindly use valid user.",
            });
        }
        if (rowCount > 0) {
            return Promise.resolve();
        }
    } catch (e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error finding user by Id",
        });
    }
}

async function checkEmailAndPasswordMatch(body) {
    const { email, password } = body;
    const queryObj = {
        text: queries.findUserEmail,
        values: [email],
    };
    try {
        const { rows } = await db.query(queryObj);
        const result = rows[0];
        if (!result) {
            return Promise.reject({
                status: "error",
                code: 404,
                message: "Email not found",
            });
        }
        if (!comparePassword(result.password, password)) {
            return Promise.reject({
                status: "error",
                code: 400,
                message: "Password is incorrect. Remember, password is case sensitive.",
            });
        }
        const tokens = generateToken(result.id, result.email, result.first_name, result.last_name, result.state, result.is_admin);
        const data = {
            token: tokens,
            result: {
                id: result.id,
                email: result.email
            }
        }
        return Promise.resolve({
            status: "success",
            code: 202,
            message: `Log in successful. Welcome!`, data
        })
    } catch (e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error finding user",
        });
    }
}

async function createNewParcel(user_id, body) {
    const d = new Date();
    const created_at = moment(d).format("YYYY-MM-DD HH:mm:ss");
    const status = "pending"
    const { price, weight, location, destination, sender_name, sender_note } = body;
    const queryObj = {
        text: queries.addParcel,
        values: [user_id, price, weight, location, destination, sender_name, sender_note, status, created_at, created_at],
    };
    try {
        const { rowCount } = await db.query(queryObj);
        if (rowCount == 0) {
            return Promise.reject({
                status: "error",
                code: 500,
                message: "Could not place order",
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                status: "success",
                code: 201,
                message: `Dear ${sender_name}, Your Parcel order has been created successfully`,
            });
        }
    } catch (e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error creating order",
        });
    }
}

async function changeOrderStatus(id, body) {
    const date = new Date();
    const updated_at = moment(date).format("YYYY-MM-DD HH:mm:ss");
    const { status } = body
    const queryObj = {
        text: queries.updateStatus,
        values: [status, updated_at, id]
    }
    try {
        const { rowCount } = await db.query(queryObj);
        if (rowCount === 0) {
            return Promise.reject({
                status: "error",
                code: 500,
                message: "Cannot find order Id."
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                status: "success",
                code: 202,
                message: "Parcel delivery status updated successfully",
            });
        }
    } catch (e) {
        console.log(e)
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error updating parcel delivery status"
        })
    }
}

async function checkStatus(id) {
    const queryObj = {
        text: queries.getStatus,
        values: [id],
    };
    try {
        const { rows } = await db.query(queryObj);
        if (rows[0].status == "pending") {
            return Promise.resolve();
        }
        if (rows[0].status !== "pending") {
            return Promise.reject({
                status: "error",
                code: 401,
                message: "Unauthorized. Parcel has been shipped"
            });
        }
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error finding user",
        });
    }
}

async function updateOrderDestination(user_id, id, body) {
    const date = new Date();
    const updated_at = moment(date).format("YYYY-MM-DD HH:mm:ss");
    const { destination } = body
    const queryObj = {
        text: queries.updateDestination,
        values: [destination, user_id, updated_at, id]
    }
    try {
        const { rowCount } = await db.query(queryObj);

        if (rowCount == 0) {
            return Promise.reject({
                status: "error",
                code: 500,
                message: "Order Id could not be found. Try again."
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                status: "success",
                code: 200,
                message: "Parcel delivery destination updated successfully!",
            });
        }
    } catch (e) {
        console.log(e)
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error updating parcel delivery destination"
        })
    }
}

async function updateOrderLocation(id, body) {
    const date = new Date();
    const updated_at = moment(date).format("YYYY-MM-DD HH:mm:ss");
    const { location } = body
    const queryObj = {
        text: queries.updateLocation,
        values: [location, updated_at, id]
    }
    try {
        const { rowCount } = await db.query(queryObj);

        if (rowCount == 0) {
            return Promise.reject({
                status: "error",
                code: 500,
                message: "Delivery location not found"
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                status: "success",
                code: 200,
                message: "Parcel delivery location updated successfully",
            });
        }
    } catch (e) {
        console.log(e)
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error updating parcel delivery location"
        })
    }
}

async function deleteParcel(id) {
    const queryObj = {
        text: queries.deleteParcel,
        values: [id],
    };
    try {
        const { rowCount } = await db.query(queryObj);
        if (rowCount == 0) {
            return Promise.reject({
                status: "erorr",
                code: 500,
                message: "Parcel order not found",
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                status: "success",
                code: 200,
                message: "Parcel delivery order has been successfully deleted"
            });
        }
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error deleting parcel",
        });
    }
}

async function getUserStatusById(id) {
    const queryObj = {
        text: queries.findParcelByUserId,
        values: [id]
    };
    try {
        const { rows } = await db.query(queryObj);
        if (rows[0].status === "pending") {
            console.log(rows[0].user_id);
            return Promise.resolve();
        }
        if (rows[0].status !== "pending") {
            return Promise.reject({
                status: "error",
                code: 401,
                message: "Unauthorized. Parcel has been shipped"
            });
        }
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error finding user",
        });
    }
}

async function getUserId(id) {
    const queryObj = {
        text: queries.getStatus,
        values: [id]
    };
    try {
        const { rows } = await db.query(queryObj);
        if (rows[0].user_id) {
            const result = rows[0].user_id;
            // console.log(result);
            return result;
        } 
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error finding user",
        });
    }
}

async function checkSuperAdmin(id) {
    const queryObj = {
        text: queries.findSuperAdmin,
        values: [id]
    };
    try {
        const { rowCount, rows } = await db.query(queryObj);
        if(rowCount === 0 ){
            return Promise.reject({
                status: "error",
                code: 400,
                message: "No user found"
            });
        }
        if(rowCount > 0){
            if (rows[0].email === "superAdmin@verge.com" && rows[0].is_admin === true) {
            return Promise.resolve();
        }
        if (rows[0].email !== "superAdmin@verge.com" || rows[0].is_admin === false) {
            return Promise.reject({
                status: "error",
                code: 401,
                message: "Unauthorised. You're not a super admin"
            });
        }
        }
        
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error finding super admin status",
        });
    }
}

async function getAllParcel() {
    const queryObj = {
        text: queries.findAllParcel,
    };
    try {
        const { rows } = await db.query(queryObj);
        return Promise.resolve({
            status: "success",
            code: 200,
            message: "Successfully fetched all parcels",
            data: rows,
        });
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error fetching all parcels",
        });
    }
}

async function getAllParcelByUser(user_id) {
    const queryObj = {
        text: queries.getAllParcelByUser,
        values: [user_id]
    };
    try {
        const { rows, rowCount } = await db.query(queryObj);
        if (rowCount === 0) {
            return Promise.reject({
                status: "erorr",
                code: 400,
                message: "You have not created any parcel delivery order.",
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                status: "success",
                code: 200,
                message: "Successfully fetched all your parcels",
                data: rows
            });
        }
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error getting all user parcel",
        });
    }
}

async function findUserParcel(id) {
    const queryObj = {
        text: queries.findUserParcel,
        values: [id],
    };
    try {
        const { rows, rowCount } = await db.query(queryObj);
        if (rowCount == 0) {
            return Promise.reject({
                status: "erorr",
                code: 500,
                message: "Not found",
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                status: "success",
                code: 200,
                message: "User Parcel Found",
                data: rows[0]
            });
        }
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error getting parcel",
        });
    }
}

module.exports = {
    createNewUser,
    checkIfUserDoesNotExistBefore,
    createNewAdmin,
    checkEmailAndPasswordMatch,
    createNewParcel,
    changeOrderStatus,
    checkStatus,
    updateOrderDestination,
    updateOrderLocation,
    deleteParcel,
    getAllParcel,
    findUserParcel,
    getUserStatusById,
    checkSuperAdmin,
    checkIfUserExistById,
    getAllParcelByUser,
    getUserId
};