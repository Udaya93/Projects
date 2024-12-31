const express=require('express');
const router=express.Router();
const User=require("../models/user");
const wrapasync=require("../utils/wrapasync.js");
const passport = require('passport');
const {saveRedirectUrl} =require("../middleware.js");
const Usercontroller=require('../controllers/users.js');


router
.route("/signup")
.get(Usercontroller.renderSignup)
.post(wrapasync(Usercontroller.signup)
);

router
.route("/login")
.get(Usercontroller.renderLogin)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",
    failureFlash:true,}),
    Usercontroller.login
);


router.get("/logout",Usercontroller.logout);
module.exports=router;

/* phase 2
router.get("/signup",Usercontroller.renderSignup);

router.post("/signup",wrapasync(Usercontroller.signup));

router.get("/login",Usercontroller.renderLogin);

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",
    failureFlash:true,}),
    Usercontroller.login
);
*/