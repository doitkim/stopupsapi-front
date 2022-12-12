import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import LoginLayOut from "../Pages/Login";
import Register from "../Pages/Register";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginLayOut />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<LoginLayOut />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
