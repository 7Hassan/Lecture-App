import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { useState } from "react"
import "./main.scss"

interface NavProps {
  setGrade: React.Dispatch<React.SetStateAction<string>>;
  grade: string,
}

interface GradeProps extends NavProps {
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  hidden: boolean,
}


const User = () => {
  const admin = true;
  return <div className="user">
    <div className="image">
      <img src="image.PNG" alt="image" />
    </div>
    {!admin &&
      <div className="text">
        Hassan Hossam
      </div>
    }
  </div>
}

const Auth = () => {
  return <div className="Auth">
    <Link to="login">
      <div className="login">
        Login
      </div>
    </Link>
    <Link to="register">
      <div className="register">
        Resister
      </div>
    </Link>
  </div>
}

const Grade: React.FC<GradeProps> = ({ hidden, setHidden, grade, setGrade }) => {
  const grades = ["first", "second", "third", "fourth"];
  const handelClicking = (g: string) => {
    setGrade(g);
    setHidden(true);
  }

  return <div className={`grade ${hidden && "hidden"}`}>
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

export const Nav: React.FC<NavProps> = ({ grade, setGrade }) => {
  const user = true;
  const [gradeScroll, setGradeScroll] = useState<boolean>(true)
  return <>
    <div className="navbar">
      <Grade hidden={gradeScroll} setHidden={setGradeScroll} grade={grade} setGrade={setGrade} />
      <div className="container-st">
        <div className="logo">
          <img src="https://scontent.fcai26-1.fna.fbcdn.net/v/t39.30808-1/348260965_943018837014070_430687469408114676_n.jpg?stp=cp0_dst-jpg_p80x80&_nc_cat=101&ccb=1-7&_nc_sid=596444&_nc_ohc=EIRgtM-qZvUAX-k9FRm&_nc_ht=scontent.fcai26-1.fna&oh=00_AfAwZklCaHuuga-4mHIrajIPVr-NwRI1CdgjOGwx46ghOg&oe=658F9256" alt="logo" />
        </div>
        <div className="content">
          <div className="grade-hd" onClick={() => setGradeScroll(!gradeScroll)}>
            <p>{grade}</p>
            <FontAwesomeIcon icon={faChevronDown} />
          </div>

          {user && <User />}
          {!user && <Auth />}
        </div>
      </div>
    </div >
  </>
};
