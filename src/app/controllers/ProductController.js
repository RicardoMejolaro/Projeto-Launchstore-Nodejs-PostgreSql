const Category = require('../models/Category');
const Product = require('../models/Product');

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
   
   return res.render('products/create.njk', { productId, categories });
    
  }
}

