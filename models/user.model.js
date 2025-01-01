import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    fullName: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function(next) {
  if(!this.isModified("password")) return next()
     this.password = await bcrypt.hash(this.password, 10)
      next()     
})

userSchema.methods.isPasswordCurrect = async function(password){
       return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken =  function(){
      return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName   
       },
       process.env.ACCESS_TOKEN_SECRET,
       {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
       }
)
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(

      {
        _id: this._id
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
    )

}

export const userModel = mongoose.model("User", userSchema)