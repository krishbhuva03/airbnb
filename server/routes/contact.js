import express from "express";
import { submitContact, getContacts } from "../controllers/contact.js";

const router = express.Router();

router.post("/submit", submitContact);
router.get("/messages", getContacts);

export default router;
