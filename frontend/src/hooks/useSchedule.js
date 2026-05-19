import { useState } from "react";

export function useSchedule() {
  const [schedules, setSchedules] = useState([]);

  const addSchedule = (newSchedule) => {
    setSchedules(prev => [...prev, newSchedule]);
  };

  return { schedules, addSchedule };
}