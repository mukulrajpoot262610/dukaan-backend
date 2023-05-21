const router = require("express").Router();

const authController = require("../controllers/auth-controller");
const authMiddleware = require("../middlewares/auth-middleware");

router.post("/api/send-otp", authController.sendOtp);
router.post("/api/verify-otp", authController.verifyOtp);
router.post("/api/verify-admin-otp", authController.verifyAdminOtp);
router.get("/api/refresh", authController.refresh);
router.post("/api/logout", authMiddleware, authController.logout);
router.post("/api/login", authController.login);

// GOOGLE AUTH
router.get("/auth/google", authController.googleAuth);

module.exports = router;