import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginUser.css";
import { useNavigate } from "react-router";
import useLogin from "../../hooks/UserGet";
// import baseURL from "../url";

export default function LoginUser({ toggleComponent }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, userData } = useLogin();

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    login(email, password); // Llama al hook con las credenciales
    navigate("/");
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
