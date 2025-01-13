import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "./RegisterUser.css";
import baseURL from "../url";

export default function RegisterUser({ toggleComponent }) {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); // Previene el comportamiento predeterminado del formulario

    // Crear una instancia de FormData
    const formData = new FormData(event.target);

    // Agregar manualmente el campo "rol"
    formData.append("rol", "usuario");

    try {
      const response = await fetch(`${baseURL}/registroPost.php`, {
        method: "POST",
        body: formData, // Enviar el FormData directamente
      });
      const data = await response.json(); // Obtener el texto del cuerpo de la respuesta

      if (response.ok) {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.mensaje);
          navigate("/authUser");
        }
      } else {
        toast.error("Error en la solicitud");
      }
    } catch (error) {
      toast.error("Error de red: " + error.message);
    }
  };

  return (
    <div className="form-container">
      <ToastContainer />
      <div className="form-header">
        <h1>Crear cuenta</h1>
        <p>Completa tus datos para comenzar a comprar</p>
      </div>

      <form onSubmit={handleSubmit} className="form-body">
        <div className="form-section">
          <h2>Información personal</h2>
          <div className="form-grid">
            <div className="form-field">
              <label name="nombre">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                placeholder="Juan"
              />
            </div>
            <div className="form-field">
              <label name="apellido">Apellido</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                required
                placeholder="Pérez"
              />
            </div>
          </div>
          <div className="form-field">
            <label name="dni">DNI</label>
            <input id="dni" name="dni" type="number" required />
          </div>
          <div className="form-field">
            <label name="telefono">Teléfono</label>
            <input
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              id="telefono"
              name="telefono"
              type="number"
              required
              placeholder="123456789"
            />
          </div>
          <div className="form-field">
            <label name="email">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="juan.perez@ejemplo.com"
            />
          </div>
          <div className="form-field">
            <label name="contrasena">Contraseña</label>
            <input id="contrasena" name="contrasena" type="password" required />
          </div>
        </div>

        <button type="submit" className="form-button">
          Crear cuenta
        </button>
      </form>
    </div>
  );
}
