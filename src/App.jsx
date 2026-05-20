import { BrowserRouter as Router, Routes, Route } from "react-router";

import Login from "./pages/Login.jsx"; 
import Home from "./pages/Home.jsx";
import Book from "./pages/Book.jsx";


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Book />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
