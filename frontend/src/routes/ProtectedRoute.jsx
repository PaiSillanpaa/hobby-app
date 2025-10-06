export default function ProtectedRoute({ children, allowedRanks }) {
  const token = localStorage.getItem("token");
  const rank = localStorage.getItem("rank");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRanks.includes(rank)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
