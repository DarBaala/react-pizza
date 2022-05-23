import { React, useEffect, useRef, useState } from "react";
import axios from "axios";
import qs from "qs";
import { useNavigate, useLocation } from "react-router-dom";

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
} from "../redux/slices/filterSlice";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const { categoryId, sort, pageCoint, searchValue } = useSelector(
    (state) => state.filter
  );

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(false);

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id));
  };

  const onChangePage = (number) => {
    dispatch(setPageCoint(number));
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

  const fetchPizzas = async () => {
    const category = categoryId > 0 ? `category=${categoryId}` : "";
    const sortBy = sort.sortProperty.replace("-", "");
    const order = sort.sortProperty.includes("-") ? "asc" : "desc";
    const search = searchValue ? `&search=${searchValue}` : "";
    setIsLoading(true);

    try {
      const res = await axios.get(
        `https://62824b53ed9edf7bd8821d30.mockapi.io/items?page=${pageCoint}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
      );
      setItems(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Не получены items c бэкенда");
    }
  };

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
      fetchPizzas();
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
    if (!window.location.search) {
      fetchPizzas();
    }
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
      <div className="content__items">{isLoading ? skeletons : pizzas}</div>
      <Pagination value={pageCoint} onChangePage={onChangePage} />
    </div>
  );
}
export default Home;
