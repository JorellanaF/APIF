module.exports = (app, databaseService) => {
  app.get("/api/", function (req, res) {
    res.json({ mensaje: "¡Hola Mundo!" });
  });

  app.get("/usuarios", function (req, res) {
    databaseService
      .usuarios()
      .then((usuarios) => {
        res.json(usuarios);
      })
      .catch((e) => {
        res.status(500).json(e);
      });
  });

  app.get("/usuario/:username", databaseService.usuariosByUsername);
  /*app.get("/usuario/:username", function (req, res) {
    const username = req.params.username;
    databaseService
      .usuariosByUsername(username)
      .then((usuario) => {
        res.json(usuario);
      })
      .catch((e) => {
        res.status(500).json(e);
      });
  });*/

  app.post("/", function (req, res) {
    res.json({ mensaje: "Método post" });
  });

  app.post("/usuarios", (req, res) => {
    const usuarioN = req.body;
    console.log(usuarioN);
    databaseService
      .crearUsuario(usuarioN)
      .then(() => {
        res.json({ mensaje: "Usuario creado" });
      })
      .catch((e) => {
        res.status(500).json(e);
      });
  });

  app.del("/usuario", function (req, res) {
    const usuarioID = req.body;
    databaseService
      .borrarUsuario(usuarioID)
      .then(() => {
        res.json({ mensaje: "Usuario borrado" });
      })
      .catch((e) => {
        res.status(500).json(e);
      });
  });
};
