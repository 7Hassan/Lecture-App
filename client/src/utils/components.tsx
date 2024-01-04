
import dayjs from 'dayjs';
import { useState } from 'react';
import { format, addHours } from 'date-fns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import { Helmet } from "react-helmet";


export const Title = ({ title }: { title: string }) => <Helmet><title>{title}</title></Helmet>


export const Loading = ({ type }: { type: string }) => {
  return <>
    {type === "white" && <img src="https://firebasestorage.googleapis.com/v0/b/lecture-app-50d1c.appspot.com/o/loading-white.png?alt=media&token=16a18d86-e5d6-4cd6-9dc6-57d8bf2235db" alt="loading" className="loading" />}
    {type === "color" && <img src="https://firebasestorage.googleapis.com/v0/b/lecture-app-50d1c.appspot.com/o/loading.png?alt=media&token=c865cd13-2b2e-4a3c-b8d7-549d742a88b5" alt="loading" className="loading" />}
  </>
}

interface Time {
  $H: number;
  $d: Date;
}

interface Clock {
  evTime: {
    start: Date;
    end: Date;
  };
  setEvTime: ({ start, end }: { start: Date, end: Date }) => void;
}

interface Start {
  clock: {
    status: string;
    view: string;
    time: Time;
  }
  start: Time;
  changeTime: (date: Date) => void;
  setClock: React.Dispatch<React.SetStateAction<{
    status: string;
    view: string;
    time: Time;
  }>>;

}
interface End {
  clock: {
    status: string;
    view: string;
    time: Time;
  }
  end: Time;
  changeTime: (date: Date) => void;
  setClock: React.Dispatch<React.SetStateAction<{
    status: string;
    view: string;
    time: Time;
  }>>;
}


const Start = ({ clock, setClock, changeTime, start }: Start) => {
  const { status, view } = clock;

  const handleClick = (view: string) => setClock({ time: start, view, status: "start" });

  const handleClickZone = (zone: string) => {
    const obj = (zone === 'am') ? dayjs(addHours(start.$d, -12))
      : dayjs(addHours(start.$d, 12));
    changeTime(new Date(obj.$d));
    if (status === "start") setClock({ ...clock, time: obj })
  }


  return <div className="start">
    <span className='text'>Start</span>
    <div className="time">
      <div className="hours" >
        <span className={`text ${status === 'start' && view === 'hours' && 'clicked'}`}
          onClick={() => handleClick('hours')}>{format(start.$d, 'hh')}</span>
      </div>
      <div className="column">:</div>
      <div className="minutes" >
        <span className={`text ${status === 'start' && view === 'minutes' && 'clicked'}`}
          onClick={() => handleClick('minutes')}>{format(start.$d, 'mm')}</span> </div>
      <div className="AM-PM">
        <div className="am" ><span className={`text ${start.$H < 12 && 'clicked'}`}
          onClick={() => handleClickZone('am')}>AM</span> </div>

        <div className="pm" > <span className={`text ${start.$H >= 12 && 'clicked'}`}
          onClick={() => handleClickZone('pm')}>PM</span> </div>
      </div>
    </div>
  </div>
}

const End = ({ clock, setClock, changeTime, end }: End) => {
  const { status, view } = clock;

  const handleClick = (view: string) => setClock({ time: end, view, status: "end" });

  const handleClickZone = (zone: string) => {
    const obj = (zone === 'am') ? dayjs(addHours(end.$d, -12))
      : dayjs(addHours(end.$d, 12));
    changeTime(new Date(obj.$d));
    if (status === "end") setClock({ ...clock, time: obj })
  }

  return <div className="end">
    <span className='text'>End</span>
    <div className="time">
      <div className="hours">
        <span className={`text ${status === 'end' && view === 'hours' && 'clicked'}`}
          onClick={() => handleClick('hours')}>{format(end.$d, 'hh')}</span>
      </div>
      <div className="column">:</div>
      <div className="minutes">
        <span className={`text ${status === 'end' && view === 'minutes' && 'clicked'}`}
          onClick={() => handleClick('minutes')}>{format(end.$d, 'mm')}</span> </div>
      <div className="AM-PM">
        <div className="am" ><span className={`text ${end.$H < 12 && 'clicked'}`}
          onClick={() => handleClickZone('am')}>AM</span> </div>
        <div className="pm" > <span className={`text ${end.$H >= 12 && 'clicked'}`}
          onClick={() => handleClickZone('pm')}>PM</span> </div>

      </div>
    </div>
  </div>
}


export const Clock = ({ evTime, setEvTime }: Clock) => {
  const evTimeObj = { start: dayjs(evTime.start), end: dayjs(evTime.end) }
  const { start, end } = evTimeObj;
  const [clock, setClock] = useState({ time: start, view: 'hours', status: 'start' })
  const { view, status } = clock

  const handleChange = (time: Time) => {
    setClock({ ...clock, time })
    setEvTime({ ...evTime, [status]: new Date(time.$d) })
  }
  return <div className="clock">
    <div className="container-clock">
      <Start clock={clock} setClock={setClock} start={start}
        changeTime={(date: Date) => { setEvTime({ ...evTime, start: date }) }} />
      <End clock={clock} setClock={setClock} end={end}
        changeTime={(date: Date) => { setEvTime({ ...evTime, end: date }) }} />
    </div >
    <LocalizationProvider dateAdapter={AdapterDayjs} >
      <TimeClock value={clock.time} onChange={(newTime) => handleChange(newTime)} views={[view]} />
    </LocalizationProvider>
  </div >
};

