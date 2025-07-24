const bcrypt = require("bcryptjs");

const newPassword = "sri*1234";
bcrypt.hash(newPassword, 10, function (err, hash) {
  console.log("New hash:", hash);
});
