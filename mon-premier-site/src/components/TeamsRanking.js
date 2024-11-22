import React, { Component } from "react";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable as Droppable } from "../helpers/StrictModeDroppable";
import teamsData from "../data/teams.json"; // Importer les données JSON
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
      items: teamsData.teams.map((team) => ({
        id: team.id,
        name: team.name,
        logo: team.logo,
        color: team.color, // Ajoutez la couleur pour chaque équipe
      })),
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items,
    });
  }

  saveRanking() {
    // Préparer les données pour sauvegarde
    const updatedData = { ...teamsData, ranking: this.state.items };

    // Sauvegarder dans le fichier JSON via une API ou localStorage
    localStorage.setItem("teamRanking", JSON.stringify(updatedData));

    alert("Classement sauvegardé !");
  }

  componentDidMount() {
    // Charger le classement depuis localStorage si disponible
    const savedRanking = localStorage.getItem("teamRanking");
    if (savedRanking) {
      const parsedRanking = JSON.parse(savedRanking);
      this.setState({
        items: parsedRanking.ranking,
      });
    }
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
