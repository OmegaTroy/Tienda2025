import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginUser.css";
import { useNavigate } from "react-router";
import baseURL from "../url";

export default function LoginUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("contrasena", password);
      formData.append("rolLogin", "usuario");
      formData.append("iniciar_sesion", true);

      const response = await fetch(`${baseURL}/login.php`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.mensaje) {
          console.log(data.mensaje);
          toast.success(data.mensaje);
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else if (data.error) {
          setErrorMessage(data.error);
          console.log(data.error);
          toast.error(data.error);
        }
      } else {
        throw new Error("Error en la solicitud al servidor");
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="formContain">
      <ToastContainer />
      <h2>Tienda Virtualtech</h2>
      <form onSubmit={handleLogin} className="formAuth">
        <div className="inputsAuth">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
          />
        </div>
        <div className="inputsAuth">
          <label htmlFor="password">Contraseña:</label>
          <div className="deFlexInputs">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Contraseña"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>

        <button type="submit" className="btn">
          Iniciar Sesión
        </button>
        <a href="/register" className="register" onClick={(e) => {}}>
          Registrate
        </a>
      </form>
    </div>
  );
}
