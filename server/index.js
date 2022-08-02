require('dotenv').config();
const express = require('express');
const path = require('path');
const controller = require('./controller');
const app = express();

app.use(express.json());

app.get('/reviews', (req, res) => {
  controller.getReviews(req, res);
});

app.post('/reviews', (req, res) => {
  controller.postReview(req, res);
});

app.get('/reviews/meta', (req, res) => {
  controller.getMeta(req, res);
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  controller.putHelpful(req, res);
});

app.put('/reviews/:review_id/report', (req, res) => {
  controller.putReport(req, res);
});

const port = 3000;

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
