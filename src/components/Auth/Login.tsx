import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSession } from "../../context/sessionContext";
import client from "../../axiosConfig";
import logotipo from "../../assets/logo.jpeg";

const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useSession();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await client.post("api/auth/login/", { username, password });
            console.log("Respuesta completa del servidor:", response.data);

            const { access, refresh } = response.data.tokens;
            const user = response.data.user;

            console.log("Datos de usuario:", user);
            console.log("must_change_password:", user.must_change_password);

            // Guardar sesión en el contexto
            login(access, refresh, user);

            if (user.must_change_password) {
                console.log("Redirigiendo a cambio de contraseña");
                toast.success("Por favor, cambie su contraseña para continuar");
                setTimeout(() => {
                    navigate("/change-password", { replace: true });
                }, 100);
            } else {
                console.log("Redirigiendo a dashboard");
                toast.success("Inicio de sesión exitoso");
                navigate("/app/dashboard", { replace: true });
            }
        } catch (error: any) {
            console.error("Error al iniciar sesión:", error);
            const message = error.response?.data?.non_field_errors?.[0] ||
                error.response?.data?.error ||
                "Error al iniciar sesión. Intente nuevamente.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="mb-2">
                <img src={logotipo} alt="Logo" className="w-80 h-auto mx-auto" />
            </div>
            <div className="max-w-md w-full space-y-8 bg-black p-10 rounded-xl shadow-lg">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Iniciar Sesión</h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Cédula"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
