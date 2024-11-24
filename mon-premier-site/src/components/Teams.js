import React, { useState, useEffect } from 'react';
import data from '../data/testdb.json';
import '../css/Teams.css'; // Import du CSS

function Teams() {
  // État pour la ligue sélectionnée (LEC ou LFL)
  const [league, setLeague] = useState('LEC'); 
  const [teams, setTeams] = useState([]);

  // Effet pour mettre à jour les équipes en fonction de la ligue sélectionnée
  useEffect(() => {
    // On met à jour les équipes en fonction de la ligue sélectionnée
    setTeams(data.leagues[league].teams);
  }, [league]); // L'effet se déclenche chaque fois que 'league' change

  // Fonction pour changer la ligue
  const toggleLeague = () => {
    setLeague(league === 'LEC' ? 'LFL' : 'LEC');
  };

  return (
    <div>
      <h2>Liste des équipes - {league}</h2>
      <button onClick={toggleLeague} className="league-toggle-button">
        {league === 'LEC' ? 'Passer à LFL' : 'Passer à LEC'}
      </button>

      <div className="team-container">
        {teams.length > 0 ? (
          teams.map((team) => (
            <div 
              key={team.id} 
              className="team-card"
              style={{
                backgroundColor: team.color || '#333', // Couleur de fond personnalisée pour chaque équipe
                color: '#000' // Texte en noir
              }}
            >
              <div className="team-header">
                <img
                  src={`/logos/${team.logo}`}
                  alt={`${team.name} logo`}
                  width="50"
                  height="50"
                  className="team-logo"
                />
                <h3 className="team-name">{team.name}</h3>
              </div>

              <table border="1" className="team-table">
                <thead>
                  <tr>
                    <th className="team-header-cell">Rôle</th>
                    <th className="team-header-cell">Joueur</th>
                  </tr>
                </thead>
                <tbody>
                  {['Top', 'Jng', 'Mid', 'Adc', 'Sup'].map((role) => (
                    <tr key={role} className='team-tr'>
                      <td className="team-role-cell">
                        <div className="team-role-container">
                          <img
                            src={`/logos/${role.toLowerCase()}.png`}
                            alt={`${role} logo`}
                            width="30"
                            height="30"
                            className="role-logo"
                          />
                          <div className="team-separator"></div>
                          <span>{role}</span>
                        </div>
                      </td>
                      <td className="team-player-cell">
                        {team.players.find((player) => player.role === role)?.name || 'Non spécifié'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p>Aucune équipe trouvée.</p>
        )}
      </div>
    </div>
  );
};

export default Teams;
