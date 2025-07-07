
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add an email'], 
    unique: true, 
    lowercase: true, 
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 8, 
    select: false
  },
  role: {
    type: String,
    enum: ['admin'], 
    default: 'admin'
  }
}, {
  timestamps: true 
});


userSchema.pre('save', async function(next) {
  
  if (!this.isModified('password')) {
    return next();
  }


  const salt = await bcrypt.genSalt(10); // Generate a salt (random string)
  this.password = await bcrypt.hash(this.password, salt); // Hash the password with the salt
  next(); // Move to the next middleware or save operation
});

// --- Mongoose Method to Compare Passwords ---
userSchema.methods.matchPassword = async function(enteredPassword) {
  
  return await bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model('User', userSchema);

module.exports = User;