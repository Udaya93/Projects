const express=require('express');
const router = express.Router(); // Use express.Router()
const wrapasync = require("../utils/wrapasync.js");
const Listing=require("../models/listing.js");
const { isLoggedin } = require('../middleware.js');
const {isOwner,validateListing}=require("../middleware.js")
const Listingcontroller=require('../controllers/listings.js')
const multer  = require('multer');
const{storage}=require("../cloudconfig.js")
const upload = multer({ storage });

router
  .route("/")
  .get( wrapasync(Listingcontroller.index))
  .post( isLoggedin,upload.single('listing[image]'),validateListing,wrapasync(Listingcontroller.createListing)
 );
    // .post(upload.single('listing[image]'),(req,res)=>{
    //   res.send(req.file);
    // })

 //New route
 router.get("/new", isLoggedin,Listingcontroller.renderForm);


router
.route("/:id")
.get( wrapasync(Listingcontroller.showListing))
.put(isLoggedin,isOwner,upload.single('listing[image]'),validateListing,wrapasync(Listingcontroller.updateListing))
.delete( isLoggedin ,isOwner,wrapasync(Listingcontroller.destroyListing)
);
 
 //Edit Route
router.get("/:id/edit", isLoggedin,isOwner,wrapasync(Listingcontroller.editListing));

module.exports=router;

//phase 2
/*  
//Index Route
 router.get("/", wrapasync(Listingcontroller.index));
  //Create Route
router.post("/", isLoggedin,validateListing,wrapasync(Listingcontroller.createListing));
  
//Show Route
router.get("/:id", wrapasync(Listingcontroller.showListing));


  //Update Route
router.put("/:id",isLoggedin,isOwner,validateListing,wrapasync(Listingcontroller.updateListing));


  //Delete Route
router.delete("/:id", isLoggedin ,isOwner,wrapasync(Listingcontroller.destroyListing));
module.exports=router;

*/