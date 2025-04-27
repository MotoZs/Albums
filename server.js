const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const DATA_FILE = 'adatok.json';

function readData() {
  const raw = fs.readFileSync(DATA_FILE);
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Összes album lekérése
app.get('/albums', (req, res) => {
  const data = readData();
  res.json(data.albums);
});

// Új album hozzáadása
app.post('/albums', (req, res) => {
  const { zenekar, albumCim, evszam, mufaj } = req.body;
  if (!zenekar || !albumCim || !evszam || !mufaj) {
    return res.status(400).send('Hiányzó adat');
  }
  const data = readData();
  data.albums.push({ zenekar, albumCim, evszam, mufaj });
  writeData(data);
  res.status(201).send('Album hozzáadva');
});

// Egy album törlése
app.delete('/albums', (req, res) => {
  const { zenekar, albumCim } = req.body;
  if (!zenekar || !albumCim) {
    return res.status(400).send('Hiányzó adat');
  }
  let data = readData();
  data.albums = data.albums.filter(album => !(album.zenekar === zenekar && album.albumCim === albumCim));
  writeData(data);
  res.send('Album törölve');
});

// Egy album módosítása (EZ A FRISSÍTETT!)
app.put('/albums', (req, res) => {
  console.log('PUT kérés érkezett:', req.body);  // DEBUG
  const { regiZenekar, regiAlbumCim, ujZenekar, ujAlbumCim, evszam, mufaj } = req.body;
  
  if (!regiZenekar || !regiAlbumCim || !ujZenekar || !ujAlbumCim || !evszam || !mufaj) {
    return res.status(400).send('Hiányzó adat');
  }

  const data = readData();
  
  const index = data.albums.findIndex(album =>
    album.zenekar === regiZenekar && album.albumCim === regiAlbumCim
  );

  if (index === -1) {
    return res.status(404).send('Nem található az album');
  }

  // Teljes adat frissítése
  data.albums[index] = {
    zenekar: ujZenekar,
    albumCim: ujAlbumCim,
    evszam: evszam,
    mufaj: mufaj
  };

  writeData(data);
  res.send('Album módosítva');
});

app.listen(3000, () => {
  console.log(`API fut a 3000-es porton!`);
});
