import { IconCards, IconChevronDown, IconCoin, IconDashboard, IconDoorExit, IconPackage, IconSettings2, IconUserCog, IconUsers, IconChartBar, IconTag, IconTruck, IconTruckDelivery } from "@tabler/icons-react";
import { ReactNode, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSession } from "../../context/sessionContext";
import client from "../../axiosConfig";
import SidebarItem from "./SidebarItem";
import logotipo from "../../assets/logo.jpeg"

export interface SidebarItemInfo {
    icon: ReactNode,
    name: string,
    path: string,
    groups?: string[],
}

const sidebarList: SidebarItemInfo[] = [
    {
        path: "/app/dashboard",
        name: "Dashboard",
        icon: <IconDashboard />,
        groups: ['admin', 'seller', 'logistic']
    },
    {
        path: "/app/loans",
        name: "Prestamos",
        icon: <IconCoin />,
        groups: ['admin', 'seller']
    },

    {
        path: "/app/customers",
        name: "Clientes",
        icon: <IconUsers />,
        groups: ['admin', 'seller']
    },
    {
        path: "/app/reports",
        name: "Reportes",
        icon: <IconChartBar />,
        groups: ['admin']
    },

]

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { pathname } = useLocation();
    const [openConfig, setOpenConfig] = useState(false);
    const ref = useRef<any>(null);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const { logout, hasRole } = useSession();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Limpiar localStorage y sessionStorage
        localStorage.clear();
        sessionStorage.clear();

        // Limpiar el sessionId del contexto
        logout();

        // Intentar cerrar sesión en el servidor
        client.post('/api/auth/logout/')
            .then(() => {
                console.log('Sesión cerrada exitosamente en el servidor');
            })
            .catch((error) => {
                console.error('Error al cerrar sesión en el servidor:', error);
            })
            .finally(() => {
                // Redireccionar al login con recarga completa
                window.location.href = '/login';
            });
    }

    // Función para verificar si el usuario puede acceder a un item
    const canAccessItem = (item: SidebarItemInfo) => {
        if (!item.groups) return true; // Si no tiene roles definidos, todos pueden acceder
        return item.groups.some(group => hasRole(group));
    };

    return (
        <div className="flex min-h-screen overflow-hidden bg-black">
            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full bg-black text-white transition-all duration-300 z-40 ${isSidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
                <div className="flex flex-row justify-center p-7 items-center" style={{ marginTop: '20px' }}>
                    <img src={logotipo} alt="" className="h-30" />
                </div>
                <div className="flex flex-col h-full p-7">
                    {sidebarList
                        .filter(item => canAccessItem(item))
                        .map((item) => (
                            <SidebarItem
                                key={item.path}
                                item={item}
                                active={item.path === pathname}
                                onClick={() => navigate(item.path)}
                            />
                        ))}
                </div>
                <div className="flex flex-col p-7 mt-auto sticky bottom-0 bg-black">
                    {/* Perfil siempre visible */}
                    <SidebarItem
                        item={{
                            icon: <IconUserCog />,
                            name: 'Mi Perfil',
                            path: '/app/profile'
                        }}
                        active={'/app/profile' === pathname}
                        onClick={() => navigate('/app/profile')}
                    />

                    {/* Configuración solo para admin */}
                    {hasRole('admin') && (
                        <>
                            <div className="pb-3 flex flex-row justify-between text-gray-500 cursor-pointer hover:text-gray-400"
                                onClick={() => setOpenConfig(!openConfig)}>
                                <div className="flex flex-row gap-3">
                                    <IconSettings2 />
                                    Configuración
                                </div>
                                <IconChevronDown className={`${openConfig ? "rotate-180" : 'rotate-0'} transition-all`} />
                            </div>
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden`}
                                style={{ height: openConfig ? ref.current?.offsetHeight || 0 : 0 }}>
                                <div className="pl-3" ref={ref}>
                                    <SidebarItem
                                        item={{
                                            icon: <IconUserCog />,
                                            name: 'Usuarios',
                                            path: '/app/users'
                                        }}
                                        active={'/app/users' === pathname}
                                        onClick={() => navigate('/app/users')}
                                        config
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex flex-row gap-3 text-gray-500 pb-3 cursor-pointer hover:text-gray-400"
                        onClick={handleLogout}>
                        <IconDoorExit />
                        Cerrar Sesión
                    </div>
                </div>
            </div>

            {/* Botón de toggle */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white shadow-lg"
            >
                {isSidebarOpen ? "←" : "→"}
            </button>

            {/* Contenido principal con transición */}
            <main className={`border-2 border-gray-600 rounded-lg flex-1 transition-all duration-300 m-4 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;