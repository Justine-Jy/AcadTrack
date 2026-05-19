import { useState, useEffect } from "react";
import { api } from "../services/api";

export function useStudents(subjectId) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subjectId) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const data = await api.fetchStudents(subjectId);
        setStudents(data);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [subjectId]);

  return { students, loading };
}