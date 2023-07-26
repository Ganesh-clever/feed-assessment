// Imports 
import express, { Router } from "express"
import { userAuth } from "../Utils/globalFunction";
import { Login, createSuperAdmin, createUser, deleteUser, getUserDetails, giveFeedAccess, updateUser, viewLogDetails } from "../Controllers/userController";
const router : Router = express.Router();

// Routers
router.post('/super-admin/create',createSuperAdmin);
router.post('/login',Login);
router.post('/user/create',userAuth,createUser);
router.get('/get-user/:userId',userAuth,getUserDetails);
router.post('/update-user/:userId',userAuth,updateUser);
router.delete('/delete-user/:userId',userAuth,deleteUser);
router.get('/view-log',userAuth,viewLogDetails)
router.post('/grant-access',userAuth,giveFeedAccess);

export default router;
