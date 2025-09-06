import "./App.css";
import { Navigate, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import MainPage from "../pages/Mainpage";
import Login from "../pages/Login";
import Registration from "../pages/Registration";
import Tips from "../pages/Tips";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import UserProfile from "../pages/UserProfile";
import SavedTips from "../pages/SavedTips";
import AboutUs from "../pages/AboutUs";
import SavedOutfits from "../pages/SavedOutfits";
import BodyTypeCalculator from "../pages/BodyTypeCalculator";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/main"
          element={
            <ProtectedRoutes>
              <MainPage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/saved/:userId"
          element={
            <ProtectedRoutes>
              <SavedTips />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/saved-outfits/:userId"
          element={
            <ProtectedRoutes>
              <SavedOutfits />
            </ProtectedRoutes>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/tips" element={<Tips />} />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoutes2>
              <ForgotPassword />
            </ProtectedRoutes2>
          }
        />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/resetpassword/:id" element={<ResetPassword />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/bodytype" element={<BodyTypeCalculator />} />
      </Routes>
    </>
  );
}

export function ProtectedRoutes(props) {
  if (localStorage.getItem("user")) {
    return props.children;
  } else {
    return <Navigate to="/" />;
  }
}

export function ProtectedRoutes2(props) {
  if (localStorage.getItem("forgot")) {
    return props.children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default App;
