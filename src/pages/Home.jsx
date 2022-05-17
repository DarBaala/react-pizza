import React from "react";
import axios from "axios";

import Categories from "../components/Categories";
import Sort from "../components/Sort";
import PizzaBlock from "../components/PizzaBlock/PizzaBlock";
import Skeleton from "../components/PizzaBlock/Skeleton";

function Home() {
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [categoryId, setCategoryId] = React.useState(0);
  const [sortType, setSortType] = React.useState({
    name: "популярности",
    sortProperty: "rating",
  });

  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        await axios
          .get(
            `https://62824b53ed9edf7bd8821d30.mockapi.io/items?${
              categoryId > 0 ? `category=${categoryId}` : ""
            }&sortBy=${sortType.sortProperty.replace("-", "")}&order=${
              sortType.sortProperty.includes("-") ? "asc" : "desc"
            }`
          )
          .then((obj) => setItems(obj.data));
      } catch (error) {
        console.error("NOT GET ITEMS");
      }
      setIsLoading(false);
    }
    fetchData();
  }, [categoryId, sortType]);

  return (
    <div className="container">
      <div className="content__top">
        <Categories
          value={categoryId}
          onChageCategory={(i) => {
            setCategoryId(i);
          }}
        />
        <Sort
          value={sortType}
          onChangeSort={(i) => {
            setSortType(i);
          }}
        />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">
        {isLoading
          ? [...new Array(6)].map((_, index) => <Skeleton key={index} />)
          : items.map((obj) => <PizzaBlock key={obj.id} {...obj} />)}
      </div>
    </div>
  );
}
export default Home;
