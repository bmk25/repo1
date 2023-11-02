import Login from "./pages/login/Login";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
  Navigate,
  Link,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import "./App.css";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";
import Register from "./pages/register/Register";
import ChangePass from "./components/changePass/changePass";

function App() {
  const { currentUser } = useContext(AuthContext);

  const Layout = () => {
    return (
      <div className="light">
        <Navbar />
        <div>
          <Outlet />
        </div>
      </div>
    );
  };

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return (
        <div className="login-message">
          You must log in to access this page.
        </div>
      );
    }

    return children;
  };

  // Redirect user to the home page if already logged in
  const RedirectIfLoggedIn = () => {
    if (currentUser) {
      return <Navigate to="/" />;
    } else {
      return null;
    }
  };

  const router = createBrowserRouter([
    {
      path: "/login",
      element: (
        <>
          <RedirectIfLoggedIn />
          <Login />
        </>
      ),
    },
    {
      path: "/register",
      element: (
        <>
          <RedirectIfLoggedIn />
          <Register />
        </>
      ),
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/changePass",
          element: <ChangePass />,
        },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
