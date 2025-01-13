import React, { useState } from "react";
import LoginUser from "../LoginUser/LoginUser";

import "./Auth.css";
import logo from "../../images/logogd.png";
import { Link as Anchor } from "react-router-dom";

export default function AuthUser() {
  const [showLogin, setShowLogin] = useState(true);

  const toggleComponent = () => {
    setShowLogin((prevShowLogin) => !prevShowLogin);
    console.log("login " + showLogin);
  };

  return (
    <div className="AuthContainer">
      {showLogin ? (
        <LoginUser toggleComponent={toggleComponent} />
      ) : (
        <Anchor to="/register" className="sinCuenta">
          register
        </Anchor>
      )}
    </div>
  );
}
