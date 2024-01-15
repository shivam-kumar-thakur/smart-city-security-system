import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const userRouter = Router();

import { registerUser } from "../controller/user.controller.js";
import { loginUser } from "../controller/user.controller.js";
import { logoutUser } from "../controller/user.controller.js";
import { refreshAccessToken } from "../controller/user.controller.js";
import { changeCurrentPassword } from "../controller/user.controller.js";
import { getCurrentUser } from "../controller/user.controller.js";
import { addData } from "../controller/user.controllers.js";

// Secured routes
userRouter.route("/register").post(registerUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/change-password").post(verifyJWT, changeCurrentPassword);
userRouter.route("/current-user").get(verifyJWT, getCurrentUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/addData").post(verifyJWT,addData);

export default userRouter;
