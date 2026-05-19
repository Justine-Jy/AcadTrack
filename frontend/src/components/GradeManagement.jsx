import { useState, useEffect } from "react";
import { api } from "../services/api";

export default function GradeManagement({ subjects }) {
  const [activeSubj, setActiveSubj] = useState('');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (subjects.length > 0 && !activeSubj) {
      setActiveSubj(subjects[0]._id);
    }
  }, [subjects]);

  useEffect(() => {
    if (!activeSubj) return;

    const load = async () => {
      const data = await api.fetchStudents(activeSubj);
      setStudents(data);
    };

    load();
  }, [activeSubj]);

  return <div>{/* your UI */}</div>;
}