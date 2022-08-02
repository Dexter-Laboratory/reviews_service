const db = require('../db.js');

module.exports = {
  getReviews: (params, cb) => {
    const sortMethod = {
      newest: 'ORDER BY reviews.date DESC',
      helpful: 'ORDER BY reviews.helpfulness DESC',
      relevant: 'ORDER BY reviews.helpfulness, reviews.date DESC',
    };
    const queryStr = `SELECT reviews.reviewer_name as reviewer_name, reviews.*, array_agg(photos.url) as photos FROM reviews INNER JOIN photos ON reviews.id=photos.review_id WHERE reviews.product_id=${params.product_id} GROUP BY reviews.id ${params.sort ? sortMethod[params.sort] : ''}
    LIMIT ${params.count ? params.count : 5}
    `;

    db.query(queryStr, (err, results) => {
      cb(err, results);
    });
  },

//////////////////////////////////////////////////////////////////////////////////////

postReview: async function(req){
  console.log('inside model postReview')
  const date = Date.now();
    const queryArray = [];
  const reviewQuery = `
  INSERT INTO reviews (
    product_id,
    date,
    rating,
    summary,
    body,
    reported,
    recommend,
    reviewer_name,
    reviewer_email,
    helpfulness
  )
  VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10
  )
  RETURNING id
  ;`;
  console.log('inside model postReview before first query')
  const result = await db.query(reviewQuery, [
    req.body.product_id,
    date,
    req.body.rating,
    req.body.summary,
    req.body.body,
    req.body.recommend,
    req.body.reported,
    req.body.name,
    req.body.email,
    req.body.helpfulness
  ]);
  console.log('inside model postReview after first query');
  

  const reviewID = result.rows[0].id;
  if (req.body.photos.length) {
    req.body.photos.forEach((url) => {
      queryArray.push(db.query(`
      INSERT INTO photos (
        review_id,
        url
      )
      VALUES (
        $1,
        $2
      )
      ;`, [reviewID, url]));
    });
  }
  const chars = req.body.characteristics;
  if (Object.keys(chars).length) {
    Object.keys(chars).forEach((char) => {
      queryArray.push(db.query(`
      INSERT INTO characteristic_reviews (
        characteristic_id,
        review_id,
        value
      ) VALUES (
        $1,
        $2,
        $3
      )
      ;`,[char.id, reviewID, char.value]));
    });
  }

  return Promise.all(queryArray)
     .then(() => {
      console.log('review added!')})
 },

// postReview: (req) => {
//   const date = Math.round((new Date()).getTime());
//   var queryInput;
//   // const values = [product_id, rating, summary, body, recommend, name, email, date, false,
//   //   0, characteristics];
//   const values = [
//     req.body.product_id,
//     req.body.rating,
//     req.body.summary,
//     req.body.body,
//     req.body.recommend,
//     req.body.name,
//     req.body.email,
//     date,
//     req.body.reported,
//     req.body.helpfulness
//   ];
//   console.log('photos: ', req.body.photos)
//   var photos = req.body.photos;

//   if (photos.length === 0) {
//     console.log('inside photos.length === 0')
//     queryInput = `
//     WITH reviewsInsert AS (
//       INSERT INTO reviews (product_id, rating, summary, body, recommend,
//         reviewer_name, reviewer_email, date, reported, helpfulness)
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
//       RETURNING id AS reviewId
//     ),
//     keyValPair AS (SELECT * FROM json_each($11))
//     INSERT INTO characteristic_reviews (review_id, characteristic_id, value)
//     SELECT (SELECT reviewId FROM reviewsInsert), key::bigint, value::integer
//     FROM keyValPair
//     `;
//   } else {
//     console.log('inside photos.length !== 0')
//     values.push(photos);
//     queryInput = `
//     WITH reviewsInsert AS (
//       INSERT INTO reviews (product_id, rating, summary, body, recommend,
//         reviewer_name, reviewer_email, date, reported, helpfulness)
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
//       RETURNING id AS reviewId
//     ),
//     keyValPair AS (SELECT * FROM json_each($11)),
//     characteristicReviewsInsert AS (
//       INSERT INTO characteristic_reviews (review_id, characteristic_id, value)
//       SELECT (SELECT reviewId FROM reviewsInsert), key::bigint, value::integer
//       FROM keyValPair
//     )
//     INSERT INTO photos (review_id, url)
//     SELECT (SELECT reviewId FROM reviewsInsert), unnest($12::text[])
//     `;
//   }
//   return db.query(queryInput, values);

// },


//////////////////////////////////////////////////////////////////////////////////////
getMeta: function (productId, callback) {
  console.log('inside getMeta')
  db.query(`
  SELECT
    ${productId} AS product_id,
    (
      SELECT JSON_OBJECT_AGG(rating, rateCount)
        FROM (SELECT rating, COUNT(*) AS rateCount FROM reviews
        WHERE product_id = ${productId}
        GROUP BY rating ) AS x
    ) AS ratings,
    (
      SELECT JSON_OBJECT_AGG(recommend, recCount)
        FROM (SELECT recommend, COUNT(*) AS recCount
        FROM reviews
        WHERE product_id = ${productId}
        GROUP BY recommend ) AS x
    ) AS recommended,
    (
      SELECT JSON_OBJECT_AGG(name, JSON_BUILD_OBJECT('id', characteristic_id, 'value', avgVal))
      FROM(SELECT name, characteristic_id, AVG(value) AS avgVal
      FROM characteristic_reviews
      INNER JOIN characteristics c ON c.id=characteristic_reviews.characteristic_id
      WHERE product_id = ${productId}
      GROUP BY name, characteristic_id) AS x
    ) AS characteristics
  `, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      callback(err, data.rows)
    }
  })
},


 //////////////////////////////////////////////////////////////////////////////////////

  putHelpful: (reviewId, cb) => {
    db.query(
      `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id=${reviewId};`,
      (err) => {cb(err)});
  },

  //////////////////////////////////////////////////////////////////////////////////////

  putReport: (reviewId, cb) => {
    db.query(
      `UPDATE reviews SET reported = True WHERE id = ${reviewId}`,
    (err) => {cb(err)});
  },
};
