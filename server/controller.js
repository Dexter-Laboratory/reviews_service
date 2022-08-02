const model = require('./model.js');

module.exports = {
  getReviews: (req, res) => {
    let { product_id, page, count, sort, } = req.query;
    product_id = Number(product_id);
    page = Number(page) || 1;
    count = Number(count) || 5;
    sort = sort || 'relevant';

    return model.getReviews({
      product_id, page, count, sort,
    })
      .then((data) => {
        res.send({
          product: product_id.toString(),
          page: page - 1,
          count,
          results: data.rows,
        });
        res.status(200).end();
      })
      .catch((err) => {
        res.send(err);
        res.status(500).end();
      });
    
  },

//////////////////////////////////////////////////////////////////////////////////////

  postReview: (req, res) => {
    console.log('Inside controller postReview before if else statement')
    if (req.body.product_id === undefined || typeof (req.body.product_id) !== 'number') {
      res.status(400).send('Invalid product_id input');
    } else if (req.body.rating === undefined || typeof (req.body.rating) !== 'number') {
      res.status(400).send('Invalid rating input');
    } else if (req.body.summary === undefined || typeof (req.body.summary) !== 'string') {
      res.status(400).send('Invalid summary input');
    } else if (req.body.body === undefined || typeof (req.body.body) !== 'string') {
      res.status(400).send('Invalid body input');
    } else if (req.body.recommend === undefined || typeof (req.body.recommend) !== 'boolean') {
      res.status(400).send('Invalid boolean input');
    } else if (req.body.name === undefined || typeof (req.body.name) !== 'string') {
      res.status(400).send('Invalid name input');
    } else if (req.body.email === undefined || typeof (req.body.email) !== 'string') {
      res.status(400).send('Invalid email input');
    } else {
      console.log('Inside controller postReview inside else');
      model.postReview(req)
      .then(()=>
      {res.sendStatus(201)})
      .catch(()=>{
        console.log("error in controller .catch block");
        res.status(400).send("Err")});
    }
  },

  //////////////////////////////////////////////////////////////////////////////////////

  getMeta: (req, res) => {
    // const productId = parseInt(req.query.product_id, 10);
    if (req.query.product_id === undefined) {
      res.status(400).send('Invalid product_id input');
    } else {
      model.getMeta(req.query.product_id, (err, data) => {
        if (err) {
          res.status(404).send(err)
        } else {
          res.status(200).send(data)
        }
      })
    }
  },

  //////////////////////////////////////////////////////////////////////////////////////

  putHelpful: (req, res) => {
    const reviewId = parseInt(req.params.review_id, 10);
    if (req.params.review_id === undefined || typeof reviewId !== 'number') {
      res.status(400).send('Invalid review_id input');
    } else {
      model.putHelpful(reviewId, (err) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(204).send('updated');
        }
      });
    }
  },

  putReport: (req, res) => {
    const reviewId = Number(req.params.review_id);
    if (req.params.review_id === undefined || typeof reviewId !== 'number') {
      res.status(400).send('Invalid review_id input');
    } else {
      model.putReport(reviewId, (err) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(204).send('updated');
          }
      })
    }
  },
};