import React from "react";

type CategoriesProps = {
  value: number;
  onChageCategory: (idx: number) => void;
};

const Categories: React.FC<CategoriesProps> = ({ value, onChageCategory }) => {
  const categories = [
    "Все",
    "Мясные",
    "Вегетарианская",
    "Гриль",
    "Острые",
    "Закрытые",
  ];
  return (
    <div className="categories">
      <ul>
        {categories.map((categoryName, i) => {
          return (
            <li
              key={i}
              onClick={() => {
                onChageCategory(i);
              }}
              className={value === i ? "active" : ""}
            >
              {categoryName}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default Categories;
