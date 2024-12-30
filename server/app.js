const express = require('express');
const cors = require('cors');
 const translateRoutes = require('../routes/translate-routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1/traslate', translateRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
