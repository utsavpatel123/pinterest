import dotenv from "dotenv";
dotenv.config()
import { app } from "./app.js";
import { dbConnection } from "./db/dbConnection.js";

let port = process.env.PORT || 5000


dbConnection()
.then(function(){
    app.listen(port, function(){
        console.log(`server is running in port ${port}`);
    })
    app.use("error", function(error){
        console.log("server error", error);      
    })
})
.catch(function(){
 console.log("mongodb connection error in server file");
 
})

