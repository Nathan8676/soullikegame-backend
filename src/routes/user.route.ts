import { registerUser, loginUser, refreshAccessToken } from "../Controller/user.controller"
import { VerifyJWT } from "../utility/index.utility"
import router from "express/lib/router/index.js"

export const userRouter = router()

userRouter.post("/register", registerUser);

// login route
userRouter.post("/login", loginUser);

// logout route
// userRouter.post("/logout", VerifyJWT, logoutUser);

// automatic Login
userRouter.get("/refreshAccessToken", refreshAccessToken);

// Update User info
// userRouter.patch("/update-user", VerifyJWT, updateUser);

// change User Password in the Most secure way
// userRouter.patch("/changePassword", VerifyJWT, changeCurrentPassword);

// route for info on the current user
// userRouter.get("/current-user", VerifyJWT, getCurrentUser);


// // route for getting the user History
// userRouter.get("/history", VerifyJWT, getUserHistory);
//
// // making a Delete account request
// userRouter.get("/delete-account-request", VerifyJWT, deleteUserAccountRequest);
//
// // checking if the delete Account Request is Valid and Deleting the Account
// userRouter.get("/delete-account?token=:token", VerifyJWT, logoutUser, deleteUserAccountFromEmailToken);


