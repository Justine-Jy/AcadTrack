import SubjectCard from "./SubjectCard";

const COLORS = ['#6B5A8A', '#4A7C6F', '#3D5A8A', '#C46D52', '#2E7A5A'];

export default function SubjectsView({ subjects }) {
  return (
    <div className="subjects-grid">
      {subjects.map((s, i) => (
        <SubjectCard key={s._id} subject={s} color={COLORS[i % COLORS.length]} />
      ))}
    </div>
  );
}