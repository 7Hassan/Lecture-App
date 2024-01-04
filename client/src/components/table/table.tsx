
import { format } from "date-fns";
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Lecture as LectureInterface, Table as TableInterface } from "../../utils/interfaces";
import "./main.scss"
import { Loading } from "../../utils/components";
import { days, url } from "../../utils/variables";
import { toast } from "react-toastify";





const Action = ({ lecId, setTables }: { lecId: string }) => {
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<null | string>(null)
  useEffect(() => {
    if (!id) return;
    setLoading(true)
    fetch(`${url}/api/table/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      }
    }).then(async (res) => res.json())
      .then((res) => {
        setLoading(false)
        if (!res.success) throw new Error(res.data.msg);
        setTables(res.data.tables)
      }).catch((err) => {
        setLoading(false)
        const errRes = err.message
        toast.error(errRes);
      })
  }, [id, setTables]);


  return <td className="actions">
    <div className="edit">
      <Link to={lecId}>
        <img src="https://firebasestorage.googleapis.com/v0/b/lecture-app-50d1c.appspot.com/o/edit.png?alt=media&token=6ecf0613-cd3a-4070-806f-8613958a2f4d" alt="edit" />
      </Link>
    </div>
    <div className="remove" onClick={() => setId(lecId)}>
      {
        !loading &&
        <img src="https://firebasestorage.googleapis.com/v0/b/lecture-app-50d1c.appspot.com/o/remove.png?alt=media&token=21bf1a61-6f6c-4182-9454-7f0f51beca41" alt="remove" />
      }

      {
        loading && <Loading type="color" />
      }
    </div>
  </td>
}

const Lecture = ({ lec, isAuth, setTables }: { lec: LectureInterface, isAuth: boolean }) => {
  const { name, location, doctor, start, end, _id } = lec;

  return <tr className="lec">
    <td></td>
    <td> {name}</td>
    <td>{doctor}</td>
    <td>{location}</td>
    <td>{format(new Date(start), "p")} - {format(new Date(end), "p")}</td>
    {isAuth && <Action lecId={_id} setTables={setTables} />}
  </tr>
}


const TableBody = ({ table, isAuth, setTables }: { table: TableInterface | undefined, isAuth: boolean }) => {

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
            Array.isArray(lectures) && lectures.map((lec: LectureInterface) => <Lecture key={lec._id} lec={lec} isAuth={isAuth} setTables={setTables} />)
          }
        </React.Fragment>
      })
    }
  </tbody>
}


export const Table = ({ table, isAuth, setTables }: { table: TableInterface | undefined, isAuth: boolean }) => {

  return <div className="table">
    <div className="btns">
      <button className="export">
        <img src="https://firebasestorage.googleapis.com/v0/b/lecture-app-50d1c.appspot.com/o/arrow.png?alt=media&token=9f680cb3-722f-4b84-8bb7-27a4869a43b4" alt="arrow" />
        <p>
          Export
        </p>
      </button>
      {isAuth &&
        <button>
          <Link to="addLecture">
            Add Lecture
          </Link>
        </button>
      }
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
          <TableBody table={table} isAuth={isAuth} setTables={setTables} />
        </table>
      </div>
    </div>
  </div>
};
