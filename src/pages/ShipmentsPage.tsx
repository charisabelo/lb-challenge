import { ReactElement, useEffect, useState } from "react";
import { Box, makeStyles, useTheme } from "@material-ui/core";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import Loader from "react-loader-spinner";
import { fetchShipments, FetchShipmentsResult } from "../data/fetch-shipments";

const COLUMNS: GridColDef[] = [
  {
    field: "houseBillNumber",
    headerName: "House Bill",
    width: 150,
  },
  {
    field: "client",
    headerName: "Shipper",
    width: 200,
  },
  {
    field: "origin",
    headerName: "Origin",
    width: 400,
  },
  {
    field: "destination",
    headerName: "Destination",
    width: 400,
  },
  {
    field: "mode",
    headerName: "Mode",
    width: 200,
  },
  {
    field: "estimatedDeparture",
    headerName: "Estimated Departure",
    width: 200,
  },
  {
    field: "estimatedArrival",
    headerName: "Estimated Arrival",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 200,
  },
];

const useStyles = makeStyles({
  grid: {
    marginInline: 16,
    maxHeight: "92vh",
  },
  loader: {
    margin: "auto",
    width: "fit-content",
    marginTop: 200,
  },
});

type LoadingResult = {
  status: "LOADING";
};
const INITIAL_RESULT: LoadingResult = {
  status: "LOADING",
};

export const ShipmentsPage: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();

  const [height, setHeight] = useState<number>(window.innerHeight);
  const [pageSize, setPageSize] = useState<number>(
    Math.floor((height - 172) / 52)
  );

  window.addEventListener("resize", () => {
    setHeight(window.innerHeight);
  });

  useEffect(() => {
    setPageSize(Math.floor((height - 172) / 52));
  }, [height]);

  const [fetchShipmentsResult, setFetchShipmentsResult] = useState<
    FetchShipmentsResult | LoadingResult
  >(INITIAL_RESULT);
  useEffect(() => {
    fetchShipments().then((result) => setFetchShipmentsResult(result));
  }, []);

  let component: ReactElement;
  switch (fetchShipmentsResult.status) {
    case "SUCCESS":
      component = (
        <DataGrid
          className={classes.grid}
          rows={fetchShipmentsResult.shipments}
          columns={COLUMNS}
          pageSize={pageSize}
          disableSelectionOnClick
        />
      );
      break;
    case "LOADING":
      component = (
        <Box className={classes.loader}>
          <Loader type="Grid" color={theme.palette.primary.main} />
        </Box>
      );
      break;
    case "ERROR":
      component = <p>Error</p>;
      break;
  }

  return component;
};
