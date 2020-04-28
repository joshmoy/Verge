const express = require("express");
const router = express.Router();

const { verifyToken, verifyUserToken, getDetailsFromToken } = require("./verifyToken");
const {
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
    getAllUsersParcel
} = require("./controller");

router.post("/auth/signup", validateUserSignUpCredentials, signUpUser);
router.post("/auth/signup/admin", validateUserSignUpCredentials, signUpAdmin);
router.post("/auth/login", validateUserLoginCredentials, loginUser);
router.post("/parcel", validateParcelCredentials, getDetailsFromToken, createNewUserParcel);
router.put("/parcel/status/change/:id", verifyToken, changeUserOrderStatus);
router.put("/parcel/destination/change/:id", verifyUserToken, getDetailsFromToken, updateUserOrderDestination);
router.put("/parcel/location/change/:id", verifyToken, updateUserOrderLocation);
router.delete("/parcel/cancel/:id", validateId, verifyUserToken, deleteUserParcel);
router.get("/parcel/all", verifyToken, getAllUserParcelsByAdmin);
router.get("/parcel/:id", validateId, getDetailsFromToken, getSpecificParcel);
router.get("/parcel", getDetailsFromToken, getAllUsersParcel);


module.exports = router;