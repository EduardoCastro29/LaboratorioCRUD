import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// Datos quemados para el Login
const users = [
  {
    id: 1,
    email: "john@gmail.com",
    username: "astrid",
    password: "m38rmF$",
  },
  {
    id: 2,
    email: "morrison@gmail.com",
    username: "jorgePere",
    password: "83r5^_",
  },
  {
    id: 3,
    email: "kevin@gmail.com",
    username: "Kevin Castro",
    password: "kev02937@",
  },
];

const Login = () => {
  // Esto se ocupar para manejar los estados de cada campo para el login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Si inicio correctamente entonces, se crea el token
    // Si existe el token entonces lo manda al home
    const token =
      localStorage.getItem("laboratorio_token") ||
      sessionStorage.getItem("laboratorio_token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    //Se validan los campos
    if (!email.trim() || !password) {
      setError("Por favor completa email y contraseña.");
      return;
    }

    setLoading(true);

    try {
      // Se busca la lista de usuarios que existen
      const user = users.find(
        (item) =>
          item.email.toLowerCase() === email.trim().toLowerCase() &&
          item.password === password,
      );

      if (!user) {
        // Si no existe, se lanza un error y se muestra al usuario.
        throw new Error("Email o contraseña incorrectos.");
      }

      const token = `token-${user.id}-${Date.now()}`;
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("laboratorio_token", token);
      storage.setItem("laboratorio_user", user.username);
      storage.setItem("laboratorio_email", user.email);

      // Se manda al home si todo esta bien
      navigate("/home");
    } catch (error_) {
      setError(
        error_.message || "Error al iniciar sesión. Intenta nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // Este es el contenedor principal
    <div className="min-h-screen bg-[#F1F6DF] px-4 py-10 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 rounded-4xl bg-white p-6 shadow-xl shadow-slate-200/50 md:p-10 md:flex-row md:items-center">
        <div className="w-full ">
          <div className="max-w-xl">
            <h1 className="text-5xl font-bold text-green-700 sm:text-5xl ">
              Bienvenido
            </h1>{" "}
            {/*Esto sale en el login como bienvenida*/}
            <h3 className="text-lg  text-black sm:text-lg ">
              Inicia sesión en tu cuenta
            </h3>
          </div>
          <hr className=" my-6 border-t-2 border-green-600" />

          {/*Si le da click en iniciar sesión lo llevara a la función de submit*/}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Direccción de correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Ingresa tu correo electrónico"
                className="w-full rounded-2xl border border-slate-200 bg-slate-200 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-orange-300 focus:bg-orange-100"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full rounded-2xl border border-slate-200 bg-slate-200 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-orange-300 focus:bg-orange-100"
                required
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-200 text-orange-300 focus:ring-orange-300"
                />
                Recuérdame
              </label>
            </div>

            {error && (
              <div
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}

            {/*Si le da click en iniciar sesión lo llevara a la función de submit*/}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-orange-400 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
