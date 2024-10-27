const express = require('express');
const app = express();
const orderRoutes = require('./routes/orderRoutes');

// ... other middleware and configurations ...

app.use('/api/orders', orderRoutes);

// ... rest of your server setup ...
