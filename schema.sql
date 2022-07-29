DROP DATABASE IF EXISTS reviews;
CREATE DATABASE reviews;

\c reviews;

DROP TABLE IF EXISTS reviews;
CREATE TABLE IF NOT EXISTS reviews(
  review_id NOT NULL PRIMARY KEY,
  rating SMALLINT NOT NULL,
  summary VARCHAR(200) NOT NULL,
  recommend BOOLEAN NOT NULL,
  response VARCHAR(2000),
	body VARCHAR(2000) NOT NULL,
  date BIGINT NOT NULL,
  name VARCHAR(50) NOT NULL,
  helpfulness SMALLINT NOT NULL DEFAULT 0,
  email VARCHAR(50) NOT NULL,
  reported BOOLEAN NOT NULL,
  product_id INTEGER NOT NULL,
  );

DROP TABLE IF EXISTS photos;
CREATE TABLE IF NOT EXISTS photos(
  id SERIAL PRIMARY KEY,
  url VARCHAR(200),
  review_id int,
  FOREIGN KEY (review_id)
    REFERENCES reviews(id),
);

DROP TABLE IF EXISTS characteristics;
CREATE TABLE IF NOT EXISTS characteristics(
  id SERIAL PRIMARY KEY,
  product_id int,
  name VARCHAR(50)
);

DROP TABLE IF EXISTS characteristic_review;
CREATE TABLE IF NOT EXISTS characteristics_review(
  id SERIAL PRIMARY KEY,
  characteristic_id int,
  review_id int,
  value int,
  FOREIGN KEY (review_id)
    REFERENCES reviews(id),
  FOREIGN KEY (characteristic_id)
    REFERENCES characteristics(id),
);

-- COPY reviews(review_id, product_id, rating, review_date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
-- FROM '/Users/rxlbas/Desktop/system_design/data/reviews.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY photos(photo_id, review_id, photo_url)
-- FROM '/Users/rxlbas/Desktop/system_design/data/reviews.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY characteristics(chars_id, product_id, name)
-- FROM '/Users/rxlbas/Desktop/system_design/data/reviews.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY characteristic_review(charsReview_id, chars_id, review_id, value)
-- FROM '/Users/rxlbas/Desktop/system_design/data/reviews.csv'
-- DELIMITER ','
-- CSV HEADER;

-- create index for better read times
CREATE INDEX idx_reviews_product_id on reviews(product_id);
CREATE INDEX idx_characteristic_characteristic_id on characteristic_reviews(characteristic_id);
CREATE INDEX idx_characteristic_reviews_review_id on characteristic_reviews(review_id);
CREATE INDEX idx_characteristics_product_id on characteristics(product_id);
CREATE INDEX idx_photos_review_id on reviews_photos(review_id);
SELECT now();



