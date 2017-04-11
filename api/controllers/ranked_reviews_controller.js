'use strict';
var util = require('util');
var fs = require("fs");

module.exports = {
  get_reviews: get_reviews
};

const reviews = JSON.parse(fs.readFileSync("./data/reviews_store.json").toString()).map(review => {
  review.date = new Date(review.date);
  return review;
});

function search_reviews(product_id, from_date, to_date) {
  return reviews.filter(r => r.product_id === product_id && r.date >= from_date && r.date <= to_date);
}

function paginate_reviews(reviews, page_number, page_size) {
  const maxPages = Math.ceil(reviews.length / page_size);
  if (page_number > maxPages) {
    console.log(`Only ${maxPages} found but requested page #${page_number}. Returning the last page`);
    page_number = maxPages;
  }
  const starting_index = Math.max(page_number - 1, 0) * page_size; 
  return reviews.slice( starting_index, starting_index + page_size);
}

function get_reviews(req, res) {
  var product_id = req.swagger.params.id.value;

  if (!product_id) {
    res.staus(400).send("Product ID is required");
  };

  const from_date_req = req.swagger.params.since.value || -1;
  const from_date = new Date(from_date_req);
  const to_date = new Date();
  const page_number = req.swagger.params.pageNumber.value || 0;
  const page_size = req.swagger.params.pageSize.value;

  console.log(`Got a request: From Date = ${from_date}. To Date = ${to_date}. Page Number = ${page_number}. Page Size = ${page_size}`);

  const searchResult = search_reviews(product_id, from_date, to_date);
  const response = paginate_reviews(searchResult, page_number, page_size || searchResult.length);

  res.json({ reviews: response });
}
