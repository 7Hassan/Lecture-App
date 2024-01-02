
import { format } from "date-fns";
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Lecture as LectureInterface, Table as TableInterface } from "../../utils/interfaces";
import "./main.scss"
import { Loading } from "../../utils/variables";

const Action = () => {
  const [loading, setLoading] = useState(false);

  return <td className="actions">
    <div className="edit">
      <Link to="">
        <img src="edit.png" alt="edit" />
      </Link>
    </div>
    <div className="remove" onClick={() => setLoading(!loading)}>
      {!loading &&
        <img src="remove.png" alt="remove" />
      }

      {
        loading && <Loading />
      }
    </div>
  </td>
}

const Lecture = ({ lec }: { lec: LectureInterface }) => {
  const { name, location, doctor, start, end } = lec;
  const admin = true;
  return <tr className="lec">
    <td></td>
    <td> {name}</td>
    <td>{doctor}</td>
    <td>{location}</td>
    <td>{format(start, "p")} - {format(end, "p")}</td>
    {admin && <Action />}
  </tr>
}


const TableBody = ({ table }: { table: TableInterface | undefined }) => {
  const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  return <tbody>
    {
      days.map((d) => {
        const day = d as keyof TableInterface
        const lectures = table?.[day];
        return <React.Fragment key={day}>
          <tr className="day" >
            <th scope="row">{day}</th>
          </tr>
          {
            Array.isArray(lectures) && lectures.map((lec: LectureInterface) => <Lecture key={lec._id} lec={lec} />)
          }
        </React.Fragment>
      })
    }
  </tbody>
}


export const Table = ({ table }: { table: TableInterface | undefined }) => {

  return <div className="table">
    <div className="btns">
      <button className="export">
        <img src="arrow.png" alt="arrow" />
        <p>
          Export
        </p>
      </button>
      <button>
        Add Lecture
      </button>
    </div>

    <div className="container">
      <div className="title">
        Lecture Table
      </div>
      <div className="cont-table">
        <table >
          <thead>
            <tr>
              <th scope="col"> </th>
              <th scope="col">Lecture</th>
              <th scope="col">Instructor</th>
              <th scope="col">Location</th>
              <th scope="col">Time</th>
            </tr>
          </thead>
          <TableBody table={table} />
        </table>
      </div>
    </div>
  </div>
};
