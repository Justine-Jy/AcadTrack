import { useState } from "react";

export default function Schedule({ subjects, schedules, onAdd }) {
  const [form, setForm] = useState({
    subjectId: "",
    day: "Mon",
    startTime: "",
    endTime: "",
    room: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();

    const subject = subjects.find(s => s._id === form.subjectId);

    onAdd({
      ...form,
      subjectName: subject?.name || "Unknown"
    });
  };

  return (
    <div>
      <form onSubmit={handleAdd}>
        {/* same inputs */}
        <button type="submit">Add</button>
      </form>

      {schedules.map((s, i) => (
        <div key={i}>
          {s.subjectName} - {s.day}
        </div>
      ))}
    </div>
  );
}