const Category = require('../models/Category');
const Product = require('../models/Product');
const File = require('../models/File');
const { formatPrice, date } = require('../../lib/utils');

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

    if(req.files.length == 0) return res.send('É necessário inluir no mínimo uma foto!');

    let results = await Product.create(data);
    const productId = results.rows[0].id;

    const filesPromise = req.files.map(file => File.create({...file, product_id: productId}));
    await Promise.all(filesPromise);

    return res.redirect(`/products/${productId}/edit`);

  },
  async show(req, res) {
    let result = await Product.find(req.params.id);
    const product = result.rows[0];

    if(!product) return res.send('Produto não encontrado!');

    const { month, day, hour, minutes } = date(product.updated_at);

    product.published = {
      day: `${day}/${month}`,
      hour: `${hour}h${minutes}`,
    }

    product.old_price = formatPrice(product.old_price);
    product.price = formatPrice(product.price);

    return res.render('products/show', { product });
  },
  async edit(req, res) {
    const { id } = req.params;
    let results = await Product.find(id);
    const product = results.rows[0];

    if (!product) return res.send('Produto não encontrado!');

    product.old_price = formatPrice(product.old_price);
    product.price = formatPrice(product.price);

    /*GET CATEGORIES*/
    results = await Category.all();
    const categories = results.rows;

    /*GET IMAGES*/
    results = await Product.files(product.id)
    let files = results.rows;
    files = files.map(file => ({ 
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
     }));

    return res.render('products/edit.njk', { product, categories, files });
  },
  async put(req, res) {
    //Validação todos os campos obrigatórios
    const keys = Object.keys(req.body)

    for (const key of keys) {
      if (req.body[key] == "" && key != "removed_files")
        return res.send("Por gentileza preencha todos os campos!");
    }

    let { category_id, user_id, name, description, old_price, price, quantity, status, id } = req.body;

    price = price.replace(/\D/g, "");

    if (old_price != price) {
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

    if(req.files.length != 0) {
      const newFilesPromise = req.files.map(file => File.create({...file, product_id: req.body.id}));
      await Promise.all(newFilesPromise);

    }

    if (req.body.removed_files) {
      const removedFiles = req.body.removed_files.split(","); // [1, 2, 3,]
      const lastIndex = removedFiles.length - 1;
      removedFiles.splice(lastIndex, 1); // [1, 2, 3]

      const removedFilesPromise = removedFiles.map(id => File.delete(id))
      await Promise.all(removedFilesPromise);
      
    }

    await Product.update(data);

    return res.redirect(`/products/${id}`)

  },
  async delete(req, res) {
    const { id } = req.body;

    await Product.delete(id);

    return res.redirect('/products/create');
  }
}

