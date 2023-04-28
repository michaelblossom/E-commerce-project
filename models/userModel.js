const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please tell us your name"],
  },
  email: {
    type: String,
    required: [true, "please provide your email"],
    unique: true,
    lowercase: true,
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "passwords are not the same",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// hashing password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // this line of code simply means that if other fields in the current document such as email, name, etc are modifield excluding the password, the next middleware should run without encripting the password(password should be encripted only when it is modified)
  this.password = await bcrypt.hash(this.password, 12); //encrypting or hashing the password
  this.passwordConfirm = undefined; //this will delete password confirm field so that it will not be stored in the database
  next();
});

// this query will help us to only get the user that are not deleted(active:true)
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// creating a function that we check if the password that the user entered matched the one stotre stored in the database
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword); //we use compare() function because one of the passwords(userpassword) is encrypted already note that the function will return true or false again candidatepassword is the one that will be provided by the user while userPassword is the one in encrypted in the database
};

// function to check if the use changed the password after loged in
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  let changedTimestamp;
  if (this.passwordChangedAt) {
    changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
  }
  // console.log(this.passwordChangedAt, JWTTimestamp);
  return JWTTimestamp < changedTimestamp; //100 < 200

  // false means that password not changed
  return false;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
