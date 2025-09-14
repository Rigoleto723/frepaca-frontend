import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login"
import Dashboard from "./components/Dashboard/Dashboard"
import Users from "./components/Users/Users"
import Layout from "./components/Layout/Layout"
import Customers from "./components/Customers/Customers"
import Investors from "./components/Investors/Investors"
import Loans from "./components/Loans/Loans"
import { useEffect, useState } from "react";
import { useSession } from "./context/sessionContext";
import UserProfile from "./components/Users/UserProfile";
import LoansDetail from "./components/Loans/LoansDetail";
import Pays from "./components/Pays/Pays";
import Reports from "./components/Reports/Reports";

const RootStack = () => {
  const { accessToken, user } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simplificar la lógica de carga inicial
    if (accessToken && user) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [accessToken, user]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Cargando...</div>;
  }

  // Si no hay token, mostrar rutas públicas
  if (!accessToken || !user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Rutas protegidas normales
  return (
    <Routes>
      <Route path="/app" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="loans" element={<Loans />} />
        <Route path="loan-detail/:id" element={<LoansDetail />} />
        <Route path="payments" element={<Pays />} />
        <Route path="users" element={<Users />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="customers" element={<Customers />} />
        <Route path="investors" element={<Investors />} />
        <Route path="reports" element={<Reports />} />
      </Route>
      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
    </Routes>
  );
};

export default RootStack

