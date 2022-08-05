let request = require('supertest');

request = request('http://localhost:3000');

describe('fetch data from getReviews', () => {

  it('should fetch reviews and return JSON format', () => {
    request
      .get('/reviews')
      .query({
        product_id: 486888,
      })
      .expect('Content-Type', /json/);
  });

  it('should fetch reviews with only product_id, and default to the first page and 5 reviews per page', () => {
    request
      .get('/reviews')
      .query({
        product_id: 486888,
      })
      .then((response) => {
        expect(response.body.results).toHaveLength(5);
        expect(response.body.count).toEqual(5);
        expect(response.body.page).toEqual(0);
      });
  });

  it('should responds with the expected data types and correct information', () => {
    request
      .get('/reviews')
      .query({
        product_id: 899880,
        page: 2,
        count: 1,
        sort: 'helpful',
      })
      .then((res) => {
        const {
          product, page, count, results,
        } = res.body;

        expect(typeof product).toBe('string');
        expect(typeof page).toBe('number');
        expect(typeof count).toBe('number');
        expect(Array.isArray(results)).toBe(true);
        const {
          review_id, rating, summary, recommend, response, body, date,
          reviewer_name, helpfulness, photos,
        } = results[0];

        expect(typeof review_id).toBe('number');
        expect(typeof rating).toBe('number');
        expect(typeof summary).toBe('string');
        expect(typeof body).toBe('string');
        expect(typeof recommend).toBe('boolean');
        expect(typeof response === 'string' || response === null).toBe(true);
        expect(typeof date).toBe('string');
        expect(typeof reviewer_name).toBe('string');
        expect(typeof helpfulness).toBe('number');
        expect(Array.isArray(photos)).toBe(true);

        expect(product).toBe('899880');
        expect(page).toEqual(2);
        expect(count).toEqual(1);
        const secondHelpful = {
          review_id: 5197455,
          rating: 4,
          summary: "Nobis perferendis qui repellendus voluptates sint.",
          recommend: true,
          response: "null",
          body: "Sed similique quia libero voluptatem nihil impedit. Iusto aut eum. Eligendi illum et molestiae et consequatur ut qui blanditiis consequatur. Autem voluptatibus aliquid atque aut voluptatem animi voluptatibus dolor ut.",
          date: "2020-10-07T16:24:49.000Z",
          reviewer_name: "Raven.McKenzie",
          helpfulness: 6,
          photos: []
      };
      expect(results[0]).toEqual(secondHelpful);
      });
  });
});