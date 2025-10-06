const ProtectedRoute = async({ children, allowedRanks }) => {
    try {
      const response = await fetch("/api/user/info", {
        method: "GET",
        credentials: "include",
      });
  
      if (!response.ok) throw new Error("Käyttäjän tunnistus epäonnistui");
  
      const data = await response.json();

      const rank = data.rank;
      console.log(rank);

      if (allowedRanks.icludes(rank)) {
        return children;
      }
      else {
        throw new Error("Ei oikeuksia tälle sivulle");
      }
      
    } catch (err) {
      console.error("Virhe:", err);
      if (error.message === "Käyttäjän tunnistus epäonnistui" || error.message === "Ei oikeuksia tälle sivulle") {
        return <Navigate to="/" replace />;
      }
      return <Navigate to="/login" replace />;
    }
}

export default ProtectedRoute;
