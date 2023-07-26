import express, { Router } from "express"
import { userAuth } from "../Utils/globalFunction";
import { createFeed, deleteFeed, getAllFeedDetails, getFeedDetails, updateFeed } from "../Controllers/feedController";
const router : Router = express.Router();

router.post('/create/feed',userAuth,createFeed);
router.get('/get-feed/:feedId',userAuth,getFeedDetails);
router.get('/get-feed',userAuth,getAllFeedDetails);
router.post('/update-feed/:feedId',userAuth,updateFeed);
router.delete('/delete-feed/:feedId',userAuth,deleteFeed);

export default router;