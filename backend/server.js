import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const app = express();
app.use(express.json());

const dataPath = path.resolve('backend/data/data.json');

// Function to read data from the JSON file
async function readData() {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error('Could not read data file');
  }
}

// Function to write data to the JSON file
async function writeData(data) {
  try {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    throw new Error('Could not write data file');
  }
}

// Get all possessions
app.get('/possession', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.Patrimoine.possessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new possession
app.post('/possession', async (req, res) => {
  try {
    const { libelle, valeur, dateDebut, taux } = req.body;
    const data = await readData();

    const newPossession = {
      possesseur: { nom: data.Personne.nom },
      libelle,
      valeur,
      dateDebut,
      dateFin: null,
      tauxAmortissement: taux,
    };

    data.Patrimoine.possessions.push(newPossession);
    await writeData(data);
    res.status(201).json(newPossession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a possession by libelle
app.put('/possession/:libelle', async (req, res) => {
  try {
    const { libelle } = req.params;
    const { dateFin } = req.body;
    const data = await readData();

    const possession = data.Patrimoine.possessions.find(p => p.libelle === libelle);
    if (!possession) {
      return res.status(404).json({ error: 'Possession not found' });
    }

    possession.dateFin = dateFin;
    await writeData(data);
    res.json(possession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Close a possession (set dateFin to current Date)
app.put('/possession/:libelle/close', async (req, res) => {
  try {
    const { libelle } = req.params;
    const data = await readData();

    const possession = data.Patrimoine.possessions.find(p => p.libelle === libelle);
    if (!possession) {
      return res.status(404).json({ error: 'Possession not found' });
    }

    possession.dateFin = new Date().toISOString();
    await writeData(data);
    res.json(possession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get patrimoine value by a specific date
app.get('/patrimoine/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const data = await readData();
    const targetDate = new Date(date);

    const patrimoineValue = data.Patrimoine.possessions.reduce((acc, possession) => {
      const startDate = new Date(possession.dateDebut);
      const endDate = possession.dateFin ? new Date(possession.dateFin) : new Date();
      if (startDate <= targetDate && targetDate <= endDate) {
        acc += possession.valeur;
      }
      return acc;
    }, 0);

    res.json({ date: targetDate.toISOString(), valeur: patrimoineValue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get patrimoine value over a range of dates
app.post('/patrimoine/range', async (req, res) => {
  try {
    const { type, dateDebut, dateFin, jour } = req.body;
    const data = await readData();
    const startDate = new Date(dateDebut);
    const endDate = new Date(dateFin);

    const patrimoineValues = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const patrimoineValue = data.Patrimoine.possessions.reduce((acc, possession) => {
        const possessionStartDate = new Date(possession.dateDebut);
        const possessionEndDate = possession.dateFin ? new Date(possession.dateFin) : new Date();
        if (possessionStartDate <= currentDate && currentDate <= possessionEndDate) {
          acc += possession.valeur;
        }
        return acc;
      }, 0);

      patrimoineValues.push({ date: currentDate.toISOString(), valeur: patrimoineValue });

      currentDate.setDate(currentDate.getDate() + jour);
    }

    res.json({ type, values: patrimoineValues });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
