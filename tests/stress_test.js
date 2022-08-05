import http from 'k6/http';
import {
  tagWithCurrentStageIndex, randomItem, randomIntBetween,
} from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { URLSearchParams } from 'https://jslib.k6.io/url/1.0.0/index.js';

const sortOptions = ['helpful', 'relevant', 'newest'];

export const options = {
  // thresholds: {
  //   http_req_duration: ['p(99)<50'], // 99% of requests must complete below 50ms
  // },
  scenarios: {
    // when client first load the page, concurrently call getReviews and getMeta
    firstLoad: {
      exec: 'firstLoad',
      executor: 'ramping-vus',
      stages: [
        { duration: '1m', target: 200 }
        // { duration: '2m', target: 100 }, // below normal load
        // { duration: '5m', target: 100 },
        // { duration: '2m', target: 500 },
        // { duration: '5m', target: 500 },
        // { duration: '2m', target: 1000 },
        // { duration: '5m', target: 1000 },
        // { duration: '10m', target: 0 }, // recovery stage
      ]
    },
    switchSort: {
      exec: 'switchSort',
      executor: 'ramping-vus',
      stages: [
        { duration: '1m', target: 200 }

        // { duration: '2m', target: 100 },
        // { duration: '5m', target: 100 },
        // { duration: '2m', target: 500 },
        // { duration: '5m', target: 500 },
        // { duration: '2m', target: 1000 },
        // { duration: '5m', target: 1000 },
        // { duration: '10m', target: 0 },
      ]
    },
  },
};


// when client first load the page, concurrently call getReviews and getMeta
export function firstLoad() {
  const randomProductId = randomIntBetween(912883, 975182);

  const searchParams = new URLSearchParams([
    ['product_id', randomProductId],
    ['sort', 'relevant'],
    ['count', 50],
    ['page', 1],
  ]);

  // get all the reviews
  const getReviews = {
    method: 'GET',
    url: `http://localhost:3000/reviews/?product_id=${searchParams.toString()}`,
    params: {
      tags: {
        name: 'getAllURL',
        type: 'getReviews',
        situation: 'initial',
      },
    },
  };

  // get all the characteristic reviews
  const getMeta = {
    method: 'GET',
    url: `http://localhost:3000/reviews/meta/?product_id=${randomProductId}`,
    params: {
      tags: {
        name: 'getMetaURL',
        type: 'getMeta',
        situation: 'initial',
      },
    },
  };
  tagWithCurrentStageIndex();
  // batch test below routes
  http.batch([getReviews, getMeta]);
}

export function switchSort() {
  const randomSort = randomItem(sortOptions);
  const randomProductId = randomIntBetween(912883, 975182);

  const searchParams = new URLSearchParams([
    ['product_id', randomProductId],
    ['sort', randomSort],
    ['count', 50],
    ['page', 1],
  ]);

  tagWithCurrentStageIndex();

  http.get(
    `http://localhost:3000/reviews/?${searchParams.toString()}`,
    { tags: {
      name: 'GetAllURL',
      situation: 'switch'
    }},
  );
}