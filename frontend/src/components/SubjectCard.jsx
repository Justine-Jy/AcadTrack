export default function SubjectCard({ subject, color }) {
  return (
    <div style={{ borderLeft: `4px solid ${color}` }}>
      <h3>{subject.name}</h3>
    </div>
  );
}