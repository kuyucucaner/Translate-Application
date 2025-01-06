const express = require('express');
const cors = require('cors');
 const translateRoutes = require('./routes/translate-routes');
 const bodyParser = require('body-parser');

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());

  app.use(express.json());
app.use('/api/v1/translate', translateRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
