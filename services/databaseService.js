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

  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");

  const crearUser = async (req, res) => {
    const email = req.body.email;
    console.log(email);
    const username = req.body.username;
    console.log(username);
    const passCrypt = await bcrypt.hash(req.body.password, 10);
    try {
      //res.status(201).send({message: "PASS", passCrypt})
      await knex(tabla).insert({
        email: email,
        username: username,
        password: passCrypt,
      });
      //res.status(201).send({message: "ENTRO"})
      return res.status(201).send({ message: "Usuario creado" });
    } catch (e) {
      //res.status(500).send({message: "ERROR"})
      return res.status(500).json(e);
    }
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
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // accessTokens
  function generateAccessToken(user) {
    console.log("SIIII");
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
  }
  // refreshTokens
  let refreshTokens = [];
  function generateRefreshToken(user) {
    console.log("SIIII");
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "20m",
    });
    refreshTokens.push(refreshToken);
    return refreshToken;
  }
  //Usuario por usuarname y pass
  const userByUsernamePass = async (req, res) => {
    const email = req.body.email;
    const pass = req.body.password;
    //console.log(process.env.REFRESH_TOKEN_SECRET)
    try {
      const user = await knex(tabla)
        .column("email as Email", "password as Password")
        .where({ email: email })
        .select();
      console.log(user[0].Password);
      if (user == null) {
        return res.status(404).send({ message: "Usuario no encontrado" });
      }
      if (await bcrypt.compare(req.body.password, user[0].Password)) {
        console.log("ENTRO?");
        //const accessToken = generateAccessToken({ user: req.body.email });
        const accessToken = jwt.sign({user: user[0]}, process.env.JWT_SECRET || "TOP_SECRET");
        console.log("PASE?");
        /*const refreshToken = jwt.sign({user: user[0]}, process.env.REFRESH_TOKEN_SECRET, {
          expiresIn: "20m",
        });*/
        console.log("token -> " +accessToken)
        //const refreshToken = generateRefreshToken({ user: req.body.email });
        res.json({
          accessToken: accessToken,
        });
      } else {
        return res.status(401).send({ message: "Credenciales incorrectas" });
      }
    } catch (e) {
      return res.status(500).json(e);
    }
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const tabla1 = "IMAGE_PROFILE";
  const imgById = async (req, res) => {
    const id = req.params.id;
    console.log("--> " + id);
    try {
      const img = await knex(tabla1)
        .column("img as Img")
        .where("id_img_pk", id)
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
    userByUsernamePass,
    crearUser,
  };
};

module.exports = {
  databaseService,
};
