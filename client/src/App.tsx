

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from './pages/home/home'
import { Login } from "./pages/auth/login";
import "./styles/global.scss";
import { Register } from "./pages/auth/register";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useMemo, useState } from "react";
import { grades, url } from "./utils/variables";
import { User } from "./utils/interfaces";
import { AddLecture } from "./pages/addLecture/add";
import { Edit } from "./pages/edit/edit";


function App() {
  const [user, setUser] = useState<User | null>(null);
  const isAuth = useMemo(() => !!user, [user]);
  const [grade, setGrade] = useState<string | null>(localStorage.getItem('grade'));

  useEffect(() => {
    const index = grades.findIndex((g) => g === grade);
    if (index < 0 || !grade) return;
    localStorage.setItem('grade', grade);
  }, [grade])


  useEffect(() => {
    const index = grades.findIndex((g) => g === grade);
    if (index < 0) {
      localStorage.setItem('grade', 'first');
      setGrade("first");
    }

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
      element: <Home user={user} isAuth={isAuth} grade={grade} setGrade={setGrade} setUser={setUser} />
    },
    {
      path: "login",
      element: <Login setUser={setUser} />
    },
    {
      path: "register",
      element: <Register setUser={setUser} />
    },
    {
      path: "/addLecture",
      element: <AddLecture globalGrade={grade} />
    },
    {
      path: "/:id",
      element: <Edit />
    }
  ]);

  return <div className="app">
    <RouterProvider router={router} />
    <ToastContainer />
  </div>
}

export default App;