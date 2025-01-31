import React, { useState, useEffect } from "react";
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
  const [showPassword, setShowPassword] = useState(false);

  const { login, error } = useLogin();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await login(email, password);

    if (response?.success) {
      toast.success(response?.message);
      setTimeout(() => navigate("/"), 2000);
    } else {
      toast.error(response?.error || "Error al iniciar sesión");
      setTimeout(() => navigate("/authUser"), 2000);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
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
