require("dotenv").config();
const URL = "https://api.rawg.io/api";
const axios = require("axios");
const { API_KEY } = process.env;
const { Videogame, Genre } = require("../db.js");

exports.getVideogames = async (req, res) => {
  const { name } = req.query; // obtiene el parámetro 'name' de la query string de la petición
  let allVideoGames = []; // array que contendrá todos los videojuegos a devolver
  let gamesDBFull = []; // array que contendrá los videojuegos de la base de datos que coinciden con la búsqueda
  let gamesDB = []; // array que contendrá los videojuegos de la base de datos
  let nextUrl = URL; // URL de la siguiente página de la API de videojuegos
  let findedVideoGames = []; // array que contendrá los videojuegos obtenidos de la API de videojuegos

  try {
    if (name) {
      // si se busca un videojuego por nombre
      // busca en la base de datos los videojuegos que coinciden con el nombre
      gamesDB = await Videogame.findAll({
        where: { name: name },
        include: [Genre],
      });

      // si hay videojuegos en la base de datos que coinciden con el nombre de búsqueda, los agrega al array 'gamesDBFull'
      if (gamesDB.length > 0) {
        gamesDBFull = gamesDB.map((g) => ({
          id: g.dataValues.id,
          name: g.dataValues.name,
          img: g.dataValues.img,
          platforms: g.platforms,
          genres: g.dataValues.genres
            .map((g) => g.name)
            .filter((p) => p != null)
            .join(", "),
        }));
      }

      // busca en la API de videojuegos los videojuegos que coinciden con el nombre
      const { data } = await axios.get(
        `${URL}/games?search=${name}&key=${API_KEY}`
      );

      // formatea los resultados obtenidos de la API de videojuegos y los agrega al array 'findedVideoGames'
      findedVideoGames = data.results.map((game) => {
        return {
          id: game.id,
          name: game.name,
          img: game.background_image,
          platforms:
            game.parent_platforms &&
            game.parent_platforms
              .map((p) => p.platform.name)
              .filter((p) => p != null)
              .join(", "),
          genres:
            game.genres &&
            game.genres
              .map((g) => g.name)
              .filter((g) => g != null)
              .join(", "),
        };
      });

      // combina los videojuegos obtenidos de la base de datos y de la API de videojuegos en un solo array 'findedVideoGames'
      findedVideoGames = gamesDBFull.concat(findedVideoGames);
      // si se encontraron videojuegos, se devuelve un arreglo con los primeros 15
      // si no se encontraron videojuegos, se devuelve "No games"
      if (findedVideoGames.length > 0)
        return res.status(200).json(findedVideoGames.slice(0, 15));
      else {
        return res.status(200).json("No games");
      }
    }
    // se hace una petición a la API de videojuegos cinco veces, para obtener los primeros 100 resultados
    for (let i = 1; i < 6; i++) {
      const { data } = await axios.get(
        `${nextUrl}/games?key=${API_KEY}&page=${i}`
      );
      // se actualiza la URL para obtener la siguiente página de resultados
      nextUrl = data.next;

      const videoGame = data.results.map((game) => {
        return {
          id: game.id,
          name: game.name,
          img: game.background_image,
          platforms:
            game.parent_platforms &&
            game.parent_platforms
              .map((p) => p.platform.name)
              .filter((p) => p != null)
              .join(", "),
          genres:
            game.genres &&
            game.genres
              .map((g) => g.name)
              .filter((g) => g != null)
              .join(", "),
          rating: game.rating,
        };
      });
      // se concatenan los resultados de esta página con los anteriores
      allVideoGames = allVideoGames.concat(videoGame);
    }
    // se obtienen todos los videojuegos almacenados en la base de datos, incluyendo sus géneros
    gamesDB = await Videogame.findAll({ include: [Genre] });
    gamesDBFull = gamesDB.map((g) => ({
      id: g.dataValues.id,
      name: g.dataValues.name,
      img: g.dataValues.img,
      platforms: g.platforms,
      genres: g.dataValues.genres
        .map((g) => g.name)
        .filter((p) => p != null)
        .join(", "),
    }));
    // se concatenan los resultados obtenidos de la API con los obtenidos de la base de datos
    allVideoGames = allVideoGames.concat(gamesDBFull);

    return res.status(200).json(allVideoGames);
  } catch (error) {
    return res.status(400).send(error);
  }
};
