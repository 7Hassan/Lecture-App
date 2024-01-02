
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom"

import { useState, useMemo } from "react"
import "./main.scss";
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
export const Register = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', grade: 'first', email: '', password: '' })
  const { firstName, lastName, grade, email, password } = form
  console.log('🚀 ~ grade:', grade)
  const isDisabledForm = useMemo(() => !firstName || !lastName || !email || !password, [firstName, lastName, email, password])
  const handleChange = (name: string, value: string) => setForm({ ...form, [name]: value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isDisabledForm) {
      console.log(form)
    }
  }


  return <div className="auth">
    <div className="container-st">
      <div className="header">
        <Link to="/">
          <div className="img">
            <img src="https://scontent.fcai26-1.fna.fbcdn.net/v/t39.30808-1/348260965_943018837014070_430687469408114676_n.jpg?stp=cp0_dst-jpg_p80x80&_nc_cat=101&ccb=1-7&_nc_sid=596444&_nc_ohc=EIRgtM-qZvUAX-k9FRm&_nc_ht=scontent.fcai26-1.fna&oh=00_AfAwZklCaHuuga-4mHIrajIPVr-NwRI1CdgjOGwx46ghOg&oe=658F9256" alt="logo" />
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
            <input type="text" placeholder='Email' className="input-field" name="email"
              value={email} onChange={e => handleChange(e.target.name, e.target.value)} />
          </div>
          <Password password={password} handleChange={handleChange} />
          <div className="action">
            <button type='submit' disabled={isDisabledForm}
              className={`action-button ${isDisabledForm && 'disabled'}`}>Sign Up</button>
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
