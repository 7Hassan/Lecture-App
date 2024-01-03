import { useTime } from "../../services/hooks/useTime";
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import { differenceInMinutes, format, isBefore } from "date-fns";
import { Lecture as LectureInterface, Table } from "../../utils/interfaces";
import { Loading } from "../../utils/components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import "./main.scss"


const RemainingLec = ({ duration, end }: { duration: number, end: Date }) => {
  const time = new Date()
  const liveDiff = differenceInMinutes(end, time)
  const percentage = ((duration - liveDiff) / duration) * 100;

  return <div className="lec-remaining">
    <CircularProgressbarWithChildren value={percentage}
      styles={buildStyles({
        strokeLinecap: 'round',
        pathTransitionDuration: 0.5,
        pathColor: '#049F9A',
        trailColor: '#CCECEA',
      })}
    >
    </CircularProgressbarWithChildren>
  </div>
}

const Lecture = ({ lec, completed }: { lec: LectureInterface, completed: boolean }) => {
  const time = new Date()
  const { name } = lec;
  const start = new Date(lec.start)
  const end = new Date(lec.end)
  const duration = differenceInMinutes(end, start)

  return <div className="lecture">
    <div className="container-lec">
      <div className="calender">
        <div className="mon">{format(time, "iii")}</div>
        <div className="day">{format(time, "ii")}</div>
      </div>
      <div className="inf">
        <div className="title" title={name}>
          {name}
        </div>
        <div className="date">
          {format(start, "p")} - {format(end, "p")}
        </div>
      </div>
      {
        completed && <div className="icon"><FontAwesomeIcon icon={faCheck} /></div>
      }
      {
        !completed && <RemainingLec duration={duration} end={new Date(end)} />
      }

    </div>
  </div>
}


export const UpcomingEvents = ({ table }: { table: Table | undefined }) => {
  const today = format(new Date(), "iiii") as keyof Table;
  const lectures = table?.[today];
  const time = useTime()
  Array.isArray(lectures) && lectures.sort((a, b) => new Date(a.start) - new Date(b.start));

  return <div className="upcoming-events">
    <div className="container">
      <div className="title">
        Upcoming Lectures
      </div>
      {!table && <Loading type="color" />}
      {
        Array.isArray(lectures) &&
        lectures.map((lec: LectureInterface) => isBefore(time, new Date(lec.end))
          && <Lecture lec={lec} key={lec._id} completed={false} />)
      }
      {
        Array.isArray(lectures) &&
        lectures.map((lec: LectureInterface) => !isBefore(time, new Date(lec.end)) &&
          <Lecture lec={lec} key={lec._id} completed={true} />)
      }
    </div>
  </div>
};
