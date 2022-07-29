COPY reviews(review_id, product_id, rating, review_date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '/Users/rxlbas/Desktop/system_design/data/reviews.csv'
DELIMITER ','
CSV HEADER;

COPY photos(photo_id, review_id, photo_url)
FROM '/Users/rxlbas/Desktop/system_design/data/reviews.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics(chars_id, product_id, name)
FROM '/Users/rxlbas/Desktop/system_design/data/reviews.csv'
DELIMITER ','
CSV HEADER;

COPY characteristic_review(charsReview_id, chars_id, review_id, value)
FROM '/Users/rxlbas/Desktop/system_design/data/reviews.csv'
DELIMITER ','
CSV HEADER;