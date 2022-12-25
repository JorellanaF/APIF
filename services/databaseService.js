const databaseService = () => {
  const knex = require("knex")({
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB,
    },
  });

  const tabla = "USUARIO";
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
    return knex(tabla).column('email as Email', 'username as Username', 'ingreso as Ingresos').select();
  };

  const usuariosByUsername = ({username}) => {
    return knex(tabla).column('email as Email', 'username as Username').where('username', username).select();
  };

  const borrarUsuario = ({id}) => {
    return knex(tabla).where('id', id).del();
  }

  return {
    crearUsuario,
    usuarios,
    borrarUsuario,
    usuariosByUsername
  };
};

module.exports = {
  databaseService,
};
