const { Genre, Videogame } = require("../db.js");

exports.addVideoGame = async (req, res) => {
  // Obtenemos los datos del videojuego a agregar del cuerpo de la solicitud
  const { name, description, released, rating, genres, image, platforms } =
    req.body;

  // Verificamos que todos los campos requeridos se hayan enviado en la solicitud
  if (
    !name ||
    !description ||
    !released ||
    !rating ||
    !genres ||
    !image ||
    !platforms
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  // Convertimos la lista de plataformas a una cadena de texto separada por comas
  let platformString = platforms.join(", ");

  try {
    // Creamos un nuevo registro de Videogame en la base de datos con los datos proporcionados
    let gameCreated = await Videogame.create({
      name: name,
      description: description,
      img: image,
      released: released,
      rating: rating,
      platforms: platformString,
    });

    // Agregamos las categorías de género proporcionadas al videojuego creado
    for (const g of genres) {
      let genresGame = await Genre.findOne({ where: { name: g } });
      await gameCreated.addGenre(genresGame);
    }

    // Modificamos el objeto "gameCreated" para agregar la lista de géneros como una cadena de texto separada por comas
    gameCreated = {
      ...gameCreated.dataValues,
      genres: genres.map((g) => g).join(", "),
    };
    // Enviamos una respuesta con el objeto "gameCreated" como resultado exitoso
    return res.status(200).json(gameCreated);
  } catch (error) {
    return res.status(404).json(error);
  }
};
