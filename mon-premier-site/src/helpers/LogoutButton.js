import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../helpers/AuthContext.js"; // Importer logout
import Button from 'react-bootstrap/Button';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate("/login");
    window.location.reload(); // Recharger la page pour afficher les changements 
  };

  return <Button className="logout-button" variant="outline-warning" onClick={handleLogout}>Se déconnecter</Button>;
};

export default LogoutButton;
