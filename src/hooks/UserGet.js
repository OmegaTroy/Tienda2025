import { useState } from "react";
import baseURL from "../Components/url";

const useLogin = () => {
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const [userData, setUserData] = useState(null); // Estado para almacenar los datos del usuario

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("contrasena", password);

    try {
      const response = await fetch(`${baseURL}login.php`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json(); // Obtiene la respuesta del backend
      console.log("Respuesta del servidor:", data);

      if (response.ok && data.mensaje) {
        setUserData(data.usuario);
        localStorage.setItem("token", JSON.stringify(data.usuario)); // Guarda solo los datos del usuario
        return { success: true, message: data.mensaje };
      } else {
        setUserData(null);
        setError(data.error || "Credenciales incorrectas");
        return {
          success: false,
          message: data.error || "Credenciales incorrectas",
        };
      }
    } catch (err) {
      setUserData(null);
      setError("Error de conexión");
      return { success: false, message: "Error de conexión" };
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, userData };
};

export default useLogin;
