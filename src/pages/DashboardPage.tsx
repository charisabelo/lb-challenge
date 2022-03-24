import { fetchShipments } from "../data/fetch-shipments";
import { useEffect, useState } from "react";
import tableIcons from "./tableIcons";
import MaterialTable from "material-table";

export const DashboardPage: React.FC = () => {
  let date: Date = new Date();
  const currDate: Date = new Date();
  date.setDate(date.getDate() + 7);
  const currMonth: string =
    (currDate.getMonth() + 1).toString().length < 2
      ? `0${currDate.getMonth() + 1}`
      : `${currDate.getMonth() + 1}`;
  const month: string =
    (date.getMonth() + 1).toString().length < 2
      ? `0${date.getMonth() + 1}`
      : `${date.getMonth() + 1}`;
  const year: string = `${date.getFullYear()}`;
  const currDay =
    currDate.getDate().toString().length < 2
      ? `0${currDate.getDate()}`
      : `${currDate.getDate()}`;
  const day: string =
    date.getDate().toString().length < 2
      ? `0${date.getDate()}`
      : `${date.getDate()}`;

  const nextSevenDays: string = `${month}/${day}/${year}`;
  const current: string = `${currMonth}/${currDay}/${year}`;

  const [results, setResults] = useState<any>();
  const [newArrivals, setNewArrivals] = useState<any>();
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = [
    { title: "House Bill", field: "houseBillNumber", type: "string" },
    { title: "Est Arrival", field: "estimatedArrival", type: "string" },
    { title: "Client", field: "client", type: "string" },
  ];

  useEffect(() => {
    fetchShipments().then((result) => {
      setResults(result);
    });
  }, []);

  useEffect(() => {
    if (results !== undefined) {
      const arrivals = results.shipments.filter((item: any) => {
        return (
          item.estimatedArrival >= current &&
          item.estimatedArrival <= nextSevenDays
        );
      });
      arrivals.sort((a: any, b: any) => {
        a = a.estimatedArrival.split("/").reverse().join("");
        b = b.estimatedArrival.split("/").reverse().join("");
        return a > b ? 1 : a < b ? -1 : 0;
      });
      setNewArrivals(arrivals);
    }
  }, [results]);

  const title: string = "New Arrivals(Next 7 Days)";

  return (
    <div style={{ maxWidth: "100%" }}>
      <MaterialTable
        title={title}
        icons={tableIcons}
        columns={columns as any}
        data={newArrivals as any}
        options={{
          search: false,
        }}
      />
    </div>
  );
};
