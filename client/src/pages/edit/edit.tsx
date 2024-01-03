

import { Link, useNavigate, useParams } from "react-router-dom"
import { useState, useMemo, useEffect } from "react"
import { toast } from 'react-toastify';
import { url } from '../../utils/variables';
import { Loading } from '../../utils/components';
import { Clock } from "../../utils/components";
import { isBefore, isSameHour, isSameMinute } from "date-fns";
import "./main.scss";
import { Lecture } from "../../utils/interfaces";

interface Form {
  lecture: Lecture,
  setLecture: React.Dispatch<React.SetStateAction<Lecture>>;
}

export const Form = ({ lecture, setLecture }: Form) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const { name, location, doctor } = lecture;
  const start = useMemo(() => new Date(lecture.start), [lecture.start])
  const end = useMemo(() => new Date(lecture.end), [lecture.end])

  const checkTime = useMemo(() => !start || !end || isBefore(end, start) ||
    isSameMinute(start, end) && isSameHour(start, end), [start, end]);

  const isDisabledForm = useMemo(() => !name || !location || !doctor || checkTime,
    [name, location, doctor, checkTime]);

  const handleChange = (name: string, value: string) => setLecture({ ...lecture, [name]: value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isDisabledForm && !loading) setLoading(true);
  }
  useEffect(() => {
    if (!loading) return;
    fetch(`${url}/api/table/${lecture._id}`, {
      method: 'PUT',
      body: JSON.stringify(lecture),
      credentials: 'include',
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.success) throw new Error(res.msg);
        navigate("/")
        toast.success("Lecture Updated", { autoClose: 2000 })
        setLoading(false)

      }).catch((error) => {
        toast.error(error.message)
        setLoading(false);
      })
  }, [lecture, loading]);


  return <form action="POST" onSubmit={(e) => handleSubmit(e)}>
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
      <Clock evTime={{ start, end }}
        setEvTime={({ start, end }: { start: Date, end: Date }) =>
          setLecture({ ...lecture, start, end })} />
    </div>

    <div className="action">
      <button type='submit' disabled={isDisabledForm}
        className={`action-button ${isDisabledForm && 'disabled'}`}>
        {!loading && "Save"}
        {loading && <Loading type="white" />}
      </button>
    </div>
  </form>
};


export const Edit = () => {
  const param = useParams();
  const [lecture, setLecture] = useState<Lecture | null>(null)

  useEffect(() => {
    fetch(`${url}/api/table/${param.id}`, {
      method: 'GET',
      credentials: 'include',
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.success) throw new Error(res.msg);
        setLecture(res.data);
      }).catch((error) => {
        toast.error(error.message);
      })
  }, [param.id]);

  return <div className="auth">
    <div className="container-st">
      <div className="header">
        <Link to="/">
          <div className="img">
            <img src="https://scontent.fcai26-1.fna.fbcdn.net/v/t39.30808-1/348260965_943018837014070_430687469408114676_n.jpg?stp=cp0_dst-jpg_p80x80&_nc_cat=101&ccb=1-7&_nc_sid=596444&_nc_ohc=EIRgtM-qZvUAX-k9FRm&_nc_ht=scontent.fcai26-1.fna&oh=00_AfAwZklCaHuuga-4mHIrajIPVr-NwRI1CdgjOGwx46ghOg&oe=658F9256" alt="logo" />
          </div>
        </Link>
        <p className="welcome">Edit Lecture</p>
        <p>Please enter lecture details</p>

      </div>
      <div className={`form ${!lecture && "loading-st"}`}>
        {
          !lecture && <Loading type="color" />
        }
        {
          lecture && <Form lecture={lecture} setLecture={setLecture} />
        }
      </div>
    </div>
  </div>;
};
