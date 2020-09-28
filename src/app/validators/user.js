const User = require('../models/User');

async function post(req, res, next) {
  //Checando se todos os campos estão preenchidos
  const keys = Object.keys(req.body)

  for (const key of keys) {
    if (req.body[key] == "")
      return res.send("Por gentileza preencha todos os campos!")
  }

  //Checando se usúario já estã cadastrado
  let { email, cpf_cnpj, password, passwordRepeat } = req.body;

  cpf_cnpj = cpf_cnpj.replace(/\D/g, "");

  const user = await User.findOne({ 
    where: {email},
    or: {cpf_cnpj}
  });

  if (user) return res.send('Usuário já cadastrado!');

  //Checando se a senha e repetição são iguais
  if (password !== passwordRepeat) return res.send('As senhas não são iguais!');

  next();
}

module.exports = {
  post
}