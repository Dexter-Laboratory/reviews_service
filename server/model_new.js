const db = require('../db.js');

module.exports = {
  getReviews: ({count, page, sort, product_id,}) => {
      let sortOption;
      if (sort === 'newest') {
        sortOption = 'date DESC, id ASC';
      } else if (sort === 'helpful') {
        sortOption = 'helpfulness DESC, id ASC';
      } else if (sort === 'relevant') {
        sortOption = 'date DESC, helpfulness DESC, id ASC';
      } else{
        sortOption = 'date DESC, helpfulness DESC, id ASC';
      }
      // offset to only display starting the right review_id
      const offset = count * (page - 1);
      // $1, $2, $3's value
      const values = [product_id, count, offset];

      const queryInput = `
          SELECT id::integer AS review_id, rating, summary, recommend AS recommend,
          response, body, (TO_TIMESTAMP(date / 1000)) as date, reviewer_name, helpfulness,
          (WITH images AS (SELECT id, url FROM photos WHERE review_id = reviews.id)
            SELECT COALESCE((SELECT JSON_AGG(json_build_object('id', id, 'url', url))
            FROM images), '[]'::json)) as photos
          FROM reviews WHERE product_id = $1 AND reported = False
          ORDER BY ${sortOption} LIMIT $2 OFFSET $3
      `;
      return db.query(queryInput, values);
  },

//////////////////////////////////////////////////////////////////////////////////////

postReview: function({
  product_id, rating, summary, body, recommend, reported, name, email, photos, helpfulness, characteristics,
}){
  console.log('inside model postReview')
  console.log('product_id', product_id, 'rating: ', rating)
  const date = Date.now();
  const values = [product_id, date, rating, summary, body, recommend, reported, name, email,
    helpfulness];
  // $11 is characteristics
  console.log('values: ', values)

  var queryInput;

  console.log('inside model postReview before defining query')
  if (photos.length === 0) {
    console.log('inside empty photo array')
    queryInput = `
    WITH reviewsInsert AS (
      INSERT INTO reviews (product_id, date, rating, summary, body, recommend, reported, reviewer_name, reviewer_email, helpfulness)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id AS reviewId
    ),
     characteristicsPair AS (SELECT * FROM json_each_text(${characteristics})),
    characteristicReviewsInsert AS (
      INSERT INTO characteristic_reviews (review_id, characteristic_id, value)
      SELECT key::integer, (SELECT reviewId FROM reviewsInsert), value::integer
      FROM characteristicsPair
    )`
  } else {
    values.push(photos);
    queryInput = `
    WITH reviewsInsert AS (
      INSERT INTO reviews (product_id, date, rating, summary, body, recommend, reported,
        reviewer_name, reviewer_email, helpfulness)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id AS reviewId
    ),
    characteristicsPair AS (SELECT * FROM json_each_text(${characteristics})),
    characteristicReviewsInsert AS (
      INSERT INTO characteristic_reviews (review_id, characteristic_id, value)
      SELECT key::integer, (SELECT reviewId FROM reviewsInsert), value::integer
      FROM characteristicsPair
    )
    INSERT INTO photos (review_id, url)
    SELECT (SELECT reviewId FROM reviewsInsert), unnest(${photos}::text[])
    `;
  }
  console.log('values before db.query is:', values)

  console.log('queryInput before db.query is:', queryInput)
  return db.query(queryInput, values);
 },

//////////////////////////////////////////////////////////////////////////////////////
///

  ///

getMeta: function (productId, callback) {
  console.log('inside getMeta')
  db.query(`
  SELECT
    ${productId} AS product_id,
    (
      SELECT JSON_OBJECT_AGG(rating, rateCount)
        FROM (SELECT rating, COUNT(*) AS rateCount FROM reviews
        WHERE product_id = ${productId}
        GROUP BY rating ) AS placeholder
    ) AS ratings,
    (
      SELECT JSON_OBJECT_AGG(recommend, recCount)
        FROM (SELECT recommend, COUNT(*) AS recCount
        FROM reviews
        WHERE product_id = ${productId}
        GROUP BY recommend ) AS placeholder
    ) AS recommended,
    (
      SELECT JSON_OBJECT_AGG(name, JSON_BUILD_OBJECT('id', characteristic_id, 'value', avgVal))
      FROM(SELECT name, characteristic_id, AVG(value) AS avgVal
      FROM characteristic_reviews
      INNER JOIN characteristics c ON c.id=characteristic_reviews.characteristic_id
      WHERE product_id = ${productId}
      GROUP BY name, characteristic_id) AS placeholder
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
