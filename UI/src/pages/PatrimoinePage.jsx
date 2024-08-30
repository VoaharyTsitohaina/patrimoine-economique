import { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import Chart from 'chart.js/auto';

const PatrimoinePage = () => {
  const [date, setDate] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [jour, setJour] = useState(1);
  const [patrimoine, setPatrimoine] = useState(null);
  const [patrimoineRange, setPatrimoineRange] = useState([]);

  const fetchPatrimoine = async () => {
    try {
      const response = await fetch(`/patrimoine/${date}`);
      if (response.ok) {
        const data = await response.json();
        setPatrimoine(data.valeur);
      }
    } catch (error) {
      console.error('Error fetching patrimoine:', error);
    }
  };

  const fetchPatrimoineRange = async () => {
    try {
      const response = await fetch('/patrimoine/range', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'month',
          dateDebut,
          dateFin,
          jour: parseInt(jour, 10),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setPatrimoineRange(data.values);
        renderChart(data.values);
      }
    } catch (error) {
      console.error('Error fetching patrimoine range:', error);
    }
  };

  const renderChart = (data) => {
    const ctx = document.getElementById('patrimoineChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(item => new Date(item.date).toLocaleDateString()),
        datasets: [{
          label: 'Valeur Patrimoine',
          data: data.map(item => item.valeur),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Valeur'
            },
            beginAtZero: true
          }
        }
      }
    });
  };

  return (
    <Container>
      <h1>Patrimoine</h1>

      <Form className="mb-4">
        <Form.Group controlId="date">
          <Form.Label>Date</Form.Label>
          <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Form.Group>
        <Button variant="primary" onClick={fetchPatrimoine}>Get Valeur Patrimoine</Button>
        {patrimoine !== null && <p>Valeur Patrimoine: {patrimoine}</p>}
      </Form>

      <Form className="mb-4">
        <Form.Group controlId="dateDebut">
          <Form.Label>Date Début</Form.Label>
          <Form.Control type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="dateFin">
          <Form.Label>Date Fin</Form.Label>
          <Form.Control type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="jour">
          <Form.Label>Jour</Form.Label>
          <Form.Control type="number" value={jour} onChange={(e) => setJour(e.target.value)} />
        </Form.Group>
        <Button variant="primary" onClick={fetchPatrimoineRange}>Get Valeur Patrimoine Range</Button>
      </Form>

      <canvas id="patrimoineChart"></canvas>
    </Container>
  );
};

export default PatrimoinePage;
