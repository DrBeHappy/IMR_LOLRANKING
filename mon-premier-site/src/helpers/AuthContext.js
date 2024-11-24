// src/helpers/auth.js

// Vérifie si un utilisateur est connecté
export const isLoggedIn = () => {
    return localStorage.getItem("token") !== null;
  };
  
  // Déconnexion et suppression du token
  export const logout = () => {
    localStorage.removeItem("token");
  };
  
  // Écouteur pour détecter les changements dans localStorage
  export const onAuthChange = (callback) => {
    // Vérifie les changements dans "storage" pour tous les onglets/navigateurs
    window.addEventListener("storage", () => {
      callback(isLoggedIn());
    });
  
    // Permet d'appeler immédiatement la callback avec l'état actuel
    return () => callback(isLoggedIn());
  };
  