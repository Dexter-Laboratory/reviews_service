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

COPY characteristic_review(id, characteristic_id, review_id, value)
FROM '/Users/rxlbas/Desktop/system_design/reviews_service/data/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;