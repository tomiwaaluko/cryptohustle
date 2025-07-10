import { useState, useEffect } from "react";
import CoinInfo from "./Components/CoinInfo";
import "./App.css";

const API_KEY = import.meta.env.VITE_APP_API_KEY;

function App() {
  const [list, setList] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    if (searchValue !== "") {
      const filteredData = Object.keys(list.Data).filter(
        (item) =>
          list.Data[item].FullName.toLowerCase().includes(
            searchValue.toLowerCase()
          ) ||
          list.Data[item].Symbol.toLowerCase().includes(
            searchValue.toLowerCase()
          )
      );
      setFilteredResults(filteredData);
    } else {
      setFilteredResults(Object.keys(list.Data));
    }
  };

  useEffect(() => {
    const fetchAllCoinData = async () => {
      const response = await fetch(
        `https://min-api.cryptocompare.com/data/all/coinlist?api_key=${API_KEY}`
      );
      const json = await response.json();
      console.log(json.Data);
      setList(json);
    };
    fetchAllCoinData().catch(console.error);
  }, []);

  return (
    <div className="whole-page">
      <h1>My Crypto List</h1>
      <input
        type="text"
        placeholder="Search..."
        onChange={(inputString) => searchItems(inputString.target.value)}
      />
      <ul>
        {searchInput.length > 0
          ? // what happens if we have search input? what list do we use to display coins?
            filteredResults
              .filter(
                (coin) =>
                  list.Data[coin].IsTrading &&
                  list.Data[coin].Algorithm !== "N/A" &&
                  list.Data[coin].ProofType !== "N/A"
              )
              .map((coin) => (
                <CoinInfo
                  key={coin}
                  image={list.Data[coin].ImageUrl}
                  name={list.Data[coin].FullName}
                  symbol={list.Data[coin].Symbol}
                />
              ))
          : list && list.Data
          ? // what happens if we don't have search input? what list do we use to display coins?
            Object.entries(list.Data)
              .filter(
                ([, coinData]) =>
                  coinData.IsTrading &&
                  coinData.Algorithm !== "N/A" &&
                  coinData.ProofType !== "N/A"
              )
              .map(([key, coin]) => (
                <CoinInfo
                  key={key}
                  image={coin.ImageUrl}
                  name={coin.FullName}
                  symbol={coin.Symbol}
                />
              ))
          : null}
      </ul>
    </div>
  );
}

export default App;
