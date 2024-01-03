

import { Link, useNavigate } from "react-router-dom"
import { useState, useMemo, useEffect } from "react"
import { toast } from 'react-toastify';
import { url, days, grades } from '../../utils/variables';
import { Loading } from '../../utils/components';
import { Clock } from "../../utils/components";
import { isBefore, format, isSameHour, isSameMinute } from "date-fns";
import "./main.scss";



export const AddLecture = ({ globalGrade }: { globalGrade: string | null }) => {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const time = new Date();
  const [form, setForm] = useState({
    name: '', location: '', doctor: '',
    grade: globalGrade, day: format(time, 'EEEE'),
    start: time, end: time
  })
  const { name, location, doctor, day, grade, start, end } = form
  const checkTime = useMemo(() => !start || !end || isBefore(end, start) ||
    isSameMinute(start, end) && isSameHour(start, end), [start, end]);

  const isDisabledForm = useMemo(() => !name || !location || !doctor || !day ||
    !grade || checkTime,
    [name, location, doctor, day, grade, checkTime]);

  const handleChange = (name: string, value: string) => setForm({ ...form, [name]: value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isDisabledForm && !loading) setLoading(true);
  }
  useEffect(() => {
    if (!loading || isDisabledForm) return;
    fetch(`${url}/api/tables`, {
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
        setLoading(false);
        toast.success("Lecture Added", { autoClose: 2000 });
        setForm({
          name: '', location: '', doctor: '',
          grade, day, start: time, end: time
        })
      }).catch((error) => {
        setLoading(false);
        if (error.message === "Please login") return navigate("/login");
        toast.error(error.message);
      })
  }, [form, isDisabledForm, loading, navigate]);


  return <div className="auth">
    <div className="container-st">
      <div className="header">
        <Link to="/">
          <div className="img">
            <img src="https://scontent.fcai26-1.fna.fbcdn.net/v/t39.30808-1/348260965_943018837014070_430687469408114676_n.jpg?stp=cp0_dst-jpg_p80x80&_nc_cat=101&ccb=1-7&_nc_sid=596444&_nc_ohc=EIRgtM-qZvUAX-k9FRm&_nc_ht=scontent.fcai26-1.fna&oh=00_AfAwZklCaHuuga-4mHIrajIPVr-NwRI1CdgjOGwx46ghOg&oe=658F9256" alt="logo" />
          </div>
        </Link>
        <p className="welcome">Add lecture to <span>{grade} Grade</span></p>
        <p>Please enter lecture details</p>

      </div>
      <div className="form">
        <form action="POST" onSubmit={(e) => handleSubmit(e)}>
          <div className="input">
            <input type="text" placeholder='Name' className="input-field" name="name"
              value={name} onChange={e => handleChange(e.target.name, e.target.value)} />
          </div>
          <div className="input">
            <input type="text" placeholder='Location' className="input-field" name="location"
              value={location} onChange={e => handleChange(e.target.name, e.target.value)} />
          </div>
          <div className="input">
            <input type="text" placeholder='Doctor' className="input-field" name="doctor"
              value={doctor} onChange={e => handleChange(e.target.name, e.target.value)} />
          </div>
          <div className="input">
            <select id="selector" value={grade} className="input-field" name="grade"
              onChange={e => handleChange(e.target.name, e.target.value)} >
              {
                grades.map((grade) => {
                  return <option key={grade} value={grade}>{grade}</option>
                })
              }
            </select>
          </div>
          <div className="input">
            <select id="selector" value={day} className="input-field" name="day"
              onChange={e => handleChange(e.target.name, e.target.value)} >
              {
                days.map((day) => {
                  return <option key={day} value={day}>{day}</option>
                })
              }
            </select>
          </div>

          <div className="input">
            <Clock evTime={{ start, end }} setEvTime={({ start, end }: { start: Date, end: Date }) => setForm({ ...form, start, end })} />
          </div>

          <div className="action">
            <button type='submit' disabled={isDisabledForm}
              className={`action-button ${isDisabledForm && 'disabled'}`}>
              {!loading && "Add Lecture"}
              {loading && <Loading type="white" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>;
};
