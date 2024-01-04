
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from "react-router-dom"

import { useState, useMemo, useEffect } from "react"
import "./main.scss";
import { User } from '../../utils/interfaces';
import { toast } from 'react-toastify';
import { url } from '../../utils/variables';
import { Loading } from '../../utils/components';
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
export const Register = ({ setUser }: { setUser: React.Dispatch<React.SetStateAction<User | null>> }) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', code: '', email: '', password: '' })
  const { firstName, lastName, code, email, password } = form
  const isEmail = useMemo(() => emailRegex.test(email), [email])

  const isDisabledForm = useMemo(() => !firstName || !lastName || !email || !code
    || !password || !isEmail || password.length < 8,
    [firstName, lastName, email, code, password, isEmail]);

  const handleChange = (name: string, value: string) => setForm({ ...form, [name]: value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isDisabledForm && !loading) setLoading(true);
  }
  useEffect(() => {
    if (!loading || isDisabledForm) return;
    fetch(`${url}/auth/signup`, {
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
        navigate("/")
      }).catch((error) => {
        setLoading(false);
        toast.error(error.message);
      })
  }, [form, loading, setUser, isDisabledForm, navigate]);


  return <div className="auth">
    <div className="container-st">
      <div className="header">
        <Link to="/">
          <div className="img">
            <img src="https://firebasestorage.googleapis.com/v0/b/lecture-app-50d1c.appspot.com/o/portsaid.jpeg?alt=media&token=22a85153-3aa4-4383-b786-949b4dd3a8d7" alt="logo" />
          </div>
        </Link>
        <p className="welcome">Welcome in Our Community</p>
        <p>Please enter your detail to Sign up.</p>

      </div>
      <div className="form">
        <form action="POST" onSubmit={(e) => handleSubmit(e)}>
          <div className="input">
            <input type="text" placeholder='First Name' className="input-field" name="firstName"
              value={firstName} onChange={e => handleChange(e.target.name, e.target.value)} />
          </div>
          <div className="input">
            <input type="text" placeholder='Last Name' className="input-field" name="lastName"
              value={lastName} onChange={e => handleChange(e.target.name, e.target.value)} />
          </div>
          <div className="input">
            <input type="text" placeholder='Code' className="input-field" name="code"
              value={code} onChange={e => handleChange(e.target.name, e.target.value)} />
          </div>
          <div className="input">
            <input type="text" placeholder='Email' className="input-field" name="email"
              value={email} onChange={e => handleChange(e.target.name, e.target.value)} />
          </div>
          <Password password={password} handleChange={handleChange} />
          <div className="action">
            <button type='submit' disabled={isDisabledForm}
              className={`action-button ${isDisabledForm && 'disabled'}`}>
              {!loading && "Sign Up"}
              {loading && <Loading type="white" />}
            </button>
          </div>
        </form>
      </div>
      <div className="sign-up">
        <div className="text">
          having an account?
          <Link to="/login"> Login </Link>
        </div>
      </div>
    </div>
  </div>;
};
