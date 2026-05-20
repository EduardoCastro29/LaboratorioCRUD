import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";

import Login from "./pages/Login.jsx"; 
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
