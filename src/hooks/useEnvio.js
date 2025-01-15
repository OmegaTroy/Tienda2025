import { useEffect, useState } from "react";
import baseURL from "../Components/url";

export function useEnvio() {
  const [envio, setEnvio] = useState(false);
  const [data, setData] = useState(null);
  const fetchEnvio = async (ciudad, idUsuario, direccion, codigoPostal) => {
    try {
      const formData = new FormData();
      formData.append("ciudad", ciudad);
      formData.append("idUsuario", idUsuario);
      formData.append("direccion", direccion);
      formData.append("codigoPostal", codigoPostal);

      const response = await fetch(`${baseURL}envioPost.php`, {
        method: "POST",
        body: formData,
      });
      const dataJson = await response.json();
      if (response.ok) {
        console.log(dataJson);
        setData(response);
        setEnvio(true);
      }
      setEnvio(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRetiro = async (idUsuario, tienda) => {
    const formData = new FormData();
    formData.append("idUsuario", idUsuario);
    formData.append("tienda", tienda);
    try {
      const response = await fetch(`${baseURL}retiroPost.php`, {
        method: "POST",
        body: formData,
      });
      const dataJson = await response.json();
      if (response.ok) {
        console.log(response);
        setData(response);
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { data, envio, fetchEnvio, fetchRetiro };
}
