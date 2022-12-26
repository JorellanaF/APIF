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
    return knex(tabla)
      .column("email as Email", "username as Username", "ingreso as Ingresos")
      .select();
  };

  const usuariosByUsername = async (req, res) => {
    const username = req.params.username;
    console.log("--> " + username);
    try {
      const user = await knex(tabla)
        .column("email as Email", "username as Username", "id_img_fk as Img")
        .where("username", username)
        .select();
      console.log(user);
      return res.json(user[0]);
    } catch (e) {
      return res.status(500).json(e);
    }
  };
  /*const usuariosByUsername = ({username}) => {
    return knex(tabla).column('email as Email', 'username as Username').where('username', username).select();
  };*/

  const imgById = async (req, res) => {
    const id = req.params.id;
    console.log("--> " + id);
    try {
      const img = await knex(tabla)
        .column("img as Img")
        .where("id", id)
        .select();
      console.log(img);
      return res.json(img[0]);
    } catch (e) {
      return res.status(500).json(e);
    }
  };

  const borrarUsuario = ({ id }) => {
    return knex(tabla).where("id", id).del();
  };

  return {
    crearUsuario,
    usuarios,
    borrarUsuario,
    usuariosByUsername,
    imgById,
  };
};

module.exports = {
  databaseService,
};
