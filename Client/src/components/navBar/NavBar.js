import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  changePage,
  filterPlataform,
  filterVideoGames,
  orderVideoGames,
  origenFilterVideoGames,
} from "../../actions";
import SearchBar from "../searchBar/SearchBar";
import styles from "./NavBar.module.css";

export default function NavBar() {
  // Usamos los hooks useDispatch y useSelector para conectarnos al store y obtener y actualizar su estado
  const dispatch = useDispatch();
  const { allGenres, filterState, origenState, orderState, platformState } =
    useSelector((state) => state);

  // Usamos el hook useState para mantener el estado de las opciones de orden, filtro, origen y plataforma
  const [orderBy, setOrderBy] = useState(orderState);
  const [filterBy, setFilterBy] = useState(filterState);
  const [origenBy, setOrigenBy] = useState(origenState);
  const [platformBy, setPlataformBy] = useState(platformState);

  // Esta función se encarga de actualizar las opciones de orden, filtro, origen y plataforma y enviarlas al store
  const setSelects = (order = "", filter = "", origen = "", platform = "") => {
    setOrderBy(order);
    setFilterBy(filter);
    setPlataformBy(platform);
    setOrigenBy(origen);
    dispatch(origenFilterVideoGames(origen));
    dispatch(filterPlataform(platform));
    dispatch(filterVideoGames(filter));
    dispatch(orderVideoGames(order));
    dispatch(changePage(0));
  };

  // Esta función se llama cuando el usuario cambia la opción de ordenamiento
  const handleChangeOrder = (e) => {
    setSelects(e.target.value, filterBy, origenBy, platformBy);
  };

  // Esta función se llama cuando el usuario cambia la opción de filtro
  const handleChangeFilter = (e) => {
    setSelects(orderBy, e.target.value, origenBy, platformBy);
  };

  // Esta función se llama cuando el usuario cambia la opción de origen
  const handleChangeOrigen = (e) => {
    setSelects(orderBy, filterBy, e.target.value, platformBy);
  };

  // Esta función se llama cuando el usuario cambia la opción de plataforma
  const handleChangePlataform = (e) => {
    setSelects(orderBy, filterBy, origenBy, e.target.value);
  };

  // Esta función se llama cuando el usuario hace clic en el botón de limpiar filtros
  const handleCleanFilters = () => {
    setSelects();
  };

  return (
    // Este es el contenedor principal de la barra de navegación
    <div name="navBarContainer" className={styles.navbar}>
      {/* Este es el enlace para ir a la página principal */}
      <Link
        to="/home"
        style={{ textDecoration: "none" }}
        className={styles.link}
      ></Link>
      {/* Este es el enlace para ir a la página de agregar un nuevo videojuego */}
      <Link
        to="/newgame"
        className={styles.newgame}
        style={{ textDecoration: "none" }}
      >
        Create Game
      </Link>
      {/* // Este es un select para ordenar los elementos de la lista por un
      criterio específico // El valor seleccionado se almacena en la variable
      orderBy // handleChangeOrder es una función que se ejecuta cada vez que se
      selecciona una opción */}
      <select
        className={styles.select}
        value={orderBy}
        name="order"
        id="order-select"
        onChange={handleChangeOrder}
      >
        <option value=""> Order </option>
        <option value="abc-asc">A-Z</option>
        <option value="abc-desc">Z-A</option>
        <option value="rating-asc">Rating +</option>
        <option value="rating-desc">Rating -</option>
      </select>
      {/* // Este es un select para filtrar los elementos de la lista por plataforma
      // El valor seleccionado se almacena en la variable platformBy //
      handleChangePlataform es una función que se ejecuta cada vez que se
      selecciona una opción */}
      <select
        className={styles.select}
        value={platformBy}
        name="plataformas"
        id="plataformas-select"
        onChange={handleChangePlataform}
      >
        <option value=""> Plataform -</option>
        <option value="android">Android</option>
        <option value="apple macintosh">Apple Macintosh</option>
        <option value="linux">Linux</option>
        <option value="nintendo">Nintendo</option>
        <option value="pc">PC</option>
        <option value="playstation">PlayStation</option>
        <option value="xbox">Xbox</option>
      </select>
      {/* // Este es un select para filtrar los elementos de la lista por género //
      El valor seleccionado se almacena en la variable filterBy //
      handleChangeFilter es una función que se ejecuta cada vez que se
      selecciona una opción */}
      <select
        className={styles.select}
        value={filterBy}
        name="genre"
        id="genre-select"
        onChange={handleChangeFilter}
      >
        <option value=""> Genre </option>

        {/* Este código mapea todos los géneros en la variable allGenres y crea una opción para cada uno */}
        {allGenres &&
          allGenres.map((g) => (
            <option key={g.name} value={g.name}>
              {g.name}
            </option>
          ))}
      </select>
      {/* // Este es un select para filtrar los elementos de la lista por fuente //
      El valor seleccionado se almacena en la variable origenBy //
      handleChangeOrigen es una función que se ejecuta cada vez que se
      selecciona una opción */}
      <select
        className={styles.select}
        name="origen"
        id="origen-select"
        value={origenBy}
        onChange={handleChangeOrigen}
      >
        <option value=""> Source </option>
        <option value="api">API WEB</option>
        <option value="db">DB</option>
      </select>
      {/* // Este botón ejecuta la función handleCleanFilters cuando se hace clic en
      él */}
      <button onClick={handleCleanFilters} className={styles.btn}>
        Clean Filters
      </button>
      {/* // Este es un componente personalizado llamado SearchBar que permite
      buscar elementos en la lista */}
      <SearchBar setFilterBy={setFilterBy} setOrderBy={setOrderBy} />
    </div>
  );
}
