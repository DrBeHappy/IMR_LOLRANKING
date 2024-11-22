import React, { useState } from 'react';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Pour afficher un message d'erreur

    // Fonction de gestion de la soumission du formulaire
    const handleLogin = async (e) => {
        e.preventDefault(); // Empêche la page de se recharger par défaut
        
        // Vérifie que le formulaire n'est pas vide
        if (!username || !password) {
            setError('Veuillez entrer un nom d\'utilisateur et un mot de passe.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }), // Envoie les informations de connexion
            });

            const data = await response.json();
            
            if (data.success) {
                // Si la connexion est réussie, stocke le token et redirige vers le tableau de bord
                localStorage.setItem('token', data.token); // Le token est renvoyé par le serveur
                window.location.href = '/dashboard'; // Redirige vers la page de tableau de bord
            } else {
                setError(data.message); // Affiche un message d'erreur si les identifiants sont incorrects
            }
        } catch (error) {
            setError('Une erreur est survenue. Veuillez réessayer.');
        }
    };

    return (
        <div>
            <h2>Se connecter</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <input
                        type="text"
                        placeholder="Nom d'utilisateur"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Connexion</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Affiche l'erreur si elle existe */}
        </div>
    );
};

export default LoginPage;
