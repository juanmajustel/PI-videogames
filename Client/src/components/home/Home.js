import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGenres, getVideoGames } from "../../redux/actions/index";
import Card from "../card/Card";
import Spinner from "../spinner/Spinner";
import Paginated from "../paginated/Paginated";
import NotFound from "../notFound/NotFound";

import "./Home.css";
import NavBar from "../navBar/NavBar";
import Footer from "../footer/footer";

export default function Home() {
  const dispatch = useDispatch(); // Importa useDispatch hook desde Redux para enviar acciones a la store.
  const {
    filteredVideoGames,
    allVideoGames,
    page: pagina,
  } = useSelector((state) => state); // Importa useSelector hook desde Redux para obtener datos de la store.

  const itemsPorPagina = 15; // Establece el número de elementos por página.
  const offset = pagina * itemsPorPagina; // Calcula el offset (desplazamiento) de la página actual.
  const limit = offset + itemsPorPagina; // Calcula el límite de la página actual.

  useEffect(() => {
    if (allVideoGames.length === 0) {
      // Si no hay videojuegos en la store, se despachan acciones para obtener los géneros y videojuegos.
      dispatch(getGenres()); // Despacha la acción getGenres.
      dispatch(getVideoGames()); // Despacha la acción getVideoGames.
    }
  }, [dispatch, allVideoGames.length]); // Este efecto se ejecutará solo una vez, cuando se monte el componente.

  if (typeof filteredVideoGames === "string") {
    // Si no se encontraron resultados de búsqueda, se muestra un mensaje de error.
    return (
      <div className="notFound">
        <NavBar />
        <NotFound />
      </div>
    );
  } else {
    const currentGames = filteredVideoGames.slice(offset, limit); // Obtiene los videojuegos actuales a mostrar en la página actual.

    return (
      <div className="home">
        <NavBar />
        {currentGames.length === 0 && <Spinner />}{" "}
        {/* Si no hay videojuegos actuales, se muestra un spinner. */}
        <div className="cards">
          <div className="grid">
            {currentGames.length > 0 &&
              currentGames.map((game) => (
                <div className="grid-item" key={game.id}>
                  <Card game={game} />{" "}
                  {/* Renderiza una tarjeta de videojuego. */}
                </div>
              ))}
          </div>
        </div>
        {currentGames.length > 0 && ( // Si hay videojuegos actuales, se muestra la paginación.
          <Paginated
            pagina={pagina}
            totalItems={filteredVideoGames.length}
            itemsPorPagina={itemsPorPagina}
          />
        )}
        <Footer />
      </div>
    );
  }
}
