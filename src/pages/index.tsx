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
import LaunchIcon from "@mui/icons-material/Launch";
import {
  Stack,
  AppBar,
  Toolbar,
  Paper,
  Box,
  IconButton,
  Grid,
} from "@mui/material";
import { MRT_Localization_FI } from "material-react-table/locales/fi";
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
        Cell({ row }) {
          return (
            <a
              target="_blank"
              href={`https://kuntoutus.kela.fi/kurssihaku/KZInternetApplication/YleiskyselyHakuUseCase?valittu=${row.original.id}&lang=fi`}
            >
              {row.original.name}
            </a>
          );
        },
      },
      {
        header: "Kurssin alue",
        accessorFn: (row) => {
          return row.patientArea ? row.patientArea : row.patientAreaDescription;
        },
        filterVariant: "multi-select",
        // filterFn: (row, id, filterValue: string[]) => {
        //   if (filterValue.length === 0) return true;

        //   if (filterValue.includes("Asiakkaita valitaan koko maasta")) {
        //     if (row.original.patientArea) {
        //       return filterValue.includes(row.original.patientArea);
        //     } else {
        //       return (
        //         row.original.patientAreaDescription ===
        //         "Asiakkaita valitaan koko maasta"
        //       );
        //     }
        //   } else {
        //     return filterValue.includes(row.original.patientArea as string);
        //   }
        // },
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
        filterVariant: "multi-select",
      },
      {
        accessorKey: "type",
        header: "Luonne",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "startDate",
        accessorFn: (originalRow) => new Date(originalRow.startDate),
        Cell: ({ cell }) => dayjs(cell.getValue<Date>()).format("DD.MM.YYYY"),
        header: "Alkamispäivä",
        filterVariant: "date-range",
        size: 150,
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
        size: 100,
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
    columnFilterDisplayMode: "popover",
    localization: MRT_Localization_FI,
    enableRowVirtualization: false,
    layoutMode: "grid",
    enablePagination: true,
    muiTableBodyCellProps: {
      sx: {
        border: "1px solid rgba(210, 210, 210, 1)",
        whiteSpace: "normal",
      },
    },
    initialState: {
      density: "compact",
      showGlobalFilter: true,
      // showColumnFilters: true,
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
