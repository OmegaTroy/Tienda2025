import { useState } from "react";
import baseURL from "../Components/url";

const useLogin = () => {
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const [userData, setUserData] = useState(null); // Estado para almacenar los datos del usuario

  const login = async (email, password) => {
    setLoading(true); // Activa el estado de carga

    const formData = new FormData();
    formData.append("email", email);
    formData.append("contrasena", password);

    try {
      const response = await fetch(`${baseURL}login.php`, {
        method: "POST",
        body: formData, // Envío de datos
      });

      const data = await response.json(); // Obtiene la respuesta del servidor
      console.log(data);
      if (response.ok) {
        setUserData(data); // Si la autenticación es exitosa, almacena los datos del usuario
        localStorage.setItem("token", JSON.stringify(data)); // Guarda el token en localStorage (si es un JWT)
        setError(null); // Resetea cualquier error previo
      } else {
        setError(data.message || "Error al autenticar"); // Muestra el error si la autenticación falla
        setUserData(null); // Resetea los datos del usuario en caso de error
      }
    } catch (err) {
      setError("Error de conexión"); // Maneja los errores de la red
      setUserData(null); // Resetea los datos del usuario en caso de error
    } finally {
      setLoading(false); // Desactiva el estado de carga después de la solicitud
    }
  };

  return { login, loading, error, userData };
};

export default useLogin;
