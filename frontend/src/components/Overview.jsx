import { useState, useEffect } from "react";

const COLORS = ['#6B5A8A', '#4A7C6F', '#3D5A8A', '#C46D52', '#2E7A5A'];

export default function Overview({ subjects, stats, user }) {
  const today = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date().getDay()];
  const [todayClasses, setTodayClasses] = useState([]);

  useEffect(() => {
    const classes = subjects.flatMap((s, index) =>
      s.schedule?.filter(sc => sc.day === today).map(sc => ({
        ...sc,
        subject: s.name,
        color: COLORS[index % COLORS.length]
      })) || []
    );

    setTodayClasses(classes);
  }, [subjects, today]);

  return <div>{/* your UI here */}</div>;
}