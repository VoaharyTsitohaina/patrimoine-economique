import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Card, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa';
import Possession from '../../models/possessions/Possession';

function PossessionList() {
  const [possessions, setPossessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalValue, setTotalValue] = useState(0);
  const [totalCurrentValue, setTotalCurrentValue] = useState(0); 
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPossession, setSelectedPossession] = useState(null);
  const [updateForm, setUpdateForm] = useState({ libelle: '', dateFin: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/possession");
        const jsonData = await response.json();

        if (jsonData) {
          const updatedPossessions = jsonData.map(pos => {
            const possessionInstance = new Possession(
              pos.possesseur.nom,
              pos.libelle,
              pos.valeur,
              new Date(pos.dateDebut),
              pos.dateFin ? new Date(pos.dateFin) : null,
              pos.tauxAmortissement || 0
            );
            return {
              ...pos,
              valeurActuelle: possessionInstance.getValeurApresAmortissement(new Date()) || pos.valeur
            };
          });

          const initialTotalCurrentValue = updatedPossessions.reduce((sum, pos) => sum + (pos.valeurActuelle || pos.valeur), 0);
          setPossessions(updatedPossessions);
          setTotalCurrentValue(initialTotalCurrentValue);
        } else {
          console.error("Invalid data structure:", jsonData);
        }
      } catch (error) {
        console.error("Error fetching possessions:", error);
      }
    };

    fetchData();
  }, []);

  const applyDate = () => {
    const updatedPossessions = possessions.map(possession => {
      const possessionInstance = new Possession(
        possession.possesseur.nom,
        possession.libelle,
        possession.valeur,
        new Date(possession.dateDebut),
        possession.dateFin ? new Date(possession.dateFin) : null,
        possession.tauxAmortissement || 0
      );

      const valeurActuelle = possessionInstance.getValeurApresAmortissement(selectedDate);
      return {
        ...possession,
        valeurActuelle
      };
    });

    setPossessions(updatedPossessions);
    const totalCurrent = updatedPossessions.reduce((sum, pos) => sum + (pos.valeurActuelle || pos.valeur), 0);
    setTotalCurrentValue(totalCurrent);
  };

  const handleUpdate = (poss) => {
    setSelectedPossession(poss);
    setUpdateForm({
      libelle: poss.libelle.replace(/\s*\(.*\)$/, ''),
      dateFin: poss.dateFin ? new Date(pos.dateFin).toISOString().split('T')[0] : ''
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/possession/${selectedPossession.libelle}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          libelle: updateForm.libelle,
          dateFin: updateForm.dateFin
        })
      });
      const updatedPossession = await response.json();
      setPossessions(possessions.map(p => p.libelle === updatedPossession.libelle ? updatedPossession : p));
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error updating possession:', error);
    }
  };

  const handleClose = async (index) => {
    const possessionToClose = possessions[index];
    try {
      await fetch(`http://localhost:5000/possession/${possessionToClose.libelle}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...possessionToClose,
          dateFin: new Date().toISOString().split('T')[0]
        })
      });
      const updatedPossessions = [...possessions];
      updatedPossessions[index].dateFin = new Date().toISOString().split('T')[0];
      setPossessions(updatedPossessions);
    } catch (error) {
      console.error('Error closing possession:', error);
    }
  };

  const handleDelete = async (index) => {
    const possessionToDelete = possessions[index];
    try {
      await fetch(`http://localhost:5000/possession/${possessionToDelete.libelle}`, {
        method: 'DELETE',
      });
      const updatedPossessions = possessions.filter((_, i) => i !== index);
      setPossessions(updatedPossessions);
    } catch (error) {
      console.error('Error deleting possession:', error);
    }
  };

  return (
    <div className="container">
      <Row>
        <Col md={8}>
          <h3>Liste des Possessions</h3>
          <Card>
            <Card.Body>
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>Possesseur</th>
                    <th>Libelle</th>
                    <th>Valeur</th>
                    <th>Date Début</th>
                    <th>Date Fin</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {possessions.map((poss, index) => (
                    <tr key={index}>
                      <td>{poss.possesseur.nom}</td>
                      <td>{poss.libelle}</td>
                      <td>{poss.valeur}</td>
                      <td>{new Date(poss.dateDebut).toLocaleDateString()}</td>
                      <td>{poss.dateFin ? new Date(poss.dateFin).toLocaleDateString() : "N/A"}</td>
                      <td>
                        <FaTimes onClick={() => handleClose(index)} className="text-info mr-2" />
                        <FaEdit onClick={() => handleUpdate(poss)} className="text-warning mr-2" />
                        <FaTrashAlt onClick={() => handleDelete(index)} className="text-danger" />
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="5" className="text-right font-weight-bold">Total Valeur Actuelle :</td>
                    <td>{totalCurrentValue.toFixed(2)}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <h3>Calculateur de Patrimoine</h3>
          <Card>
            <Card.Body>
              <Form>
                <Form.Group>
                  <Form.Label>Sélectionnez une date:</Form.Label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="dd/MM/yyyy"
                  />
                </Form.Group>
                <Button onClick={applyDate} variant="primary" block>Appliquer</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Mettre à jour la possession</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateSubmit}>
            <Form.Group controlId="libelle">
              <Form.Label>Libellé</Form.Label>
              <Form.Control
                type="text"
                value={updateForm.libelle}
                onChange={(e) => setUpdateForm({ ...updateForm, libelle: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="dateFin">
              <Form.Label>Date de fin</Form.Label>
              <Form.Control
                type="date"
                value={updateForm.dateFin}
                onChange={(e) => setUpdateForm({ ...updateForm, dateFin: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" type="submit">Enregistrer les modifications</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PossessionList;
