import "./navbar.css";

import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);

 

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      // setErr(err.response.data)
      console.log(err);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <button className="report-button" onClick={()=>navigate("/changePass")}>ChangePass</button>
          <button className="report-button" onClick={()=>navigate("/")}>Home</button>

        </div>
       

        <div className="navbar-center">
          <center>
          </center>
        </div>
       
        <div className="navbar-right">
        <h1 className="name">{currentUser.name}</h1>
          <button
            className="logout-button"
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          >
            Logout
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
