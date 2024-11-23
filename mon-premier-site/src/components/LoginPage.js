import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Réinitialise l'erreur

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (data.success) {
                localStorage.setItem('token', data.token); // Stocke le token
                navigate('/dashboard'); // Redirige vers le tableau de bord
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error('Erreur:', err);
            setError('Une erreur est survenue handle login.');
        }
    };

    return (
        <div>
            <h1>Connexion</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Nom d'utilisateur</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Connexion</button>
            </form>
        </div>
    );
};

export default LoginPage;
