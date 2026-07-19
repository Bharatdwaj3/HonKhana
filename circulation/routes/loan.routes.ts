import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.ts";
import checkPermission from "../middleware/permission.middleware.ts";
import { borrowBook, returnBook, listMyLoans, listAllLoans } from "../controller/loan.controller.ts";

const router = Router();

router.post("/", authUser, checkPermission("borrowBook"), borrowBook);
router.put("/:id/return", authUser, checkPermission("returnBook"), returnBook);
router.get("/mine", authUser, checkPermission("viewLoan"), listMyLoans);
router.get("/", authUser, checkPermission("listLoan"), listAllLoans);

export default router;