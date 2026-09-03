const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static compiled files from dist or docs
const staticDir = path.join(__dirname, 'dist');
app.use(express.static(staticDir));

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Sprint 7: Enterprise Form Portal running on http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
