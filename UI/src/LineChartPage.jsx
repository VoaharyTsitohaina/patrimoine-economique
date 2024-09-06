import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Container, Form, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import './App.css';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function LineChartPage() {
  const [query, setQuery] = useState({
    dateDebut: new Date().toISOString(),
    dateFin: new Date().toISOString(),
    jour: new Date().getDate()
  });
  const [rangeData, setRangeData] = useState({ labels: [], datasets: [] });
  const { dateDebut, dateFin, jour } = query;

  useEffect(() => {
    fetchRangeData();
  }, [dateDebut, dateFin, jour]);

  const fetchRangeData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/graphics', {
        params: {
          dateDebut,
          dateFin,
          jour: jour || 0
        },
      });
      const fetchedData = response.data;

      setRangeData({
        labels: fetchedData.map(res => new Date(res.date).toLocaleString()),
        datasets: [
          {
            label: 'Valeur du Patrimoine',
            data: fetchedData.map(res => res.value),
            borderColor: '#4e73df',
            backgroundColor: 'rgba(78, 115, 223, 0.05)',
            pointBackgroundColor: '#4e73df',
            fill: true,
            tension: 0.4,
          },
        ],
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  return (
    <Container className="my-5">
      <h1 className="text-primary text-center mb-4">Vue d'Ensemble du Patrimoine</h1>

      <Row>
        <Col md={4}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Form>
                <Form.Group controlId="dateDebut">
                  <Form.Label>Date Début</Form.Label>
                  <DatePicker
                    selected={new Date(dateDebut)}
                    onChange={(date) => setQuery(prev => ({ ...prev, dateDebut: date.toISOString() }))}
                    dateFormat="yyyy-MM-dd"
                    className="form-control"
                  />
                </Form.Group>
                <Form.Group controlId="dateFin" className="mt-3">
                  <Form.Label>Date Fin</Form.Label>
                  <DatePicker
                    selected={new Date(dateFin)}
                    onChange={(date) => setQuery(prev => ({ ...prev, dateFin: date.toISOString() }))}
                    dateFormat="yyyy-MM-dd"
                    className="form-control"
                  />
                </Form.Group>
                <Form.Group controlId="jour" className="mt-3">
                  <Form.Label>Jour</Form.Label>
                  <input
                    type="number"
                    value={jour}
                    onChange={(event) => setQuery(prev => ({ ...prev, jour: event.target.value }))}
                    className="form-control"
                    min="1"
                    max="31"
                  />
                </Form.Group>
                <Button onClick={fetchRangeData} variant="primary" className="mt-4" block>
                  Afficher les Données
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h4 className="text-center mb-4">Valeur du Patrimoine (Plage de Dates)</h4>
              <Line data={rangeData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LineChartPage;
