import express from "express"
import path from "path"
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let app = express()

// Set views and view engine
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "ejs")

// Body parsing middleware
app.use(express.json({limit: "10mb"}))
app.use(express.urlencoded({limit: "10mb", extended: true}))
app.use(cookieParser())

// Static files
app.use(express.static(path.join(__dirname, 'public')));


// import Routers
import { userRouter } from "./router/user.router.js";
app.use("/user" , userRouter);


// static Routers
app.get("/login", function(req, res){
res.render("login");
})
app.get("/register", function(req, res){
res.render("register");
})
app.get("/feed", function(req, res){
res.render("feed");
})
app.get("/profile", function(req, res){
res.render("profile");
})


export {app}