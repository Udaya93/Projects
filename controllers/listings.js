const Listing=require("../models/listing.js");
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const MAP_TOKEN=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: MAP_TOKEN });


module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  };

module.exports.renderForm=(req, res) => {
    res.render("listings/new.ejs");
  };
module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",
      populate:{path:"author"},
    }).populate("owner");
    if(!listing){
      req.flash("error","The listing you requested doesn't exsist");
      res.redirect("/listings");
    }
    //console.log(listing);'
    
    res.render("listings/show.ejs", { listing });
  };

  module.exports.createListing=async (req, res,next) => {
   let response= await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
      .send()
      // console.log(response.body.features[0].geometry.coordinates);
      // res.send("done!");

    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;//adding owner with listing
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
    const sl=await newListing.save();
    console.log(sl);
    req.flash("success","added new listing");
    res.redirect("/listings");
  
  };

  module.exports.editListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","The listing you requested doesn't exsist");
    res.redirect("/listings");
    }
    
    // Original image URL
    let originalurl = listing.image.url;
    // console.log("Original URL:", originalurl);

    // Transform the URL using Cloudinary transformation syntax
    originalurl = originalurl.replace("/upload", "/upload/h_300,w_250");
    //console.log("Transformed URL:", originalurl);

    req.flash("success","edited listing");
    res.render("listings/edit.ejs", { listing ,originalurl});
  };

  module.exports.updateListing=async (req, res) => {
    // if(!req.body.listing){
    //   throw new ExpressError(400,"Send Valid Data For Listing");
    //  }


      let { id } = req.params;
      let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
      if(req.file){
        
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
      }
      
      req.flash("success","updated  listing");
      res.redirect(`/listings/${id}`);
    }

  module.exports.destroyListing=async (req, res) => {
      let { id } = req.params;
      let deletedListing = await Listing.findByIdAndDelete(id);
      //console.log(deletedListing);
      req.flash("success","deleted new listing");
      res.redirect("/listings");
    };