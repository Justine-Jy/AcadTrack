import { useState, useEffect } from "react";
import { api } from "../services/api";

export function useDashboardData() {
  const [subjects, setSubjects] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [subjectsData, statsData] = await Promise.all([
          api.fetchSubjects(),
          api.fetchStats()
        ]);
        setSubjects(subjectsData);
        setStats(statsData);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { subjects, stats, loading };
}