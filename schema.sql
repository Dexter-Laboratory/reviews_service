DROP DATABASE IF EXISTS reviews;
CREATE DATABASE reviews;

\c reviews;

DROP TABLE IF EXISTS reviews;
CREATE TABLE IF NOT EXISTS reviews(
  id BIGSERIAL UNIQUE NOT NULL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  date BIGINT NOT NULL,
  rating SMALLINT NOT NULL,
  summary VARCHAR(200) NOT NULL,
	body VARCHAR(2000) NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL,
  reviewer_name VARCHAR(50) NOT NULL,
  reviewer_email VARCHAR(50) NOT NULL,
  response VARCHAR(2000),
  helpfulness SMALLINT NOT NULL DEFAULT 0
);

DROP TABLE IF EXISTS photos;
CREATE TABLE IF NOT EXISTS photos(
  id SERIAL PRIMARY KEY,
  review_id INT REFERENCES reviews(id),
  url VARCHAR(500)
);

DROP TABLE IF EXISTS characteristics;
CREATE TABLE IF NOT EXISTS characteristics(
  id SERIAL PRIMARY KEY,
  product_id INT,
  name VARCHAR(50)
);

DROP TABLE IF EXISTS characteristic_reviews;
CREATE TABLE IF NOT EXISTS characteristic_reviews(
  id SERIAL PRIMARY KEY,
  characteristic_id INTEGER REFERENCES characteristics (id),
  review_id INTEGER REFERENCES reviews(id),
  value INT
);


COPY reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '/Users/rxlbas/Desktop/system_design/reviews_service/data/reviews.csv'
DELIMITER ','
CSV HEADER;

COPY photos(id, review_id, url)
FROM '/Users/rxlbas/Desktop/system_design/reviews_service/data/reviews_photos.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics(id, product_id, name)
FROM '/Users/rxlbas/Desktop/system_design/reviews_service/data/characteristics.csv'
DELIMITER ','
CSV HEADER;

COPY characteristic_reviews(id, characteristic_id, review_id, value)
FROM '/Users/rxlbas/Desktop/system_design/reviews_service/data/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;

-- create index for better read times
CREATE INDEX idx_reviews_product_id on reviews(product_id);
CREATE INDEX idx_characteristic_characteristic_id on characteristic_reviews(characteristic_id);
CREATE INDEX idx_characteristic_reviews_review_id on characteristic_reviews(review_id);
CREATE INDEX idx_characteristics_product_id on characteristics(product_id);
CREATE INDEX idx_photos_review_id on photos(review_id);



