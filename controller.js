const { createNewUser,
    checkIfUserDoesNotExistBefore,
    checkEmailAndPasswordMatch,
    createNewAdmin,
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
} = require("./vergeService");

const { validateEmail, validatePassword } = require("./token");

const validateUserSignUpCredentials = (req, res, next) => {
    const { first_name, last_name, email, password, state } = req.body;
    if (!first_name || !last_name || !email || !password || !state) {
        return res.status(400).json({
            message: "Please fill all fields",
        });
    }
    if (!validateEmail(email)) {
        return res.status(400).json({
            message: "Please input a valid email"
        })
    }
    if (!validatePassword(password)) {
        return res.status(400).json({
            message: "Password must be at least 6 characters"
        })
    }
    next();
};

const signUpUser = async (req, res) => {
    const { email } = req.body;
    try {
        await checkIfUserDoesNotExistBefore(email);
        const result = await createNewUser(req.body);
        return res.status(201).json(result);
    } catch (e) {
        return res.status(e.code).json(e);
    }
};

const signUpAdmin = async (req, res) => {
    const { email } = req.body;
    const id = res.locals.user.id;
    try {
        await checkIfUserDoesNotExistBefore(email);
        await checkSuperAdmin(id);
        const result = await createNewAdmin(req.body);
        return res.status(201).json(result);
    } catch (e) {
        return res.status(e.code).json(e);
    }
};

const validateUserLoginCredentials = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Please fill all fields",
        });
    }
    if (!validateEmail(email)) {
        return res.status(400).json({
            message: "Please input a valid email"
        })
    }
    if (!validatePassword(password)) {
        return res.status(400).json({
            message: "Password must be at least 6 characters"
        })
    }
    next();
};

const loginUser = async (req, res) => {
    try {
        const result = await checkEmailAndPasswordMatch(req.body);
        return res.status(202).json(result);
    } catch (e) {
        return res.status(e.code).json(e);
    }
};

const validateParcelCredentials =  (req, res, next) => {
    const { price, weight, location, destination, sender_name, sender_note } = req.body;
    if (!price || !weight || !location || !destination || !sender_name || !sender_note) {
        return res.status(400).json({
            message: "Please fill all fields",
        });
    }
    next();
};

const createNewUserParcel = async (req, res, ) => {
    const user_id = res.locals.user.id;
    try {
        await checkIfUserExistById(user_id);
        const result = await createNewParcel(user_id, req.body);
        return res.status(201).json(result);
    } catch (e) {
        return res.status(e.code).json(e);
    }
};

const changeUserOrderStatus = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await changeOrderStatus(id, req.body);
        return res.status(200).json(result)
    } catch (e) {
        return res.status(e.code).json(e)
    }
};

const statusValidation = async (req, res, next) => {
    const {status} = req.body;
    if (status !== "processing" && status !== "shipped" && status !== "delivered"){
        return res.status(401).json({
            message: `You can not set status to '${status}'. Use 'processing', 'shipped' or 'delivered'.`
        })
    }
    next();
}

const updateUserOrderDestination = async (req, res) => {
    const { id } = req.params;
    const user_id = res.locals.user.id;
    const first_name = res.locals.user.first_name;
    try {
        const currentUserId = await getUserId(id);
        if(currentUserId === user_id){
            await checkStatus(id);
        const result = await updateOrderDestination(user_id, id, req.body);
        return res.status(200).json(result);
        }
        if(currentUserId !== user_id){
            return res.status(401).json({
                message: `Dear ${first_name}, You can only update destination of an order created by you`,
            });
        }        
    } catch (e) {
        return res.status(e.code).json(e)
    }
};

const updateUserOrderLocation = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await updateOrderLocation(id, req.body);
        return res.status(200).json(result)
    } catch (e) {
        return res.status(e.code).json(e)
    }
};

const validateId = (req, res, next) => {
    const { id } = req.params;
    if (!parseInt(id)) {
        return res.status(400).json({
            message: "Id must be an integer",
        });
    }
    next();
};

const deleteUserParcel = async (req, res) => {
    const { id } = req.params;
    try {
        await getUserStatusById(id);
        const currentUserId = await getUserId(id);
        const user_id = res.locals.user.id;
        const first_name = res.locals.user.first_name;
        if(currentUserId === user_id){
            const result = await deleteParcel(id);
            return res.status(200).json(result);
        }
        if(currentUserId !== user_id){
            return res.status(401).json({
                message: `Dear ${first_name}, You can only delete an order created by you`,
            });
        }
        
    } catch (e) {
        return res.status(e.code).json(e);
    }
};

const getAllUserParcelsByAdmin = async (req, res) => {
    try {
        const result = await getAllParcel();
        return res.status(200).json(result);
    } catch (e) {
        return res.status(e.code).json(e);
    }
};

const getSpecificParcel = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await findUserParcel(id);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(e.code).json(e);
    }
};

const getAllUsersParcel = async (req, res) => {
    const user_id = res.locals.user.id;
    try {
        const result = await getAllParcelByUser(user_id);
        return res.status(200).json(result)
    } catch (e) {
        return res.status(e.code).json(e)
    }
};

module.exports = {
    validateUserSignUpCredentials,
    signUpUser,
    signUpAdmin,
    validateUserLoginCredentials,
    loginUser,
    validateParcelCredentials,
    createNewUserParcel,
    changeUserOrderStatus,
    updateUserOrderDestination,
    updateUserOrderLocation,
    validateId,
    deleteUserParcel,
    getAllUserParcelsByAdmin,
    getSpecificParcel,
    getAllUsersParcel,
    statusValidation
}