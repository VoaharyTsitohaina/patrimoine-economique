import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';

const UpdatePossessionPage = () => {
  const { libelle } = useParams();
  const [dateFin, setDateFin] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPossession = async () => {
      try {
        const response = await fetch(`/possession/${libelle}`);
        if (response.ok) {
          const data = await response.json();
          setDateFin(data.dateFin || '');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching possession:', error);
      }
    };

    fetchPossession();
  }, [libelle]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/possession/${libelle}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dateFin }),
      });

      if (response.ok) {
        navigate('/possession');
      }
    } catch (error) {
      console.error('Error updating possession:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Container>
      <h1>Update Possession: {libelle}</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="dateFin">
          <Form.Label>Date Fin</Form.Label>
          <Form.Control
            type="date"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Update
        </Button>
      </Form>
    </Container>
  );
};

export default UpdatePossessionPage;
