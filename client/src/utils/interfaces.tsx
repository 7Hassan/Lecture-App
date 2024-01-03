
export interface Lecture {
  name: string;
  location: string;
  doctor: string;
  start: string;
  end: string;
  _id: string;
}


export interface Table {
  _id: string;
  grade: string;
  Saturday: Lecture[];
  Sunday: Lecture[];
  Monday: Lecture[];
  Thursday: Lecture[];
  Wednesday: Lecture[];
  Friday: Lecture[];
  createdAt: string;
  updatedAt: string;

  __v: number;
}

export interface Tables extends Array<Table> { }

export interface User {
  firstName: string;
  lastName: string;
  img: string;
}