import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../css/LoginPage.css';

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
                navigate('/teams'); // Redirige vers le tableau de bord
                window.location.reload(); // Recharger la page pour afficher les changements
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error('Erreur:', err);
            setError('Une erreur est survenue handle login.');
        }
    };

    return (
        <div className='login_form_team'>
            <h1>Connexion</h1>
            <form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter User" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Button variant="primary" type="submit">Connexion</Button>
            </form>
        </div>
    );
};

export default LoginPage;
