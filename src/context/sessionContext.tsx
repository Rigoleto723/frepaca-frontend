import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../interfaces/User";

interface SessionContextType {
    user: User | null;
    accessToken: string | null;
    login: (accessToken: string, refreshToken: string, userData: User) => void;
    logout: () => void;
    setGroups: (groups: string[]) => void;
    setUserName: (name: string) => void;
    updateUser: (userData: User) => void;
    hasRole: (role: string) => boolean;
}

const SessionContext = createContext<SessionContextType>({
    user: null,
    accessToken: null,
    login: () => { },
    logout: () => { },
    setGroups: () => { },
    setUserName: () => { },
    updateUser: () => { },
    hasRole: () => false
});

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const setGroups = (groups: string[]) => {
        if (user) {
            const updatedUser = { ...user, groups };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
        }
    };

    const setUserName = (fullName: string) => {
        if (user) {
            const [name = "", surname = ""] = fullName.split(" ");
            const updatedUser = { ...user, name, surname };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
        }
    };

    useEffect(() => {
        // Cargar datos desde localStorage
        const storedToken = localStorage.getItem("access_token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setAccessToken(storedToken);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error al parsear datos de usuario:', error);
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("user");
            }
        }
    }, []);

    const login = (accessToken: string, refreshToken: string, userData: User) => {
        console.log("Login data:", { userData }); // Para debug
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
        localStorage.setItem("user", JSON.stringify(userData));

        setAccessToken(accessToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        setAccessToken(null);
        setUser(null);
    };

    const updateUser = (userData: User) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const hasRole = (role: string): boolean => {
        if (!user || !user.groups) return false;
        return user.groups.some(group =>
            typeof group === 'string'
                ? group === role
                : group.name === role
        );
    };

    return (
        <SessionContext.Provider value={{
            user,
            accessToken,
            login,
            logout,
            setGroups,
            setUserName,
            updateUser,
            hasRole
        }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);
