import React, { useState, useEffect } from "react";
import Spiner from "../Components/Admin/Spiner/Spiner";
import Auth from "../Components/Admin/Auth/Auth";
import { Outlet, useNavigate } from "react-router-dom";

export default function MainLayout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return navigate("/dashboard/auth"); // Redirigir si no hay token
      }
      const dataUser = JSON.parse(token);

      try {
        setUser(dataUser);
        setLoading(false);

        // Verificar si el rol es admin
        if (dataUser.rol !== "admin") {
          return navigate("/");
        }
        // Redireccionar a la página de inicio de sesión
        navigate("/dashboard");
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        setUser(null);
        setLoading(false);
        navigate("/");
      }
    };

    fetchData();
  }, [navigate]);

  // Si está cargando, mostrar el spinner
  if (loading) return <Spiner />;

  // Si el usuario está autenticado, mostrar el Outlet
  return user ? <Outlet /> : <Auth />;
}
