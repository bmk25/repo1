import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css"; // Import your CSS file
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const val = {
    name: "",
    email: "",
    password: "",
  };

  const [inputs, setInputs] = useState(val);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    general: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{6,14}$/;
    return passwordRegex.test(password);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { ...errors };

    if (!inputs.name) {
      valid = false;
      newErrors.name = "Name is required";
    }

    if (!inputs.email || !validateEmail(inputs.email)) {
      valid = false;
      newErrors.email = "Please enter a valid email address";
    }

    if (!inputs.password || !validatePassword(inputs.password)) {
      valid = false;
      newErrors.password =
        "Password must be 6 to 14 characters long with at least one uppercase letter, one lowercase letter, and one special character";
    }

    if (valid) {
      try {
        const response = await axios.post(
          "http://localhost:8800/api/auth/register",
          inputs
        );

        if (response.status === 200) {
          navigate("/login");
          alert("Registration successful");
        } else {
          newErrors.general = "Registration failed. Please try again.";
        }
      } catch (err) {
        if (err.response && err.response.data) {
          newErrors.general =
            err.response.data.message|| "Registration failed. Please try again.";
        } else {
          newErrors.general =
            "An unexpected error occurred. Please try again later.";
        }
      }
    }

    setErrors(newErrors);
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <span>You already have an account?</span>
          <Link to="/login">
            <button className="login-button">Login</button>
          </Link>
        </div>

        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={inputs.name}
              onChange={handleChange}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
            {errors.general && <div className="error-message">{errors.general}</div>}
            <button className="register-button" onClick={handleClick}>
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
