import { asyncHandler } from "../utils/asyncHandler.js";
import { userModel } from "../models/user.model.js";
import { apierror } from "../utils/apiError.js";
import { apiresponse } from "../utils/apiResponse.js";



// generate referash and access token for authentication
const generateAccessRefreshToken = async function(userId){

     try {
      const user = await userModel.findById(userId)
      
      if (!user) {
        throw new apierror(400, "User not found");
      }

      // generate access and refresh tokens
      const accessToken = user.generateAccessToken();    
      const refreshToken = user.generateRefreshToken();    

      if (!accessToken || !refreshToken) {
        throw new apierror(400, "Token generation failed");
      }

      // add refreshToken in database
      user.refreshToken = refreshToken;

      // save refreshToken in database
      await user.save({validateBeforeSave: false})

      return {accessToken, refreshToken}; 

     } catch (error) {
          console.log(error);
          throw new apierror(500, "something went wrong");
     }

}


// Register function
 const registerUser = asyncHandler(async function(req, res) {
    const { userName, email, password, fullName } = req.body;
  
    // Check if required fields are empty
    if ([userName, email, password].some((field) => field?.trim() === "")) {
      return res.render("register", { errorMessage: "All fields are required!" });
    }
    
    // Check if user already exists
    const existingUser = await userModel.findOne({$or: [{email}, {userName}]});
    
    if (existingUser) {
        return res.render("register", { errorMessage: "User already exists!" });
    }
    
    // Create a new user
    const newUser = await userModel.create({
        userName: userName.toLowerCase(),
        email,
        password,
        fullName
    });
  
    if (!newUser) {
        return res.render("register", { errorMessage: "Something went wrong" });
    }
    
    // Redirect to login page after successful registration
    res.redirect("/login");
  });


// login function 
const loginUser = asyncHandler(async function(req, res) {
   
     const { email, password } = req.body;


     //check fields are empty   
      if ([email, password].some((field) => field?.trim() === "")) {
        return res.render("login", {errorMessage: "All fields are required!"})
      }

      // find user
       const findUser = await userModel.findOne({email})

       if(!findUser){
        return res.render("login", {errorMessage: "user not found!"})
       }

      // check increpted password
       const checkPassword = await findUser.isPasswordCurrect(password);

        if (!checkPassword) {
         return res.render("login", {errorMessage: "password is incurrect!"})
        }
        
        // generate tokens
        const {accessToken, refreshToken} =  await generateAccessRefreshToken(findUser._id);


        if (!accessToken || !refreshToken) {
          return res.render("login", {errorMessage: "token are undefined!"})
        }
        
  
        // for securety
        const options = {
          secure: true,
          httpOnly: true
        }

        // send token in cookie
         res.cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options) 

         const loggedInUser = await userModel.findById(findUser._id).select("-password -refreshToken")

           res.redirect("/profile");
        //  return res.render("profile", { user: loggedInUser })
})
  
// loggedOut function
const loggedOutUser = asyncHandler(async function(req, res){
  
     const updateUser  = await userModel.findByIdAndUpdate(
      req.user._id,
       {
        $set: {
          refreshToken: undefined
        },
      },
      {
        new: true
      }
    )

    const options = {
      secure: true,
      httpOnly: true
    }
    
    if(updateUser){
      return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options)
    }
    
    res.redirect("/login")

})

export {registerUser, loginUser, loggedOutUser} 
