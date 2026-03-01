import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./invest.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const stocks = ["AAPL", "TSLA", "GOOGL", "AMZN", "MSFT"];
// Načti svůj API klíč (můžeš ho mít také přímo napsaný, pokud nechceš používat .env)
// Například: const API_KEY = "RB7QUX45CVGEDU2P";
const API_KEY = "RB7QUX45CVGEDU2P";

function Invest() {
  const [selectedStock, setSelectedStock] = useState(null);
  const [rawTimeSeries, setRawTimeSeries] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [stockInfo, setStockInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // Možné hodnoty: "1M", "1Y", "5Y", "ALL"
  const [selectedPeriod, setSelectedPeriod] = useState("1M");

  // Pro ladění (ověření, že se API klíč načítá správně)
  console.log("API_KEY:", API_KEY);

  // Načítání dat pro vybranou akcii
  useEffect(() => {
    async function fetchStockData(stock) {
      try {
        setLoading(true);
        setError(null);
        setRawTimeSeries(null);
        setChartData(null);
        setStockInfo(null);

        // Přidán parametr outputsize=full pro kompletní historii
        const response = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock}&apikey=${API_KEY}&outputsize=full`
        );
        if (!response.ok) {
          throw new Error("Chyba při načítání dat");
        }
        const data = await response.json();

        if (data["Error Message"]) {
          throw new Error(data["Error Message"]);
        }
        if (data["Note"]) {
          throw new Error(data["Note"]);
        }

        const timeSeries = data["Time Series (Daily)"];
        if (!timeSeries) {
          throw new Error("Data mají neočekávaný formát");
        }

        setRawTimeSeries(timeSeries);

        // Uložení základních informací z posledního dne
        const dates = Object.keys(timeSeries).sort();
        const latestDate = dates[dates.length - 1];
        const latestInfo = timeSeries[latestDate];
        setStockInfo({ date: latestDate, ...latestInfo });
      } catch (err) {
        console.error("Chyba při načítání dat:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (selectedStock) {
      fetchStockData(selectedStock);
    }
  }, [selectedStock, API_KEY]);

  // Aktualizace dat pro graf podle vybraného období
  useEffect(() => {
    if (!rawTimeSeries || !selectedStock) return;

    const dates = Object.keys(rawTimeSeries).sort();
    const latestDateObj = new Date(dates[dates.length - 1]);
    let thresholdDate = null;
    switch (selectedPeriod) {
      case "1M":
        thresholdDate = new Date(latestDateObj);
        thresholdDate.setMonth(thresholdDate.getMonth() - 1);
        break;
      case "1Y":
        thresholdDate = new Date(latestDateObj);
        thresholdDate.setFullYear(thresholdDate.getFullYear() - 1);
        break;
      case "5Y":
        thresholdDate = new Date(latestDateObj);
        thresholdDate.setFullYear(thresholdDate.getFullYear() - 5);
        break;
      case "ALL":
      default:
        thresholdDate = null;
        break;
    }

    let filteredDates = dates;
    if (thresholdDate) {
      filteredDates = dates.filter((dateStr) => new Date(dateStr) >= thresholdDate);
    }
    const labels = filteredDates;
    const prices = filteredDates.map((dateStr) =>
      parseFloat(rawTimeSeries[dateStr]["4. close"])
    );

    const newChartData = {
      labels,
      datasets: [
        {
          label: `${selectedStock} Stock Price ($)`,
          data: prices,
          borderColor: "rgba(75,192,192,1)",
          backgroundColor: "rgba(75,192,192,0.2)",
        },
      ],
    };
    setChartData(newChartData);
  }, [rawTimeSeries, selectedPeriod, selectedStock]);

  return (
    <div className="invest-page">
      <h1>Invest</h1>
      <div className="stock-list">
        {stocks.map((stock) => (
          <button
            key={stock}
            onClick={() => {
              setSelectedStock(stock);
              setSelectedPeriod("1M"); // Při výběru akcie resetujeme období na 1 měsíc
            }}
            className="stock-button"
          >
            {stock}
          </button>
        ))}
      </div>

      {loading && <p>Načítám data...</p>}
      {error && <p>Chyba: {error}</p>}

      {selectedStock && chartData && (
        <div className="data-container" style={{ display: "flex", gap: "20px" }}>
          <div className="chart-section">
            {/* Volba období */}
            <div className="period-buttons" style={{ marginBottom: "10px" }}>
              <button onClick={() => setSelectedPeriod("1M")} disabled={selectedPeriod === "1M"}>
                1 měsíc
              </button>
              <button onClick={() => setSelectedPeriod("1Y")} disabled={selectedPeriod === "1Y"}>
                1 rok
              </button>
              <button onClick={() => setSelectedPeriod("5Y")} disabled={selectedPeriod === "5Y"}>
                5 let
              </button>
              <button onClick={() => setSelectedPeriod("ALL")} disabled={selectedPeriod === "ALL"}>
                All Time
              </button>
            </div>
            {/* Kontejner pro graf s omezenými rozměry */}
            <div className="chart-container" style={{ width: "600px", height: "400px" }}>
              <Line data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
          {/* Tabulka se základními informacemi */}
          <div className="info-section">
            <h2>Základní informace</h2>
            {stockInfo ? (
              <table>
                <tbody>
                  <tr>
                    <td>Datum</td>
                    <td>{stockInfo.date}</td>
                  </tr>
                  <tr>
                    <td>Open</td>
                    <td>{stockInfo["1. open"]}</td>
                  </tr>
                  <tr>
                    <td>High</td>
                    <td>{stockInfo["2. high"]}</td>
                  </tr>
                  <tr>
                    <td>Low</td>
                    <td>{stockInfo["3. low"]}</td>
                  </tr>
                  <tr>
                    <td>Close</td>
                    <td>{stockInfo["4. close"]}</td>
                  </tr>
                  <tr>
                    <td>Volume</td>
                    <td>{stockInfo["5. volume"]}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p>Načítám informace...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Invest;
