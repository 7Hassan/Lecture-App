import { useTime } from "../../services/hooks/useTime";
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import "./main.scss"
import { differenceInMinutes, format, isBefore } from "date-fns";
import { Lecture as LectureInterface, Table } from "../../utils/interfaces";
import { Loading } from "../../utils/variables";


const RemainingLec = ({ duration, end }: { duration: number, end: Date }) => {
  const time = useTime()
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

const Lecture = ({ lec }: { lec: LectureInterface }) => {
  const time = new Date()
  const { name, start, end } = lec;
  const checkTime = isBefore(time, end)
  const duration = differenceInMinutes(end, start)

  return <div className="lecture">
    <div className="container-lec">
      <div className="calender">
        <div className="mon">{format(time, "MMM")}</div>
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
        checkTime && <RemainingLec duration={duration} end={new Date(end)} />
      }

    </div>
  </div>
}


export const UpcomingEvents = ({ table }: { table: Table | undefined }) => {
  const today = format(new Date(), "iiii") as keyof Table;
  const lectures = table?.[today];

  return <div className="upcoming-events">
    <div className="container">
      <div className="title">
        Upcoming Lectures
      </div>
      {!table && <Loading />}
      {
        Array.isArray(lectures) && lectures.map((lec: LectureInterface) => <Lecture lec={lec} key={lec._id} />)
      }
    </div>
  </div>
};
