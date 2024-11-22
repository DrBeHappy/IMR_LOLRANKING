import React, { useEffect, useState } from 'react';

const DashboardPage = () => {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const fetchTeams = async () => {
            const response = await fetch('http://localhost:3000/teams', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            setTeams(data.teams);
        };

        fetchTeams();
    }, []);

    return (
        <div>
            <h2>Tableau de bord</h2>
            <ul>
                {teams.map((team, index) => (
                    <li key={index}>
                        {team.name} - {team.tag} - {team.color}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DashboardPage;
