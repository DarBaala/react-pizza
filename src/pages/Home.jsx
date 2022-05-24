import { React, useEffect, useRef } from "react";
import qs from "qs";
import { useNavigate } from "react-router-dom";

import Categories from "../components/Categories";
import Sort from "../components/Sort";
import PizzaBlock from "../components/PizzaBlock/PizzaBlock";
import Skeleton from "../components/PizzaBlock/Skeleton";
import Pagination from "../components/Pagination";
import { sortList } from "../components/Sort";

import { useSelector, useDispatch } from "react-redux";
import {
  setCategoryId,
  setPageCoint,
  setFiltres,
  selectFilter,
} from "../redux/slices/filterSlice";
import { fetchPizzas, selectPizzaData } from "../redux/slices/pizzaSlice";

function Home() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { categoryId, sort, pageCoint, searchValue } =
    useSelector(selectFilter);
  const { items, status } = useSelector(selectPizzaData);

  const isMounted = useRef(false);

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id));
  };

  const onChangePage = (number) => {
    dispatch(setPageCoint(number));
  };

  const getPizzas = async () => {
    const category = categoryId > 0 ? `category=${categoryId}` : "";
    const sortBy = sort.sortProperty.replace("-", "");
    const order = sort.sortProperty.includes("-") ? "asc" : "desc";
    const search = searchValue ? `&search=${searchValue}` : "";

    dispatch(fetchPizzas({ category, sortBy, order, search, pageCoint }));
  };

  const pizzas = items
    .filter((obj) => {
      if (obj.title.toLowerCase().includes(searchValue.toLowerCase())) {
        return true;
      }
      return false;
    })
    .map((obj) => <PizzaBlock key={obj.id} {...obj} />);
  const skeletons = [...new Array(4)].map((_, index) => (
    <Skeleton key={index} />
  ));

  useEffect(() => {
    if (isMounted.current) {
      const params = {
        categoryId: categoryId > 0 ? categoryId : null,
        sortProperty: sort.sortProperty,
        pageCoint,
      };
      const queryString = qs.stringify(params, { skipNulls: true });
      navigate(`/?${queryString}`);
    }
  }, [categoryId, sort, searchValue, pageCoint]);

  useEffect(() => {
    if (isMounted.current) {
      getPizzas();
    }
  }, [categoryId, sort, searchValue, pageCoint]);

  useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));
      const sort = sortList.find(
        (obj) => obj.sortProperty === params.sortProperty
      );
      if (sort) {
        params.sort = sort;
      }
      dispatch(setFiltres(params));
    }
    isMounted.current = true;
  }, []);

  useEffect(() => {
    getPizzas();
  }, []);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChageCategory={onChangeCategory} />
        <Sort />
      </div>
      <h2 className="content__title">
        {searchValue ? "Поиск пицц:" : "Все пиццы"}
      </h2>
      {status === "error" ? (
        <div className="content__error-info">
          <h2>
            Произошла ошибка <icon>😕</icon>
          </h2>
          <p>
            К сожалению, пиццы отпраивлись на войну и мы не смогли их заполучить
          </p>
        </div>
      ) : (
        <div className="content__items">
          {status === "loading" ? skeletons : pizzas}
        </div>
      )}
      <Pagination value={pageCoint} onChangePage={onChangePage} />
    </div>
  );
}
export default Home;
