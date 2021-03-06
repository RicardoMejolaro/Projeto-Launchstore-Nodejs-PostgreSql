const db = require('../../config/db');
const { hash } = require('bcryptjs');

module.exports = {
  async findOne(filters) {
    let query = `SELECT * FROM users`;

    Object.keys(filters).map(key => {
      query = `${query}
      ${key}
      `

      Object.keys(filters[key]).map(field => {
        query = `${query} ${field} = '${filters[key][field]}'`
      });
    });

    const results = await db.query(query);
    return results.rows[0];
  },
  async create(data) {
    try {
      const query = `
          INSERT INTO users (
            name,
            email,
            password,
            cpf_cnpj,
            cep,
            address
          ) VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id
        `

      let { name, email, password, cpf_cnpj, cep, address } = data;

      //Hash de senha
      const passwordHash = await hash(password, 8);

      const values = [
        name,
        email,
        passwordHash,
        cpf_cnpj.replace(/\D/g, ""),
        cep.replace(/\D/g, ""),
        address,
      ];

      const results = await db.query(query, values);
      return results.rows[0].id;

    } catch (error) {
      console.error(error);
    }

  }
}