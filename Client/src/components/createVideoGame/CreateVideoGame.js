import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createVideogame } from "../../redux/actions/index";
import styles from "./CreateVideoGame.module.css";

export default function CreateVideoGame() {
  const dispatch = useDispatch(); // Hook para disparar las acciones de Redux
  const history = useHistory(); // Hook para navegar entre páginas
  const { allGenres } = useSelector((state) => state); // Hook para acceder al estado de Redux

  // Estados para manejar los errores en los inputs
  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [releasedError, setReleasedError] = useState(false);
  const [ratingError, setRatingError] = useState(false);
  const [genresError, setGenresError] = useState(false);
  const [platformsError, setPlatformsError] = useState(false);

  // Opciones de plataformas
  const randomPlatforms = [
    "PC",
    "PlayStation",
    "Xbox",
    "Nintendo",
    "Apple Macintosh",
    "Linux",
    "Android",
  ];

  // Estado para almacenar los datos del nuevo juego
  const [game, setGame] = useState({
    name: "",
    description: "",
    image: "",
    released: "",
    rating: "0",
    genres: [],
    platforms: [],
  });

  // Función para manejar el cambio de los inputs
  const handleInputsChange = (e) => {
    setNameError(false);

    setGame({
      ...game,
      [e.target.name]: e.target.value,
    });
  };

  // Función para manejar el cambio de los selects múltiples
  const handleMultiSelectChange = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setGame({
      ...game,
      [e.target.name]: value,
    });
  };

  // Función para borrar los errores en los inputs
  const deleteErrors = () => {
    setNameError(false);
    setDescriptionError(false);
    setImageError(false);
    setReleasedError(false);
    setRatingError(false);
    setGenresError(false);
    setPlatformsError(false);
  };

  // Función que se ejecuta al enviar el formulario
  const handleOnSubmit = (e) => {
    e.preventDefault();
    deleteErrors();
    if (!game.name) return setNameError("enter a name for your game");
    if (!game.description)
      return setDescriptionError("enter a description for your game");
    if (!game.image) return setImageError("choose an image");
    if (!game.released) return setReleasedError("select a released date");
    if (
      !game.rating ||
      parseFloat(game.rating) < 0 ||
      parseFloat(game.rating) > 5
    )
      return setRatingError("enter a rating from 0 to 5");
    if (!game.genres || game.genres.length === 0)
      return setGenresError("select one or more genres");
    if (!game.platforms || game.platforms.length === 0)
      return setPlatformsError("select one or more platforms");

    // Si no hay errores, se borran y se crea el juego
    deleteErrors();
    setGame({
      name: "",
      description: "",
      image: "",
      released: "",
      rating: "0",
      genres: [],
      platforms: [],
    });

    dispatch(createVideogame(game));
    alert("Game created!");
  };

  return (
    <>
      <div className={styles.form}>
        <div className={styles.card}>
          <div>
            <h1>New Game</h1>
            <div>
              <form>
                <div className={styles.line}>
                  <label>Name: </label>
                  <input
                    className={styles.inputDecorated}
                    placeholder="Ej: Need For Speed"
                    type="text"
                    name="name"
                    onChange={handleInputsChange}
                    value={game.name}
                  />
                  <div className={styles.danger}>
                    {nameError && <p>{nameError}</p>}
                  </div>
                </div>
                <div className={styles.line}>
                  <label>Description: </label>
                  <input
                    className={styles.inputDecorated}
                    placeholder="Description of the game"
                    type="text"
                    name="description"
                    onChange={handleInputsChange}
                    value={game.description}
                  />
                  <div className={styles.danger}>
                    {descriptionError && <p>{descriptionError}</p>}
                  </div>
                </div>
                <div className={styles.line}>
                  <label>Image: </label>
                  <input
                    className={styles.inputDecorated}
                    placeholder="Paste url image"
                    type="text"
                    name="image"
                    onChange={handleInputsChange}
                    value={game.image}
                  />
                  <div className={styles.danger}>
                    {imageError && <p>{imageError}</p>}
                  </div>
                </div>
                <div className={styles.line}>
                  <label>Released: </label>
                  <input
                    className={styles.inputDecorated + " " + styles.inputshort}
                    placeholder="Select a date"
                    type="date"
                    name="released"
                    onChange={handleInputsChange}
                    value={game.released}
                  />
                  <div className={styles.danger}>
                    {releasedError && <p>{releasedError}</p>}
                  </div>
                </div>
                <div className={styles.line}>
                  <label>Rating: </label>
                  <input
                    className={styles.inputDecorated + " " + styles.inputshort}
                    placeholder="Select a rating"
                    type="number"
                    name="rating"
                    onChange={handleInputsChange}
                    value={game.rating}
                    min="0"
                    max="5"
                    step=".1"
                  />
                  <div className={styles.danger}>
                    {ratingError && <p>{ratingError}</p>}
                  </div>
                </div>
                <div className={styles.multiselect + " " + styles.line}>
                  <label>Genres: </label>
                  <select
                    className={styles.select}
                    name="genres"
                    multiple
                    size="6"
                    value={game.genres}
                    onChange={handleMultiSelectChange}
                  >
                    {allGenres &&
                      allGenres.map((genre) => (
                        <option key={genre.name} value={genre.name}>
                          {genre.name}
                        </option>
                      ))}
                  </select>
                  <div className={styles.danger}>
                    {genresError && <p>{genresError}</p>}
                  </div>
                </div>
                <div className={styles.multiselect + " " + styles.line}>
                  <label>Platforms: </label>
                  <select
                    className={styles.select}
                    name="platforms"
                    multiple
                    size="6"
                    value={game.platforms}
                    onChange={handleMultiSelectChange}
                  >
                    {randomPlatforms &&
                      randomPlatforms.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                  </select>
                  <div className={styles.danger}>
                    {platformsError && <p>{platformsError}</p>}
                  </div>
                </div>
              </form>
            </div>
            <button className={styles.btn} onClick={history.goBack}>
              Back
            </button>
            <button
              className={styles.btn}
              type="submit"
              onClick={handleOnSubmit}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
