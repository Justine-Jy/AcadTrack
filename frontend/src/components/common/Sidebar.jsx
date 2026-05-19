export default function Sidebar({ open }) {
  return <aside className={`sidebar ${open ? 'open' : ''}`}></aside>;
}