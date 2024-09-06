import fs from 'node:fs';
import Possession from '../models/possessions/Possession.js';

export const DATABASE_PATH = "./backend/data.json";
export function getPossessionsFromData(fileContent) {
  const patrimoine = fileContent.find(e => e.model === "Patrimoine");
  return patrimoine.data.possessions;
}

export function readDatabase() {
  let fileContent = fs.readFileSync(DATABASE_PATH, 'utf8');
  return JSON.parse(fileContent);
}

export function mapToPossessionModel(possession) {
  return new Possession(
    possession.possesseur.nom,
    possession.libelle,
    possession.valeur,
    new Date(possession.dateDebut),
    possession.dateFin ? new Date(possession.dateFin) : null,
    possession.tauxAmortissement || 0
  );
}

export function getPatrimoineValueInDate(possessions, date) {
  return possessions.reduce((sum, pos) => {
    return sum + (pos.getValeurApresAmortissement(date) || pos.valeur);
  }, 0);
}

export function getDateRange(dateDebut, dateFin, jour) {
  const startDate = new Date(dateDebut);
  const endDate = new Date(dateFin);
  const dates = [];

  if (startDate.getDate() > jour) {
    startDate.setMonth(startDate.getMonth() + 1);
  }
  startDate.setDate(jour);

  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setMonth(currentDate.getMonth() + 1);
    currentDate.setDate(jour);
  }

  return dates;
}
