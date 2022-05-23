import { React, useCallback, useState, useRef } from "react";

import debounce from "lodash.debounce";

import styles from "./Search.module.scss";
import searchIcon from "../../assets/img/search-icon.svg";
import searchClose from "../../assets/img/search-close.svg";

import { useDispatch } from "react-redux";
import { setSearchValue } from "../../redux/slices/filterSlice";

const Search = () => {
  const dispatch = useDispatch();

  const [value, setValue] = useState("");
  const inputRef = useRef();

  const updateSearchValue = useCallback(
    debounce((str) => {
      dispatch(setSearchValue(str));
    }, 250),
    []
  );

  const onChangeInput = (event) => {
    setValue(event.target.value);
    updateSearchValue(event.target.value);
  };

  const onClickClear = () => {
    dispatch(setSearchValue(""));
    setValue("");
    inputRef.current.focus();
  };

  return (
    <div className={styles.root}>
      <img
        className={styles.icon}
        width={24}
        height={24}
        src={searchIcon}
        alt="Search"
      />
      <input
        ref={inputRef}
        value={value}
        onChange={onChangeInput}
        placeholder="Поиск пиццы"
      />
      {value && (
        <img
          onClick={() => {
            onClickClear();
          }}
          className={styles.close}
          width={22}
          height={22}
          src={searchClose}
          alt="Close"
        />
      )}
    </div>
  );
};

export default Search;
