import AdminNavbar from "./AdminNavbar";

function AdminLayout({ children }) {
  return (
    <>
      <AdminNavbar />
      {children}
    </>
  );
}

export default AdminLayout;
