import {
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ShowHideColumnsButton,
  MRT_TableContainer,
  MRT_TablePagination,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  useMaterialReactTable,
} from "material-react-table";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { MRT_Localization_FI } from "@/fi-i18";
import {
  Stack,
  AppBar,
  Toolbar,
  Paper,
  Box,
  IconButton,
  Grid,
} from "@mui/material";
import { Course } from "@prisma/client";
import axios from "axios";
import dayjs from "dayjs";

export async function getStaticProps() {
  const courses: Course[] = (
    await axios.get(`${process.env.BACKEND_URL}/course`)
  ).data;

  return {
    props: {
      courses,
    },
  };
}

export default function Table({ courses }: { courses: Course[] }) {
  const columns = useMemo<MRT_ColumnDef<Course>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Id",
        filterVariant: "autocomplete",
      },
      {
        accessorKey: "name",
        header: "Nimi",
        filterVariant: "autocomplete",
      },
      {
        accessorKey: "illness",
        header: "Sairaus",
        filterVariant: "autocomplete",
      },
      {
        accessorKey: "targetGroup",
        header: "Kohderyhmä",
        filterVariant: "autocomplete",
      },
      {
        accessorKey: "kind",
        header: "Laji",
        filterVariant: "autocomplete",
      },
      {
        accessorKey: "type",
        header: "Luonne",
        filterVariant: "autocomplete",
      },
      {
        accessorKey: "startDate",
        accessorFn: (originalRow) => new Date(originalRow.startDate),
        Cell: ({ cell }) => dayjs(cell.getValue<Date>()).format("DD.MM.YYYY"),
        header: "Alkamispäivä",
        filterVariant: "date-range",
      },
      {
        accessorKey: "area",
        header: "Kurssipaikka",
        filterVariant: "autocomplete",
      },
      {
        accessorKey: "spotsAvailable",
        header: "Tilaa",
        filterVariant: "range",
      },
    ],
    []
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, [pagination.pageIndex]);

  const table = useMaterialReactTable({
    columns,
    data: courses,
    enableRowSelection: false,
    enableFacetedValues: true,
    enableFilterMatchHighlighting: false,
    localization: MRT_Localization_FI,
    muiTableBodyCellProps: {
      sx: {
        border: "1px solid rgba(210, 210, 210, 1)",
      },
    },
    initialState: {
      showGlobalFilter: true,
      showColumnFilters: true,
      columnVisibility: {
        id: false,
      },
    },
    muiTableContainerProps: {
      className: "table-container",
    },
    state: { pagination },
    onPaginationChange: setPagination,
    // renderDetailPanel: ({ row }) => <CardDetailPanel row={row} />,
  });

  return (
    <>
      <Head>
        <title>Kelan kurssit</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Stack>
        <AppBar color="primary" position="fixed">
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Stack direction={"row"} spacing={1}></Stack>
            <Paper>
              <MRT_GlobalFilterTextField table={table} />
            </Paper>
            <Paper>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <MRT_ToggleFiltersButton table={table} />
                <MRT_ShowHideColumnsButton table={table} />
                <MRT_ToggleDensePaddingButton table={table} />
              </Box>
            </Paper>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <MRT_TablePagination table={table} />
      </Stack>
      <MRT_TableContainer table={table} />
      <MRT_TablePagination table={table} />
    </>
  );
}
