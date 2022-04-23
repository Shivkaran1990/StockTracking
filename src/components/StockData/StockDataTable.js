const StockDataTable = (props) => {
  return (
    <div>
      <table>
        <thead>
          <tr key={"header"}>
            {props.headerKeys.map((key) => (
              <th>{key}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {props.array.map((item) => (
            <tr key={item.id}>
              {Object.values(item).map((val) => (
                <td>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default StockDataTable;
