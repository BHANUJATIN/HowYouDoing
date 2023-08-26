import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./utils/AuthContext";

import Login from "./pages/Login";
import Room from "./pages/Room";
import Register from "./pages/Register";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path = "/register" element={<Register/>}/>
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Room />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
