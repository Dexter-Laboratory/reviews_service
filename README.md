# Rating And Reviews
Rating and Reviews is to build a RESTful API service for a retail web-portal.
## Table of Contents
1. [Installation](#installation)
2. [Tech-Stack](#tech-stack)
3. [Routes](#routes)
4. [Optimization](#optimization)

## Installation
  Navigate to the root directory and run the following commands in terminal
  ```npm
  npm install
  npm start
  ```
## Tech-Stack
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Mocha](https://img.shields.io/badge/-mocha-%238D6748?style=for-the-badge&logo=mocha&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white) 
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white) 
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) 
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white)

## Routes
  |Request Type|Endpoint|Status|
  |---|---|---|
  |GET|/reviews/:product_id|200
  |GET|/reviews:product_id/meta|200
  |POST|/reviews/:product_id|201
  |PUT|/reviews/:review_id/helpful|204
  |PUT|/reviews/:review_id/report|204

## Optimization
- Create Index for DB to improve query time
- Using Load Balancer (Least Connection) to increase active Visual Users, decrease error rate and latency.
