import { Routes, Route } from "react-router-dom";

import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";
import Signup from "./Auth/Signup/Signup";
import Login from "./Auth/Login/Login";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<h1>About</h1>} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
