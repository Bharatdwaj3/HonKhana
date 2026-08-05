import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.ts";
import checkPermission from "../middleware/permission.middleware.ts";
import { issueFine } from "../controller/fine.controller.ts";

const router = Router();

router.post("/", authUser, checkPermission("issueFine"), issueFine);

export default router;
