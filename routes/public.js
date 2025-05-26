const express = require("express");
const Public = require("../controllers/public");
const public = express.Router();

public.get("/products", Public.product);
// public.get("/products/:id", Public.productDetail);
public.get("/products/slug/:slug", Public.showBySlug);
public.get("/posts", Public.post);
public.get("/posts/:id", Public.postDetail);

module.exports = public;

