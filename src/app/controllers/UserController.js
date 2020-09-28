const User = require('../models/User');

module.exports = {
  registerForm(req, res) {
    return res.render('user/register');
  },
  async post(req, res) {
    //Checando se todos os campos estão preenchidos
    const keys = Object.keys(req.body)

    for (const key of keys) {
      if (req.body[key] == "")
        return res.send("Por gentileza preencha todos os campos!")
    }

    //Checando se usúario já estã cadastrado
    const { email, cpf, cnpj } = req.body;
    const user = await User.findOne({ 
      where: {email},
      or: {cpf_cnpj}
    });

    //Checando se a senha e repetição são iguais
  }
};