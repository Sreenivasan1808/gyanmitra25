const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Schema } = mongoose;
const db = require("../index");

const User = new Schema({
  user_id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: [true, "Email-ID Already exist"], validate: [validator.isEmail, 'Please enter valid Email ID'] },
  gender: { type: String, required: true },
  password: { type: String, required: true, maxlength: [30, 'Password cannot exceed 30 characters'], select: false },
  phone: { type: String, required: true },
  role: { type: String, default: "user" },
  cname: { type: String, required: true },
  ccity: { type: String, required: true },
  eventPayed: { type: String, required: true, default: "Not Payed" },
  workshopPayed: { type: String, required: true, default: "Not Payed" },
  resetPasswordToken: { type: String },
  resetPasswordTokenExpire: { type: Date },
  createAt: { type: Date, default: Date.now },
});

// Function to generate the next user ID
User.statics.generateUserId = async function () {
  const lastUser = await this.findOne({}, {}, { sort: { 'createAt': -1 } });
  let lastUserId = lastUser ? lastUser.user_id : 'GM0000';
  const lastNumber = parseInt(lastUserId.replace('GM', ''), 10);
  const nextNumber = lastNumber + 1;
  return `GM${nextNumber.toString().padStart(4, '0')}`;
};

// Pre-save hook to set the user ID
User.pre('save', async function (next) {
  if (!this.isNew) {
    return next();
  }

  try {
    this.user_id = await this.constructor.generateUserId();
    next();
  } catch (error) {
    next(error);
  }
});

User.pre('save', async function (next) {
  // Only hash the password if it is modified or new
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

User.methods.getJwtToken = function () {
  return jwt.sign({ user_id: this.user_id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

User.methods.isValidPassword = async function (enteredpassword) {
  return bcrypt.compare(enteredpassword, this.password);
};

User.methods.getResetToken = function () {
  const token = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;
  return this.resetPasswordToken;
};

const UserModel = db.model("Users", User);

module.exports = UserModel;