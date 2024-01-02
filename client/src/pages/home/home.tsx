
import "./main.scss"
import { UpcomingEvents } from "../../components/upcomingEvents/upcomingEvents";
import { Nav } from "../../components/navbar/nav";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { url } from "../../utils/variables";
import { toast } from "react-toastify";
import { Tables } from "../../utils/interfaces";
import { Table } from "../../components/table/table";






export const Home = () => {
  const [grade, setGrade] = useState<string>("first");
  const [tables, setTables] = useState<Tables | null>(null);
  const table = useMemo(() => tables?.filter((t) => t.grade === grade)[0], [tables, grade]);

  useEffect(() => {
    axios.get(`${url}/api/tables`)
      .then((res) => {
        if (!res.data.success) throw new Error(res.data.msg);
        setTables(res.data.data.tables)
      }).catch((err) => {
        const errRes = err.response.data.msg || err.message
        toast.error(errRes, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
        });
      })
  }, [])

  return <>
    <Nav grade={grade} setGrade={setGrade} />
    <div className="contain">
      <div className="content-container">
        <div className="home">
          <div className="container-st">
            <UpcomingEvents table={table} />
            <Table table={table} />
          </div>
        </div>
      </div>
    </div>
  </>
};

