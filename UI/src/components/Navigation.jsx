import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'; 

function Navigation() {
  return (
    <Navbar className="navbar" expand="lg">
      <Navbar.Brand as={Link} to="/" className="nav-link-black">Accueil</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto ">
          <Nav.Link as={Link} to="/possessions">Possessions</Nav.Link>
          <Nav.Link as={Link} to="/chart">Patrimoine</Nav.Link>
        </Nav>
        <Nav className="ml-auto">
          <Button variant="success" className='cote' as={Link} to="/add">Ajouter une Possession</Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
