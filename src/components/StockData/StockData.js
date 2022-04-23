import React, { useState, useContext } from "react";
import AuthContext from "../../store/auth-context";
import StockDataTable from "./StockDataTable";
const FIREBASE_DOMAIN = "https://stockmarket-4734c-default-rtdb.firebaseio.com";
const StockData = () => {
  const ctx = useContext(AuthContext);
  const [file, setFile] = useState();
  const [array, setArray] = useState([]);

  const fileReader = new FileReader();

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const csvFileToArray = (string) => {
    const csvHeader = string
      .slice(0, string.indexOf("\n"))
      .replaceAll(".", "")
      .replaceAll(" ", "")
      .replaceAll("&", "")
      .split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map((i) => {
      const values = i.split(",");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });

    setArray(array);
    console.log(array);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
      };
      fileReader.readAsText(file);
      // submitStockData(array);
    }
  };

  const submitStockData = async (e) => {
    var sdata = [];
    array.map((item) => {
      var tempdata = {
        instrument: item.Instrument,
        qty: item.Qty,
        avgcost: item.Avgcost,
        ltp: item.LTP,
        currentvalue: item.Curval,
        profitloss: item.PL,
        netchg: item.Netchg,
        daychg: item.Daychg,
        targetprice: 30,
      };
      sdata.push(tempdata);
    });

    let filename = ctx.username + "_stockdata.json";
    const response = await fetch(`${FIREBASE_DOMAIN}/${filename}`, {
      method: "POST",
      body: JSON.stringify(sdata),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not create quote.");
    }
    return null;
  };

  const headerKeys = Object.keys(Object.assign({}, ...array));

  return (
    <div style={{ textAlign: "center" }}>
      <h1>REACTJS CSV IMPORT EXAMPLE </h1>
      <form>
        <input
          type={"file"}
          id={"csvFileInput"}
          accept={".csv"}
          onChange={handleOnChange}
        />
        <button onClick={handleOnSubmit}> IMPORT CSV </button>
        <button type="button" onClick={submitStockData}>
          summit to firbase
        </button>
      </form>
      <StockDataTable headerKeys={headerKeys} array={array}></StockDataTable>
      <br />
    </div>
  );
};

export default StockData;
