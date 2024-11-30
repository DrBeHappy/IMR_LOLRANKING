import React, { Component } from "react";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable as Droppable } from "../helpers/StrictModeDroppable";
import teamsData from "../data/testdb.json"; // Importer les données JSON
import "../css/TeamsRanking.css"; // Importer le fichier CSS

// Fonction pour réorganiser les éléments dans l'état
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const grid = 8;

// Fonction pour récupérer la couleur de l'équipe
const getItemStyle = (isDragging, draggableStyle, color) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? "lightgreen" : color, // Utiliser la couleur de l'équipe ici
  ...draggableStyle,
});

// Style de la liste au survol
const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: "100%", // S'assurer que la liste occupe toute la largeur de la zone Droppable
});

class TeamsRanking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLeague: "LEC", // Ligue sélectionnée
      items: [], // Classement des équipes pour la ligue sélectionnée
    };
    this.onDragEnd = this.onDragEnd.bind(this);
    this.saveRanking = this.saveRanking.bind(this);
    this.loadRanking = this.loadRanking.bind(this);
  }

  // Fonction pour récupérer l'ID de l'utilisateur connecté
  getCurrentUserId() {
    // Vérifie si l'utilisateur est stocké dans localStorage
    let userId = localStorage.getItem('userId');
    if (!userId) {
      localStorage.setItem('userId', userId); // Enregistrer dans localStorage pour les prochaines visites
    }
    return userId;
  }

   // Charger le classement depuis userRanking.json ou testdb.json
   async loadRanking() {
    const userId = this.getCurrentUserId();
    let userRankings;

    try {
      const response = await fetch("/data/userRanking.json");
      userRankings = await response.json();
    } catch (error) {
      console.error("Erreur lors du chargement des rankings :", error);
      userRankings = [];
    }

    // Trouver le classement de l'utilisateur pour la ligue sélectionnée
    const userRanking = userRankings.find(
      (ranking) =>
        ranking.userId === userId &&
        ranking.rankings[this.state.selectedLeague]
    );

    if (userRanking) {
      this.setState({
        items: userRanking.rankings[this.state.selectedLeague],
      });
    } else {
      // Charger les données par défaut si aucun classement n'existe
      const teams = teamsData.leagues[this.state.selectedLeague]?.teams || [];
      this.setState({
        items: teams.map((team) => ({
          id: team.id,
          name: team.name,
          logo: team.logo,
          color: team.color,
        })),
      });
    }
  }

  // Sauvegarder le classement dans userRanking.json
  async saveRanking() {
    const userId = this.getCurrentUserId();
    let userRankings;

    try {
      const response = await fetch("/data/userRanking.json");
      userRankings = await response.json();
    } catch (error) {
      console.error("Erreur lors du chargement des rankings :", error);
      userRankings = [];
    }

    const existingUser = userRankings.find((ranking) => ranking.userId === userId);

    if (existingUser) {
      existingUser.rankings[this.state.selectedLeague] = this.state.items;
    } else {
      userRankings.push({
        userId: userId,
        rankings: {
          [this.state.selectedLeague]: this.state.items,
        },
      });
    }

    try {
      await fetch("/data/userRanking.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userRankings),
      });
      alert("Classement sauvegardé !");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
    }
  }


  onDragEnd(result) {
    if (!result.destination) return;

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({ items });
  }

  async componentDidMount() {
    await this.loadRanking();
  }
  

  // Fonction pour changer la ligue sélectionnée
  changeLeague(league) {
    this.setState({ selectedLeague: league }, () => this.loadRanking());
  }

  render() {
    return (
      <div className="team-table-container">
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="team-ranking-table"
                style={getListStyle(snapshot.isDraggingOver)}
              >
                <div className="league-selector">
                  <button onClick={() => this.changeLeague("LEC")}>LEC</button>
                  <button onClick={() => this.changeLeague("LFL")}>LFL</button>
                </div>
                <div className="team-table-header">
                  <div className="team-table-column">Position</div>
                  <div className="team-table-column">Team</div>
                </div>
                {this.state.items.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className="team-table-row"
                        style={{
                          ...getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                            item.color // Passez la couleur dynamique de chaque équipe
                          ),
                        }}
                      >
                        <div className="team-table-column">
                          {/* Affiche la position (index + 1) */}
                          {index + 1}
                        </div>
                        <div className="team-table-column">
                          {/* Affiche le logo et le nom de l'équipe */}
                          <img
                            src={`/logos/${item.logo}`} // Le chemin des logos dans le dossier public
                            alt={item.name}
                            className="team-logo"
                          />
                          <span className="team-name">{item.name}</span>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                <button onClick={this.saveRanking} className="save-button">
                  Valider
                </button>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }
}

export default TeamsRanking;
