const databaseService = () => {
  const knex = require("knex")({
    client: "mysql",
    connection: {
      host: process.env.DB_HOST,
      port: 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB,
    },
  });

  const tabla = "usuarios";
  const crearUsuario = ({ id, username, password, ingresos, gasto }) => {
    return knex(tabla).insert({
      id: id,
      username: username,
      password: password,
      ingresos: ingresos,
      gasto_fk: gasto,
    });
  };

  const usuarios = () => {
    return knex(tabla).select();
  };

  const borrarUsuario = ({id}) => {
    return knex(tabla).where('id', id).del();
  }

  return {
    crearUsuario,
    usuarios,
    borrarUsuario
  };
};

module.exports = {
  databaseService,
};
