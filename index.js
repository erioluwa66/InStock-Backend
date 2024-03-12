const express = require('express');
const app = express();
require("dotenv").config();
app.use(express.json());

const PORT = process.env.PORT || 5050;

const userRoutes = require('./routes/user-routes');
// basic home route
app.get('/', (req, res) => {
  res.send('Welcome to my API');
});

// all users routes
app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});