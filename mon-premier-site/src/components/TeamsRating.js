import React, { useState, useEffect } from 'react';
import data from '../data/teams.json';
import '../css/TeamsRating.css'; // Import du CSS
import { Modal } from 'react-bootstrap'; // Import des composants de react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'; // Import du CSS Bootstrap

function TeamRating() {
  const [teams, setTeams] = useState([]);
  const [ratings, setRatings] = useState({}); // Notes des équipes
  const [playerRatings, setPlayerRatings] = useState({}); // Notes des joueurs
  const [gRated, setGRated] = useState(null); // État pour savoir quelle équipe a la note "G"
  const [showModal, setShowModal] = useState(false); // Contrôle de l'affichage de la modale
  const [modalMessage, setModalMessage] = useState("");
  

  useEffect(() => {
    setTeams(data.teams);
  }, []);

  // Fonction pour fermer la modale
  const closeModal = () => {
    setShowModal(false);
  };

  // Fonction pour ouvrir la modale
  const openModal = (Message) => {
    setModalMessage(Message);
    setShowModal(true);
  };

  // Fonction pour la gestion de la note de l'équipe
  const handleTeamRatingChange = (teamId, newRating) => {
    const team = teams.find(t => t.id === teamId); 
  
    if (newRating === 'G') {
      if (gRated !== null && gRated !== teamId) {
        const existingTeam = teams.find(t => t.id === gRated);
        openModal(`Attention, l'équipe ${existingTeam.name} a déjà la note 'G'. Vous ne pouvez pas attribuer la note 'G' à ${team.name}.`);
        return;
      }
      setGRated(teamId); 
    } else if (ratings[teamId] === 'G' && newRating !== 'G') {
      setGRated(null); 
    }
  
    setRatings((prevRatings) => ({
      ...prevRatings,
      [teamId]: newRating,
    }));
  };
  
  const handlePlayerRatingChange = (teamId, playerName, newRating, role) => {
    // Vérifier si un joueur dans le même rôle, mais dans une autre équipe, a déjà la note "G"
    const existingPlayer = Object.keys(playerRatings).reduce((foundPlayer, teamKey) => {
      if (foundPlayer) return foundPlayer; // Si un joueur a déjà été trouvé avec "G", arrêter la recherche
  
      // Chercher un joueur avec la note "G" et le même rôle dans une autre équipe
      const player = Object.values(playerRatings[teamKey]).find(player => 
        player.rating === 'G' && player.role === role && teamKey !== teamId // Exclure l'équipe actuelle
      );
  
      // Si un joueur est trouvé, retourner ce joueur avec son nom et l'équipe
      return player ? { ...player, teamId: teamKey, playerName: player.name } : foundPlayer; // Inclure playerName et teamId
    }, null);
  
    // Débogage : log de l'existingPlayer
    console.log('Joueur existant en "G" :', existingPlayer);
  
    // Si un joueur avec le même rôle a déjà la note "G" dans une autre équipe, afficher un message d'erreur
    if (existingPlayer && existingPlayer.role === role) {
      openModal(`Chef, tu  peux pas mettre ${playerName} en 'G' quand le ${role} de l'équipe ${teams[existingPlayer.teamId - 1].name} existe`);
      return; // Bloquer l'attribution de "G"
    }
  
    // Si tout est ok, mettre à jour la note du joueur
    setPlayerRatings(prevRatings => {
      const updatedRatings = { ...prevRatings };
      if (!updatedRatings[teamId]) {
        updatedRatings[teamId] = {};
      }
      updatedRatings[teamId][playerName] = { rating: newRating, role };
      return updatedRatings;
    });
  };
  
  
  
  
  

  // Fonction pour calculer le fond en fonction de la note
  const getBackgroundColor = (rating) => {
    switch (rating) {
      case 'G': return 'linear-gradient(180deg, #FFD700, #FFB300)';
      case 'S': return 'linear-gradient(180deg, #4CAF50, #388E3C)';
      case 'A': return 'linear-gradient(180deg, #66BB6A, #388E3C)';
      case 'B': return 'linear-gradient(180deg, #FFEB3B, #FFB300)';
      case 'C': return 'linear-gradient(180deg, #FF9800, #F57C00)';
      case 'D': return 'linear-gradient(180deg, #FF5722, #D32F2F)';
      case 'E': return 'linear-gradient(180deg, #F44336, #D32F2F)';
      case 'F': return 'linear-gradient(180deg, #D32F2F, #B71C1C)';
      default: return '#444';
    }
  };

  // Fonction pour obtenir la couleur de fond de chaque option
  const getOptionColor = (rating) => {
    switch (rating) {
      case 'G': return '#FFD700'; // Jaune doré pour "G"
      case 'S': return '#4CAF50'; // Vert
      case 'A': return '#66BB6A'; // Vert clair
      case 'B': return '#FFEB3B'; // Jaune
      case 'C': return '#FF9800'; // Orange
      case 'D': return '#FF5722'; // Rouge clair
      case 'E': return '#F44336'; // Rouge
      case 'F': return '#D32F2F'; // Rouge foncé
      default: return '#444';
    }
  };

  return (
    <div>
      <h2>Notes des équipes</h2>
      <div className="team-container">
        {teams.length > 0 ? (
          teams.map((team) => (
            <div
              key={team.id}
              className="team-card"
              style={{
                backgroundColor: team.color || '#333',
                color: '#000',
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

                {/* Liste déroulante pour la note de l'équipe */}
                <select
                  value={ratings[team.id] || 'S'}
                  onChange={(e) => handleTeamRatingChange(team.id, e.target.value)}
                  style={{ background: getBackgroundColor(ratings[team.id] || 'S') }}
                >
                  {['G', 'S', 'A', 'B', 'C', 'D', 'E', 'F'].map((rating) => (
                    <option
                      key={rating}
                      value={rating}
                      style={{ backgroundColor: getOptionColor(rating), color: 'white' }}
                    >
                      {rating}
                    </option>
                  ))}
                </select>
              </div>

              <table border="1" className="team-table">
                <thead>
                  <tr>
                    <th className="team-header-cell">Rôle</th>
                    <th className="team-header-cell">Joueur</th>
                    <th className="team-header-cell">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {['Top', 'Jng', 'Mid', 'Adc', 'Sup'].map((role) => (
                    <tr key={role} className="team-tr">
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
                      <td className="team-player-rating-cell">
                        <select
                          value={playerRatings[team.id]?.[team.players.find((player) => player.role === role)?.name]?.rating || 'S'}
                          onChange={(e) => {
                            const playerName = team.players.find((player) => player.role === role)?.name;
                            handlePlayerRatingChange(team.id, playerName, e.target.value, role);
                          }}
                          style={{
                            background: getBackgroundColor(playerRatings[team.id]?.[team.players.find((player) => player.role === role)?.name]?.rating || 'S'),
                          }}
                        >
                          {['G', 'S', 'A', 'B', 'C', 'D', 'E', 'F'].map((rating) => (
                            <option
                              key={rating}
                              value={rating}
                              style={{ backgroundColor: getOptionColor(rating), color: 'white' }}
                            >
                              {rating}
                            </option>
                          ))}
                        </select>
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

      {/* Modale Bootstrap */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header style={{ backgroundColor: 'red', color: 'white' }} closeButton>
          <Modal.Title>Dose le sang!</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'red', color: 'white', textAlign: 'center', borderRadius: '10px', padding: '20px', }}>
          {modalMessage}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default TeamRating;
