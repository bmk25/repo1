const  express = require('express')
const  { login,register,logout,changePassword } = require( '../controllers/auth.js')
const { checkUserToken } =require( "../middleware/authentication.js");

const router = express.Router()


// what i
router.post("/login",login)
router.post("/register",register)
router.post("/logout",logout)
router.post("/changePassword",checkUserToken,changePassword)


module.exports = router;
