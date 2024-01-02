

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from './pages/home/home'
import { Login } from "./pages/auth/login";
import "./styles/global.scss";
import { Register } from "./pages/auth/register";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import { url } from "./utils/variables";
import axios from "axios";


function App() {
  const [user, setUser] = useState(null);
  console.log('🚀 ~ user:', user)

  useEffect(() => {
    axios.get(`${url}/api/user`)
      .then((res) => {
        if (!res.data.success) throw new Error(res.data.msg);
        setUser(res.data.data)
      }).catch(() => 0)
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />
    },
    {
      path: "login",
      element: <Login setUser={setUser} />
    },
    {
      path: "register",
      element: <Register setUser={setUser} />
    }
  ]);

  return <div className="app">
    <RouterProvider router={router} />
    <ToastContainer />
  </div>
}

export default App;