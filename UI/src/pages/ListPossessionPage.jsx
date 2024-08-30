import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Button } from 'react-bootstrap';

const ListPossessionPage = () => {
  const [possessions, setPossessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPossessions = async () => {
      try {
        const response = await fetch('/possession');
        if (response.ok) {
          const data = await response.json();
          setPossessions(data);
        }
      } catch (error) {
        console.error('Error fetching possessions:', error);
      }
    };

    fetchPossessions();
  }, []);

  const handleEdit = (libelle) => {
    navigate(`/possession/${libelle}/update`);
  };

  const handleClose = async (libelle) => {
    try {
      const response = await fetch(`/possession/${libelle}/close`, {
        method: 'PUT',
      });
      if (response.ok) {
        setPossessions(possessions.map((possession) =>
          possession.libelle === libelle ? { ...possession, dateFin: new Date().toISOString() } : possession
        ));
      }
    } catch (error) {
      console.error('Error closing possession:', error);
    }
  };

  return (
    <Container>
      <h1>List of Possessions</h1>
      <Button variant="primary" onClick={() => navigate('/possession/create')}>
        Create Possession
      </Button>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Libelle</th>
            <th>Valeur</th>
            <th>Date Début</th>
            <th>Date Fin</th>
            <th>Taux</th>
            <th>Valeur Actuelle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {possessions.map((possession) => (
            <tr key={possession.libelle}>
              <td>{possession.libelle}</td>
              <td>{possession.valeur}</td>
              <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
              <td>{possession.dateFin ? new Date(possession.dateFin).toLocaleDateString() : 'Ongoing'}</td>
              <td>{possession.tauxAmortissement}</td>
              <td>{/* Calculer la valeur actuelle ici */}</td>
              <td>
                <Button variant="secondary" onClick={() => handleEdit(possession.libelle)}>
                  Edit
                </Button>
                {' '}
                <Button variant="danger" onClick={() => handleClose(possession.libelle)} disabled={!!possession.dateFin}>
                  Close
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ListPossessionPage;
