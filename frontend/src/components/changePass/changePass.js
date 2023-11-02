import React, { useState } from 'react';
import axios from 'axios';
import './style.css'; // Import your CSS file for styling
import { Link, useNavigate } from "react-router-dom";

function ChangePassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Regular expression for password validation
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%^&*])(?=.{6,14})/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the new password against the pattern
    if (!passwordPattern.test(formData.newPassword)) {
      setError('Password must be 6-14 characters and include at least one lowercase letter, one uppercase letter, and one special character.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8800/api/auth/changePassword`, formData, {
        withCredentials: true,
      });
      setMessage(response.data.message);
      setError(null);
      navigate('/login');
    } catch (error) {
      setMessage(null);
      setError(error.response.data.error);
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password:</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required // Make the input required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required // Make the input required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required // Make the input required
          />
        </div>
        <button type="submit">Change Password</button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default ChangePassword;
