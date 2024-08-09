import { useState, useEffect } from "react";
import { Container, Table, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

export default function App() {
  const [possessions, setPossessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // Format YYYY-MM-DD
  const [valeurPatrimoine, setValeurPatrimoine] = useState(0);

  useEffect(() => {
    // Chargement des données depuis le fichier JSON
    async function fetchData() {
      const response = await fetch("/data.json");
      const data = await response.json();
      setPossessions(data[1].data.possessions);
    }
    fetchData();
  }, []);

  const calculateValeurPatrimoine = () => {
    // Simulation de la logique de calcul de la valeur actuelle
    let totalValue = 0;
    possessions.forEach((possession) => {
      const startDate = new Date(possession.dateDebut);
      const endDate = possession.dateFin ? new Date(possession.dateFin) : new Date();
      const currentValue = possession.valeur;

      // Calcul de l'amortissement
      let amortissement = possession.tauxAmortissement || 0;
      const yearsElapsed = (new Date(selectedDate) - startDate) / (1000 * 60 * 60 * 24 * 365);
      const valeurActuelle = currentValue * Math.pow(1 - amortissement / 100, yearsElapsed);
      
      totalValue += valeurActuelle;
    });
    setValeurPatrimoine(totalValue);
  };

  return (
    <Container>
      <h1>Patrimoine de John Doe</h1>
      <Form>
        <Form.Group>
          <Form.Label>Sélectionner une date</Form.Label>
          <Form.Control
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </Form.Group>
        <Button onClick={calculateValeurPatrimoine} className="mt-3">Calculer Valeur Patrimoine</Button>
      </Form>

      <Table striped bordered hover className="mt-5">
        <thead className="table">
          <tr>
            <th>Libelle</th>
            <th>Valeur Initiale</th>
            <th>Date Debut</th>
            <th>Date Fin</th>
            <th>Amortissement (%)</th>
            <th>Valeur Actuelle</th>
          </tr>
        </thead>
        <tbody>
          {possessions.map((possession, index) => (
            <tr key={index}>
              <td>{possession.libelle}</td>
              <td>{possession.valeur}</td>
              <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
              <td>{possession.dateFin ? new Date(possession.dateFin).toLocaleDateString() : "N/A"}</td>
              <td>{possession.tauxAmortissement || "N/A"}</td>
              <td>{(possession.valeur * Math.pow(1 - (possession.tauxAmortissement || 0) / 100, (new Date(selectedDate) - new Date(possession.dateDebut)) / (1000 * 60 * 60 * 24 * 365))).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2 className="mt-5">Valeur Totale du Patrimoine: {valeurPatrimoine.toFixed(2)} Ar</h2>
    </Container>
  );
}
