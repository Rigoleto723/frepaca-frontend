import axios from "axios";
import { logout, getRefreshToken, setAccessToken } from "./utils/auth";

const client = axios.create({
    baseURL: import.meta.env.VITE_API,
});

// Interceptor para agregar el token en cada petición
client.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Interceptor de respuesta para manejar tokens expirados
client.interceptors.response.use(
    (response) => response, // Devolver la respuesta si está bien
    async (error) => {
        const originalRequest = error.config;

        // Si el error es un 401 y no hemos intentado refrescar el token antes
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Marcar que estamos intentando refrescar

            try {
                const refreshToken = getRefreshToken(); // Obtener refresh_token
                if (!refreshToken) throw new Error("No hay refresh token disponible.");

                // Pedir un nuevo access_token
                const response = await axios.post(`${import.meta.env.VITE_API}/auth/token/refresh/`, {
                    refresh: refreshToken,
                });

                // Guardar el nuevo access_token
                setAccessToken(response.data.access);

                // Reintentar la petición original con el nuevo token
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return client(originalRequest);
            } catch (refreshError) {
                console.error("No se pudo refrescar el token, cerrando sesión...");
                logout();
            }
        }

        return Promise.reject(error);
    }
);

export default client;
