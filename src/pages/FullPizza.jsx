import { React, useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

const FullPizza = () => {
  const [pizza, setPizza] = useState();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPizza() {
      try {
        const { data } = await axios.get(
          "https://62824b53ed9edf7bd8821d30.mockapi.io/items/" + id
        );
        setPizza(data);
        console.log(data);
      } catch (error) {
        console.error("не получена пицца в fullapizza.jsx");
        alert("Пицца не найдена:(");
        navigate("/");
      }
    }
    fetchPizza();
  }, []);

  if (!pizza) {
    return "LOADING...";
  }

  return (
    <div className="container">
      <img width={260} height={260} src={pizza.image} />
      <h2>{pizza.title}</h2>
      <p>Наша {pizza.title} самая вкусная пицца в мире!</p>
      <h4>{pizza.price} руб.</h4>
      <Link to="/">
        <div className="button pay-btn">
          <span>Назад</span>
        </div>
      </Link>
    </div>
  );
};

export default FullPizza;
