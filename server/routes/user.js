import express from "express";
import{
    AddToFavorites,
    GetUserFavorites,
    RemoveFromFavourates,
    SignIn,
    SignUp,
    BookProperty,
    GetBookedProperty
} from "../controllers/user.js";
import { verifyToken } from "../middlewares/verifyToken.js";


const router = express.Router();

router.post("/signup", SignUp);
router.post("/signin", SignIn);
router.post("/addToFavorites", [verifyToken], AddToFavorites);
router.get("/getFavorites", [verifyToken], GetUserFavorites);
router.post("/removeFavourite", [verifyToken], RemoveFromFavourates)
router.post("/booking", [verifyToken], BookProperty)
router.get("/getBooking",[verifyToken], GetBookedProperty)

export default router;
