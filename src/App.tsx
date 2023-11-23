import { Routes, Route } from "react-router-dom";

import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<h1>About</h1>} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default App;
