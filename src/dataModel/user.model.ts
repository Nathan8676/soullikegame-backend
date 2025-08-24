import mongoose, { Schema, Document } from "mongoose";
import jwt, { type JwtPayload } from "jsonwebtoken"
import bcrypt from "bcrypt"

export interface User extends Document {
  userName: string
  password: string
  characterIds: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  characterIds: [{
    type: Schema.Types.ObjectId,
    ref: "Character"
  }]

}, { timestamps: true })


userSchema.pre<User>('save', async function(next) {
  if (!this.isModified("password")) next()
  this.password = await bcrypt.hash(this.password, 10)
})
userSchema.methods.compiarePassword = async function(password: string) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function() {
}
userSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    { id: this._id, userName: this.userName },
    process.env.JWT_SECRET || "secret", // 🔑 make sure to set this in .env TODO: Make Secret later
    { expiresIn: "1h" }
  );
};

export default mongoose.model<User>("User", userSchema)
