import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";



const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    // Si aucun token ou token invalide, redirigez vers la page de connexion
    return token && isTokenValid() ? children : <Navigate to="/login" />;
};



export const isTokenValid = () => {
    const token = localStorage.getItem("token");

    if (!token) return false;

    try {
        const { exp } = jwtDecode(token); // Décoder le token pour obtenir la date d'expiration
        const now = Math.floor(Date.now() / 1000); // Temps actuel en secondes

        return exp > now; // Comparer avec la date d'expiration
    } catch (error) {
        console.error("Erreur lors de la vérification du token :", error);
        return false;
    }
};

export default PrivateRoute;
