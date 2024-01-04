import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheck, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react"
import "./main.scss"
import { User as UserInterface } from '../../utils/interfaces';
import { grades } from '../../utils/variables';
import { portSaid } from '../../assets/images';
interface NavProps {
  user: UserInterface | null
  grade: string | null;
  setGrade: React.Dispatch<React.SetStateAction<string | null>>;
  setUser: React.Dispatch<React.SetStateAction<UserInterface | null>>;

}

interface GradeProps {
  setGrade: React.Dispatch<React.SetStateAction<string>>;
  grade: string,
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  hidden: boolean,
}

const Auth = () => {
  return <div className="Auth">
    <Link to="login">
      <div className="login">
        Login
      </div>
    </Link>
  </div>
}

const Grade: React.FC<GradeProps> = ({ hidden, setHidden, grade, setGrade, gradeRef }) => {
  const menuRef = useRef();
  const handelClicking = (g: string) => {
    setGrade(g);
    setHidden(true);
  }

  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current.contains(e.target) &&
        !gradeRef.current.contains(e.target)) {
        setHidden(true)
      } else {
        setHidden(!hidden);
      }
    }
    document.addEventListener("mousedown", handler)
    return () => { document.removeEventListener("mousedown", handler) }
  })

  return <div className={`grade ${hidden && "hidden"}`} ref={menuRef}>
    <ul>
      {
        grades.map((g) => {
          return <li className={`${grade === g && "selected"}`}
            onClick={() => handelClicking(g)} key={g}>
            <p>
              {g} Grade
            </p>
            {
              grade === g &&
              <FontAwesomeIcon icon={faCheck} />
            }
          </li>
        })
      }
    </ul>
  </div>
}


const Logout = ({ setUser }: { setUser: React.Dispatch<React.SetStateAction<UserInterface | null>> }) => {
  const logout = () => {
    document.cookie = `jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    setUser(null)
  }

  return <div className="Auth" onClick={() => logout()}>
    <div className="logout">
      <p>Logout</p>
      <FontAwesomeIcon icon={faSignOut} />
    </div>
  </div>
}

export const Nav: React.FC<NavProps> = ({ grade, user, setGrade, setUser }) => {
  const [gradeScroll, setGradeScroll] = useState<boolean>(true);
  const gradeRef = useRef()
  return <>
    <div className="navbar">
      <Grade hidden={gradeScroll} setHidden={setGradeScroll} grade={grade}
        setGrade={setGrade} gradeRef={gradeRef} />
      <div className="container-st">
        <div className="logo">
          <img src={portSaid} alt="logo" />
        </div>
        <div className="content" >
          <div className="grade-hd" ref={gradeRef}>
            <p>{grade}</p>
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
          {user && <Logout setUser={setUser} />}
          {!user && <Auth />}
        </div>
      </div>
    </div >
  </>
};
