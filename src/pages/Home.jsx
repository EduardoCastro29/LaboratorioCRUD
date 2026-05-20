import { useEffect } from "react";
import { useNavigate } from "react-router";
import Nav from "../components/Nav"; // Aca se importa el componente del Nav

const Home = () => {
  const navigate = useNavigate(); // Hook de react-router para navegar al login si no hay token.
  const token =
    localStorage.getItem("laboratorio_token") ||
    sessionStorage.getItem("laboratorio_token");
  // Esto funciona cuando el usuario decide darle click en recuerdame guarda la sesión.
  const user =
    localStorage.getItem("laboratorio_user") ||
    sessionStorage.getItem("laboratorio_user") ||
    "";

  useEffect(() => {
    // Si no hay token, redirige al login.
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);

  const handleLogout = () => {
    // Esto sucedera cuando se le de click al bóton de cerrar sesión, borrara todos los token y lo redireccionar al login
    localStorage.removeItem("laboratorio_token");
    localStorage.removeItem("laboratorio_user");
    localStorage.removeItem("laboratorio_email");
    sessionStorage.removeItem("laboratorio_token");
    sessionStorage.removeItem("laboratorio_user");
    sessionStorage.removeItem("laboratorio_email");
    navigate("/"); // Redirige al login después de cerrar sesión.
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F1F6DF]">
      {token && <Nav />}{" "}
      {/* Si existe el token osea ha iniciado sesión se mostrara el nav*/}
      <div className="flex flex-col items-center justify-center flex-grow">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-green-600">
            Bienvenido {user ? `, ${user}` : ""}
          </h1>
          <p className="mt-4 text-green-400">
            Bienvenido a mi evaluación frontend
          </p>
        </header>
        <main className="mt-8">
          {" "}
          {/* Este es el bóton de cerrar sesión entonces cuando se le de click lo mandara directamente al login con los token eliminados */}
          <button
            onClick={handleLogout}
            className="px-6 py-3 text-white bg-orange-400 rounded-lg hover:bg-orange-500"
          >
            Cerrar Sesión
          </button>
        </main>
      </div>
    </div>
  );
};

export default Home;
