import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { emptyFilteredVideoGames, searchVideoGames } from "../../actions";
import styles from "./SearchBar.module.css";

export default function SearchBar({setFilterBy, setOrderBy}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [search, setSearch] = useState("");

    const handleChange = (event) => {
        setSearch(event.target.value);
    };

    const handleClick = (event) => {
        if (search === "") return;
        setFilterBy("");
        setOrderBy("");
        dispatch(emptyFilteredVideoGames());
        dispatch(searchVideoGames(search));
        setSearch("");
        history.push("/home");
    };

    return (
        <div data-testid="searchbar" className={styles.searchBar}>
            <input
                type="text"
                id="searchBox"
                name="searchBox"
                placeholder="Search"
                onChange={handleChange}
                value={search}
                autoComplete="off"
                className={styles.inputDecorated}
            />

            <button onClick={handleClick} className={styles.btn}>🔎</button>
        </div>
    );
}
