import { useEffect, useRef } from "react";
import qs from "qs";
import { useNavigate } from "react-router-dom";

import Categories from "../components/Categories";
import SortPopup from "../components/SortPopup";
import PizzaBlock from "../components/PizzaBlock/PizzaBlock";
import Skeleton from "../components/PizzaBlock/Skeleton";
import Pagination from "../components/Pagination";
import { sortList } from "../components/SortPopup";

import { useSelector } from "react-redux";
import {
  setCategoryId,
  setPageCoint,
  setFiltres,
  selectFilter,
} from "../redux/slices/filterSlice";
import {
  fetchPizzas,
  SearchPizzaParams,
  selectPizzaData,
} from "../redux/slices/pizzaSlice";
import { useAppDispatch } from "../redux/store";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { categoryId, sort, pageCoint, searchValue } =
    useSelector(selectFilter);
  const { items, status } = useSelector(selectPizzaData);

  const isMounted = useRef(false);

  const onChangeCategory = (idx: number) => {
    dispatch(setCategoryId(idx));
  };

  const onChangePage = (page: number) => {
    dispatch(setPageCoint(page));
  };

  const getPizzas = async () => {
    const category = categoryId > 0 ? `category=${categoryId}` : "";
    const sortBy = sort.sortProperty.replace("-", "");
    const order = sort.sortProperty.includes("-") ? "asc" : "desc";
    const search = searchValue ? `&search=${searchValue}` : "";

    dispatch(
      fetchPizzas({
        category,
        sortBy,
        order,
        search,
        pageCoint: String(pageCoint),
      })
    );
  };

  const pizzas = items
    .filter((obj: any) => {
      if (obj.title.toLowerCase().includes(searchValue.toLowerCase())) {
        return true;
      }
      return false;
    })
    .map((obj: any) => <PizzaBlock key={obj.id} {...obj} />);
  const skeletons = [...new Array(4)].map((_, index) => (
    <Skeleton key={index} />
  ));

  // useEffect(() => {
  //   if (isMounted.current) {
  //     const params = {
  //       categoryId: categoryId > 0 ? categoryId : null,
  //       sortProperty: sort.sortProperty,
  //       pageCoint,
  //     };
  //     const queryString = qs.stringify(params, { skipNulls: true });
  //     navigate(`/?${queryString}`);
  //   }
  //   if (!window.location.search) {
  //     dispatch(fetchPizzas({} as SearchPizzaParams));
  //   }
  // }, [categoryId, sort, searchValue, pageCoint]);

  // useEffect(() => {
  //   if (isMounted.current) {
  //     getPizzas();
  //   }
  // }, [categoryId, sort, searchValue, pageCoint]);

  // useEffect(() => {
  //   if (window.location.search) {
  //     const params = qs.parse(
  //       window.location.search.substring(1)
  //     ) as unknown as SearchPizzaParams;
  //     const sort = sortList.find((obj) => obj.sortProperty === params.sortBy);
  //     dispatch(
  //       setFiltres({
  //         categoryId: Number(params.category),
  //         pageCoint: Number(params.pageCoint),
  //         sort: sort || sortList[0],
  //         searchValue: params.search,
  //       })
  //     );
  //   }
  //   isMounted.current = true;
  // }, []);

  useEffect(() => {
    getPizzas();
  }, [categoryId, sort.sortProperty, searchValue, pageCoint]);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChageCategory={onChangeCategory} />
        <SortPopup />
      </div>
      <h2 className="content__title">
        {searchValue ? "Поиск пицц:" : "Все пиццы"}
      </h2>
      {status === "error" ? (
        <div className="content__error-info">
          <h2>Произошла ошибка 😕</h2>
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
};
export default Home;
