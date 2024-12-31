if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}



// console.log(process.env.SECRET);

const express=require("express");
const mongoose=require("mongoose");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
const ExpressError=require("./utils/ExpressError.js");
const engine = require('ejs-mate');
const session=require("express-session");
const MongoStore = require('connect-mongo');

const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const passportLocalMongoose = require('passport-local-mongoose');
const {isLoggedin} =require("./middleware.js")
const User=require("./models/user.js");

const listingRouter=require('./routes/listing.js');
const reviewRouter=require('./routes/review.js');
const userRouter=require("./routes/user.js")

const dburl =process.env.ATLASDB;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
      secret:process.env.SECRET,
    },
    touchAfter:24*3600,
  });

  store.on("error",(err)=>{
    console.log("ERROR in MONGO SESSION STORE",err);
  })

const sessionoptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

// app.get("/",(req,res)=>{
//     res.send("im root");
// });

app.use(session(sessionoptions));
app.use(flash()); //it should be written before routes
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/registerUser",async(req,res)=>{
    let fakeUser=new User({
        email:"student@gmail.com",
        username:"delta-student"
    });
    let newUser=await User.register(fakeUser,"helloworld");
    res.send(newUser);
})

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

//const Mongo_url='mongodb://127.0.0.1:27017/wanderlust'
//const dburl =process.env.ATLASDB;
console.log("Connecting to database with URL:", dburl);

main().then(()=>{
    console.log("connected");
})
.catch((err)=>{
console.log("error in connection",err);
})
async function main(){
    // await mongoose.connect(Mongo_url);
    await mongoose.connect(dburl);
} 
 app.use("/listings",listingRouter);
 app.use("/listings/:id/reviews",reviewRouter);
 app.use("/",userRouter)
// app.get("/testListing",async(req,res)=>{
//     let sample=new Listing({
//         title:"my villa",
//         description:"telangana",
//         price:5000,
//         location:"hyd",
//         country:"india"
//     })
    
//    await sample.save().then((res)=>{
//     console.log("saved");
//    })
//    .catch((err)=>{
//     console.log(err);
// })
//      res.send("success");
   
// })

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next)=>{
 let {statusCode=500,message="Something went wrong"}=err;
 res.status(statusCode).render("error.ejs",{message})
 //res.status(statusCode).send(message);
})
app.listen(8080,()=>{
    console.log("listening to server 8080");
});