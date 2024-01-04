
import "./main.scss"
import { UpcomingEvents } from "../../components/upcomingEvents/upcomingEvents";
import { Nav } from "../../components/navbar/nav";
import { useEffect, useMemo, useState } from "react";
import { url } from "../../utils/variables";
import { toast } from "react-toastify";
import { Tables, User } from "../../utils/interfaces";
import { Table } from "../../components/table/table";
import { Title } from "../../utils/components";

interface Home {
  user: User | null;
  isAuth: boolean;
  grade: string | null;
  setGrade: React.Dispatch<React.SetStateAction<string | null>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const Home = ({ user, setUser, isAuth, grade, setGrade }: Home) => {
  const [tables, setTables] = useState<Tables | null>(null);
  const table = useMemo(() => tables?.filter((t) => t.grade === grade)[0], [tables, grade]);

  useEffect(() => {
    fetch(`${url}/api/tables`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      }
    }).then(async (res) => res.json())
      .then((res) => {
        if (!res.success) throw new Error(res.data.msg);
        setTables(res.data.tables)
      }).catch((err) => {
        const errRes = err.message
        toast.error(errRes, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
        });
      })
  }, [])

  return <>
    <Title title='Home' />
    <Nav grade={grade} setGrade={setGrade} user={user} setUser={setUser} />
    <div className="contain">
      <div className="content-container">
        <div className="home">
          <div className="container-st">
            <UpcomingEvents table={table} />
            <Table table={table} isAuth={isAuth} setTables={setTables} />
          </div>
        </div>
      </div>
    </div>
  </>
};

