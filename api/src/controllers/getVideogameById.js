require("dotenv").config();
const URL = "https://api.rawg.io/api";
const axios = require("axios");
const { Genre, Videogame } = require("../db.js");

const { API_KEY } = process.env;

exports.getVideogameById = async (req, res) => {
  const { id } = req.params;
  let detailVideoGame = {};

  try {
    if (id.length < 10) {
      // si el id tiene menos de 10 caracteres, se trata de un videojuego de la API externa
      const { data } = await axios.get(`${URL}/games/${id}?key=${API_KEY}`);

      // Se extraen los datos relevantes del objeto que devuelve la API y se guardan en un objeto con un formato más sencillo
      detailVideoGame = {
        id: data.id,
        name: data.name,
        img: data.background_image,
        genres:
          data.genres &&
          data.genres
            .map((g) => g.name)
            .filter((g) => g != null)
            .join(", "),
        description:
          data.description.length < 1200
            ? data.description
            : data.description.substring(0, 1200) + " ...",
        released: data.released,
        rating: data.rating,
        platforms:
          data.parent_platforms &&
          data.parent_platforms
            .map((p) => p.platform.name)
            .filter((p) => p != null)
            .join(", "),
      };

      return res.status(200).json(detailVideoGame); // se devuelve el objeto con los datos del videojuego
    } else {
      // si el id tiene 10 o más caracteres, se trata de un videojuego de la base de datos
      detailVideoGame = await Videogame.findOne({
        where: { id: id },
        include: {
          model: Genre,
          attributes: ["name"],
          through: { attributes: [] },
        },
      });

      // Se extraen los datos relevantes del objeto que devuelve la base de datos y se guardan en un objeto con un formato más sencillo
      const formatedDetailVideoGame = {
        id: detailVideoGame.id,
        name: detailVideoGame.name,
        description: detailVideoGame.description,
        img: detailVideoGame.img,
        released: detailVideoGame.released,
        rating: detailVideoGame.rating,
        platforms: detailVideoGame.platforms,
        genres: detailVideoGame.genres
          .map((p) => p.name)
          .filter((p) => p != null)
          .join(", "),
      };

      return res.status(200).json(formatedDetailVideoGame); // se devuelve el objeto con los datos del videojuego
    }
  } catch (error) {
    return res.status(400).send(error);
  }
};
