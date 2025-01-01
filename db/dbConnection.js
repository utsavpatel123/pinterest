import mongoose from "mongoose";
import { dbName } from "./dbName.js";

export let dbConnection = async function(){

    try {
    
    let response = await mongoose.connect(`${process.env.DB_URL}/${dbName}`)
    
    if (response) {
        console.log(`the database connect successfully. ${response.connection.host}`);
    }
    else{
        console.log(`the database connect error. ${response}`);
    }

    } catch (error) {
        console.log("mongodb connection error", error);
        process.exit(1)
        
    }
}
