import React, { useEffect, useState } from 'react';

const DashboardPage = () => {
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            const token = localStorage.getItem('token'); // Récupère le token depuis le localStorage
            if (!token) {
                setMessage('Token non disponible. Veuillez vous connecter.');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/dashboard', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Ajoute le token dans l'en-tête
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                  }


                const data = await response.json();
                if (data.success) {
                    console.log("Données du dashboard récupérées :", data);
                    setMessage(data.message);
                    setUser(data.user); // Stocke les infos utilisateur si nécessaires
                } else {
                    console.log("Données du dashboard récupérées dans else :", data);
                    setMessage(data.message);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération du dashboard:", error);
                setMessage('Erreur lors de la récupération du dashboard:');
            }
        };
        fetchDashboard();
    }, []); // Appelé une fois au montage du composant

    return (
        <div>
            <h1>Tableau de bord</h1>
            <p>{message}</p>
            {user && (
                <div>
                    <p>Nom d'utilisateur : {user.username}</p>
                    <p>ID utilisateur : {user.userId}</p>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
