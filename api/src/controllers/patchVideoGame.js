const { Genre, Videogame } = require("../db.js");

exports.updateVideoGame = async (req, res) => {
  // Desestructuración de los campos que se reciben en el body
  const { id, name, description, released, rating, genres, image, platforms } =
    req.body;

  // Validación de que los campos no estén vacíos
  if (
    !id ||
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

  // Conversión de los campos de las plataformas a un string separado por comas
  let platformString = platforms.join(", ");

  try {
    // Busca el videojuego por su id
    let game = await Videogame.findByPk(id);

    // Actualiza los campos del videojuego
    game.name = name;
    game.description = description;
    game.released = released;
    game.rating = rating;
    game.img = image;
    game.platforms = platformString;

    // Guarda los cambios del videojuego
    await game.save();

    // Busca los objetos de los géneros
    let genresGame = [];
    for (const g of genres) {
      genresGame.push(await Genre.findOne({ where: { name: g } }));
    }
    // Asigna los géneros al videojuego
    await game.setGenres(genresGame);

    // Formatea la respuesta del videojuego para incluir los nombres de los géneros en lugar de los objetos
    game = {
      ...game.dataValues,
      genres: genres.map((g) => g).join(", "),
    };

    // Envía la respuesta del videojuego actualizado
    return res.status(200).json(game);
  } catch (error) {
    return res.status(404).json(error);
  }
};
