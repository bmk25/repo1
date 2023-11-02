const { db } = require("../connect.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');

const handleDatabaseError = (err, res, message) => {
  console.error(message, err);
  return res.status(500).json({ error: 'Internal Server Error' });
};

exports.register = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const q = "SELECT * FROM users WHERE email = ?";
  const values = [req.body.email];

  db.query(q, values, (err, data) => {
    if (err) {
      return handleDatabaseError(err, res, 'Error while querying database');
    }

    if (data.length > 0) {
      return res.status(409).json({ message : 'User already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const insertQuery =
      "INSERT INTO users (name, email, password ) VALUES (?, ?, ?)";
    const insertValues = [
      req.body.name,
      req.body.email,
      hashedPassword,
    ];

    db.query(insertQuery, insertValues, (insertErr) => {
      if (insertErr) {
        return handleDatabaseError(insertErr, res, 'User registration failed');
      }

      return res.status(200).json({ message: 'User has been registered successfully' });
    });
  });
};
exports.login = (req, res) => {
  const q = "SELECT * FROM users WHERE email = ?";

  db.query(q, [req.body.email], (err, data) => {
    if (err) {
      return handleDatabaseError(err, res, 'Error while querying database');
    }

    if (data.length === 0) {
      return res.status(404).json({ message: "Email not found!" });
    }

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // Include a unique timestamp in the JWT payload
    const timestamp = Date.now();

    const token = jwt.sign({ id: data[0].id, timestamp }, process.env.JWT_SECRET || "secretkey");

    const { password, ...others } = data[0];

    res.cookie("accessToken", token, {
      httpOnly: true,
    });

    res.status(200).json(others);
  });
};


exports.logout = (req, res) => {
  const cookiesToClear = ["accessToken", "userRole"]; // Add all your cookie names here

  cookiesToClear.forEach((cookieName) => {
    res.clearCookie(cookieName, {
      secure: true,
      sameSite: "none",
    });
  });

  res.status(200).json({ message: "User has been logged out." });
};

exports.changePassword = (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Retrieve the user's current hashed password from the database based on the user's ID or email (depending on your authentication method).
  const userId = req.userId;

  // Query the database to get the current hashed password for the user
  const getPasswordQuery = 'SELECT password FROM users WHERE id = ?';

  db.query(getPasswordQuery, [userId], (err, results) => {
    if (err) {
      return handleDatabaseError(err, res, 'Error while querying database');
    }

    if (results.length !== 1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentHashedPassword = results[0].password;

    bcrypt.compare(currentPassword, currentHashedPassword, (compareErr, isMatch) => {
      if (compareErr) {
        return handleDatabaseError(compareErr, res, 'Password comparison error');
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: 'New password and confirm password do not match' });
      }

      bcrypt.genSalt(10, (saltErr, salt) => {
        if (saltErr) {
          return handleDatabaseError(saltErr, res, 'Error generating salt');
        }

        bcrypt.hash(newPassword, salt, (hashErr, hashedPassword) => {
          if (hashErr) {
            return handleDatabaseError(hashErr, res, 'Error hashing new password');
          }

          const updatePasswordQuery = 'UPDATE users SET password = ? WHERE id = ?';

          db.query(updatePasswordQuery, [hashedPassword, userId], (updateErr) => {
            if (updateErr) {
              return handleDatabaseError(updateErr, res, 'Password update failed');
            }

            return res.status(200).json({ message: 'Password has been updated successfully' });
          });
        });
      });
    });
  });
};
