import React, { useState } from "react";
import Login from "../Login/Login";

import "./Auth.css";
import logo from "../../../images/logogd.png";
import { Link as Anchor } from "react-router-dom";
export default function Auth() {
  const [showLogin, setShowLogin] = useState(true);

  const toggleComponent = () => {
    setShowLogin((prevShowLogin) => !prevShowLogin);
  };

  return (
    <div className="AuthContainer">
      <Login />
    </div>
  );
}
