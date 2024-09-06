import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; 

function Home() {
  return (
    <div className=" home-container">
      <div className="text-center ">
        <h1 className="text-green mb-4">Bienvenue dans l'application de gestion de patrimoine !</h1>
        <div className="btn-group">
          <Link to="/possessions" className="btn btn-dark">Liste des Possessions</Link>
          <Link to="/add" className="btn btn-light">Ajouter une Possession</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
