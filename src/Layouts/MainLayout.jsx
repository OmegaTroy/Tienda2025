import React, { useState, useEffect } from "react";
import Spiner from "../Components/Admin/Spiner/Spiner";
import { Outlet, useNavigate } from "react-router-dom";
import baseURL from "../Components/url";

export default function MainLayout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const dataUser = JSON.parse(token);
        try {
          const response = await fetch(
            `${baseURL}usuariosGet.php?idUsuario=${dataUser.usuario.idUsuario}`
          );
          const data = await response.json();
          setUser(data.usuario);

          if (data.usuario.rol === "admin") {
            setLoading(false);
            navigate("/dashboard");
          } else {
            navigate("/"); // Redirige a la página principal si no es admin
          }
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
          navigate("/"); // Redirige en caso de error
        }
      } else {
        navigate("/"); // Redirige si no hay token
      }
    };
    fetchData();
  }, [navigate]);

  return <div>{loading ? <Spiner /> : <Outlet />}</div>;
}
