import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';

const CreatePossessionPage = () => {
  const [libelle, setLibelle] = useState('');
  const [valeur, setValeur] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [taux, setTaux] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPossession = { libelle, valeur: parseFloat(valeur), dateDebut, taux: parseFloat(taux) };

    try {
      const response = await fetch('/possession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPossession),
      });

      if (response.ok) {
        navigate('/possession');
      }
    } catch (error) {
      console.error('Error creating possession:', error);
    }
  };

  return (
    <Container>
      <h1>Create New Possession</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="libelle">
          <Form.Label>Libelle</Form.Label>
          <Form.Control
            type="text"
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="valeur">
          <Form.Label>Valeur</Form.Label>
          <Form.Control
            type="number"
            value={valeur}
            onChange={(e) => setValeur(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="dateDebut">
          <Form.Label>Date Début</Form.Label>
          <Form.Control
            type="date"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="taux">
          <Form.Label>Taux</Form.Label>
          <Form.Control
            type="number"
            value={taux}
            onChange={(e) => setTaux(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create
        </Button>
      </Form>
    </Container>
  );
};

export default CreatePossessionPage;
