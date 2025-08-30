import mongoose, { Schema, Document } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { config } from "../../gameSetting.config";

export interface IUser extends Document {
  userName: string
  password: string
  characterIds: Schema.Types.ObjectId[];
  refreshToken: string
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: false
  },
  characterIds: [{
    type: Schema.Types.ObjectId,
    ref: "Character"
  }]

}, { timestamps: true })


userSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified("password")) next()
  this.password = await bcrypt.hash(this.password, 10)
})
userSchema.methods.compiarePassword = async function(password: string) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
  if (!config.user.accessTokenSecret) {
    throw new Error("Missing accessTokenSecret in config");
  }
  if (!config.user.accessTokenExpiresIn) {
    throw new Error("Missing accessTokenExpiresIn in config");
  }
  return jwt.sign({
    _id: this._id, userName: this.userName
  }, config.user.accessTokenSecret!, { expiresIn: config.user.accessTokenExpiresIn as jwt.SignOptions["expiresIn"] });
};

userSchema.methods.generateRefreshToken = function() {
  return jwt.sign({
    _id: this._id,
  }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES as jwt.SignOptions["expiresIn"] })
}
export default mongoose.model<IUser>("User", userSchema)
