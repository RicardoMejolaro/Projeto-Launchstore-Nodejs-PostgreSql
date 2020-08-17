const Category = require('../models/Category');
const Product = require('../models/Product');
const { formatPrice } = require('../../lib/utils');
const { put } = require('../../routes/routes');

module.exports = {
 async create(req, res) {
    const results = await Category.all();
    const categories = results.rows;

      return res.render('products/create.njk', { categories });

  },
  async post(req, res) {
    //Validação todos os campos obrigatórios
    const keys = Object.keys(req.body)

    for (const key of keys) {
      if (req.body[key] == "")
        return res.send("Por gentileza preencha todos os campos!")
    }

    let { category_id, user_id, name, description, old_price, price, quantity, status } = req.body;

    price = price.replace(/\D/g, "");

    const data = [
      category_id,
      user_id || 1,
      name,
      description,
      old_price || price,
      price,
      quantity,
      status || 1,
    ];

   let results = await Product.create(data);
   const productId = results.rows[0].id;

   results = await Category.all();
   const categories = results.rows[0];
   
   return res.redirect(`/products/${productId}`);
    
  },
  async edit(req, res) {
    const { id } = req.params;
   let results = await Product.find(id);
   const product = results.rows[0];

   if(!product) return res.send('Produto não encontrado!');

   product.old_price = formatPrice(product.old_price);
   product.price = formatPrice(product.price);

   results = await Category.all();
   const categories = results.rows;


   
   return res.render('products/edit.njk', { product, categories});
  },
  async put(req, res) {
    //Validação todos os campos obrigatórios
    const keys = Object.keys(req.body)

    for (const key of keys) {
      if (req.body[key] == "")
        return res.send("Por gentileza preencha todos os campos!");
    }

    let { category_id, user_id, name, description, old_price, price, quantity, status, id } = req.body;

    price = price.replace(/\D/g, "");

    if(old_price != price) {
      const oldProduct = await Product.find(id)

      old_price = oldProduct.rows[0].price
    }

    const data = [
      category_id,
      user_id,
      name,
      description,
      old_price,
      price,
      quantity,
      status,
      id,
    ];

    await Product.update(data);

    return res.redirect(`/products/${id}/edit`)

  }
}

