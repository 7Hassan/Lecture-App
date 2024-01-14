

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from './pages/home/home'
import { Login } from "./pages/auth/login";
import "./styles/global.scss";
import { Register } from "./pages/auth/register";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useMemo, useState } from "react";
import { grades, url } from "./utils/variables";
import { User } from "./utils/interfaces";
import { AddLecture } from "./pages/addLecture/add";
import { Edit } from "./pages/edit/edit";
import { Loading } from "./utils/components";


const PopUser = ({ isAuth, setUser }: { isAuth: boolean }) => {
  const [popUp, setPopUp] = useState(false);
  const [userTemp, setUserTemp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cookie, setCookie] = useState(document.cookie);

  const setCookies = () => {
    const now = new Date();
    const expires = new Date(now.getTime() + 60 * 60 * 1000);
    document.cookie = `popUp=none; expires=${expires.toUTCString()}; path=/`;
    setCookie(document.cookie)
  }

  const cancel = () => {
    setCookies()
    setPopUp(false);
  }

  useEffect(() => {
    if (isAuth || !popUp || !userTemp || loading) return;
    setLoading(true);
    fetch(`${url}/auth/userTemp`, {
      method: 'GET',
      credentials: 'include',
      headers: { "Content-Type": "application/json" }
    })
      .then(async (res) => res.json())
      .then((res) => {
        setUserTemp(false);
        setLoading(false);
        if (!res.success) throw new Error(res.data.msg);
        setUser(res.data);
        setPopUp(false);
        setCookies();
      }).catch((err) => {
        setUserTemp(false)
        setLoading(false);
        toast.error(err.message);
      })
  }, [isAuth, loading, popUp, setUser, userTemp]);


  useEffect(() => {
    const timeoutId = setTimeout(() => { !isAuth && !cookie && setPopUp(true); }, 1000);
    return () => { clearTimeout(timeoutId) };
  }, [cookie, isAuth]);

  return <div className={`popup-user-temp ${popUp && "show"}`}>
    <div className="container">
      <div className="text">
        <span>  Welcome to our world!</span>
        <br />
        If you'd like to experience this web as an admin, please confirm this message.
      </div>
      <div className="buttons">
        {!isAuth && !cookie &&
          <>
            <button className="cancel" onClick={cancel}>cancel</button>
            <button onClick={() => setUserTemp(true)}>
              {!loading && "Confirm"}
              {loading && <Loading type="white" />}
            </button>
          </>
        }
      </div>
    </div>
  </div >
}

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
    <PopUser isAuth={isAuth} setUser={setUser} />
    <RouterProvider router={router} />
    <ToastContainer />
  </div>
}

export default App;



