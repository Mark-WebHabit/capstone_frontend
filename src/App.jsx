import { Routes, Route } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";

// components
import Home from "./views/Home";
import Contact from "./views/Contact";
import About from "./views/About";
import Mapping from "./views/Mapping";
import RenewPass from "./views/RenewPass";

import Login from "./views/Login";
import Register from "./views/Register";
import Profile from "./views/Profile";
import AuthLayout from "./layout/AuthLayout";
import MainLayout from "./layout/MainLayout";
import AdminLayout from "./layout/AdminLayout";
import Admin from "./views/Admin";
import Personnel from "./views/Personnel";
import Page404 from "./views/Page404";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, verifyUser } from "./features/authServices";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    const call = async () => {
      // verify the user here
      await dispatch(setUser());
      await dispatch(verifyUser());
    };
    call();
  }, []);

  useEffect(() => {
    if (location.pathname == "/") {
      navigate("/home");
    }
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} path="/" />
        <Route element={<Home />} path="/home" />
        <Route element={<Contact />} path="/contact" />
        <Route element={<About />} path="/about" />
        <Route element={<Mapping />} path="/mapping" />
        <Route element={<Profile />} path="/profile" />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Admin />} />
        <Route path="personnel" element={<Personnel />} />
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Login />} />
        <Route element={<Register />} path="register" />
        <Route element={<RenewPass />} path="renew_pass/:token" />
      </Route>

      <Route path="/*" element={<Page404 />} />
    </Routes>
  );
}

export default App;
