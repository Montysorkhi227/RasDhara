const express = require("express")
const { getAllUsers, registerController, loginController } = require("../controllers/UserController")
const router = express.Router()

router.get("/all-users",getAllUsers)
router.post("/signup",registerController)
router.post("/login",loginController)

module.exports = router

// localhost:3000/api/user/all-users
// localhost:3000/api/user/register
// localhost:3000/api/user/login