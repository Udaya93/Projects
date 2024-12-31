const express=require('express');
const router=express.Router({mergeParams:true});
const wrapasync=require("../utils/wrapasync.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {validateReview,isLoggedin,isReviewAuthor} =require("../middleware.js");
const Review=require("../models/review.js");
const Reviewcontroller=require('../controllers/reviews.js');

//Reviews
  //post  Review Route
  router.post("/",isLoggedin,validateReview,wrapasync(Reviewcontroller.createReview));
  
 

  //Delete Review Route
  router.delete("/:reviewId",isLoggedin,isReviewAuthor,wrapasync(Reviewcontroller.destroyReview));

module.exports=router;