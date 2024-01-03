

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from './pages/home/home'
import { Login } from "./pages/auth/login";
import "./styles/global.scss";
import { Register } from "./pages/auth/register";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useMemo, useState } from "react";
import { url } from "./utils/variables";
import { User } from "./utils/interfaces";


function App() {
  const [user, setUser] = useState<User | null>(null);
  const isAuth = useMemo(() => !!user, [user]);

  useEffect(() => {
    fetch(`${url}/api/user`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(async (res) => res.json())
      .then((res) => {
        if (!res.success) throw new Error(res.data.msg);
        setUser(res.data)
      }).catch(() => 0)
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home user={user} isAuth={isAuth} />
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