
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom"
import "./main.scss";
import { user } from '../../utils/interfaces';
import { Loading, url } from '../../utils/variables';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Password = ({ password, handleChange }: { password: string, handleChange: (name: string, value: string) => void }) => {
  const [passShow, setPassShow] = useState(false)

  return <div className="input password">
    <input type={passShow ? 'text' : 'password'} className="input-field" placeholder='Password'
      name="password" value={password} onChange={e => handleChange(e.target.name, e.target.value)} />
    <i className="fa-solid fa-eye-slash"></i>
    <div className='icons' onClick={() => setPassShow(!passShow)}>
      <FontAwesomeIcon icon={passShow ? faEye : faEyeSlash} />
    </div>
  </div>
}






export const Login = ({ setUser }: { setUser: React.Dispatch<React.SetStateAction<user | null>> }) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' })
  const { email, password } = form;
  const isEmail = useMemo(() => emailRegex.test(email), [email])
  const isDisabledForm = useMemo(() => !email || !password || !isEmail || password.length < 8,
    [email, password, isEmail]);
  const handleChange = (name: string, value: string) => setForm({ ...form, [name]: value })
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isDisabledForm && !loading) setLoading(true);
  }
  navigate("/");
  useEffect(() => {
    if (!loading || isDisabledForm) return;
    fetch("http://localhost:8000/auth/login", {
      method: 'POST',
      body: JSON.stringify(form),
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error(data.msg);
        setUser(data.data);
        
        setLoading(false);
      }).catch((error) => {
        setLoading(false);
        toast.error(error.message);
      })
  }, [form, loading, setUser, isDisabledForm]);

  return <div className="auth">
    <div className="container-st">
      <div className="header">
        <Link to="/">
          <div className="img">
            <img src="https://scontent.fcai26-1.fna.fbcdn.net/v/t39.30808-1/348260965_943018837014070_430687469408114676_n.jpg?stp=cp0_dst-jpg_p80x80&_nc_cat=101&ccb=1-7&_nc_sid=596444&_nc_ohc=EIRgtM-qZvUAX-k9FRm&_nc_ht=scontent.fcai26-1.fna&oh=00_AfAwZklCaHuuga-4mHIrajIPVr-NwRI1CdgjOGwx46ghOg&oe=658F9256" alt="logo" />
          </div>
        </Link>
        <p className="welcome">Welcome back</p>
        <p>Please enter your detail to sign in.</p>

      </div>
      <div className="form">
        <form action="POST" onSubmit={(e) => handleSubmit(e)}>
          <div className="input">
            <input type="text" placeholder='Email' className="input-field" name="email"
              value={email} onChange={e => handleChange(e.target.name, e.target.value)} />
          </div>
          <Password password={password} handleChange={handleChange} />
          <div className="action">
            <button type='submit' disabled={isDisabledForm}
              className={`action-button ${isDisabledForm && 'disabled'}`}>
              {!loading && "Sign in"}
              {loading && <Loading type="white" />}
            </button>
          </div>
        </form>
      </div>
      <div className="sign-up">
        <div className="text">
          Don't have an account yet?
          <Link to="/register"> Sign Up </Link>
        </div>
      </div>
    </div>
  </div>;
};
