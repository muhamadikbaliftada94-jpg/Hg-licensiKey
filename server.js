const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let databaseKey = {
  "KENZ-VIP-123": { expired: "2026-12-31", status: "active" },
  "PADIL-GH71-89FG": { expired: "2026-12-31", status: "active" }
};

app.post('/api/check-key', (req, res) => {
  const { key } = req.body;
  if (!key) return res.json({ status: "error", message: "Key kosong!" });
  const license = databaseKey[key];
  if (license) {
    if (license.status !== "active") return res.json({ status: "error", message: "Key diblokir!" });
    const today = new Date().toISOString().split('T')[0];
    if (today > license.expired) return res.json({ status: "error", message: "Key kadaluarsa!" });
    return res.json({ status: "success", message: "Login Berhasil" });
  } else {
    return res.json({ status: "error", message: "Key tidak valid!" });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/add-key', (req, res) => {
  const { newKey, expired } = req.body;
  if (newKey && expired) {
    databaseKey[newKey] = { expired: expired, status: "active" };
    res.json({ success: true, message: `Key ${newKey} berhasil ditambahkan!` });
  } else {
    res.json({ success: false, message: "Isi semua data!" });
  }
});

app.get('/api/list-keys', (req, res) => {
  res.json(databaseKey);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
