import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { fiFI } from "@mui/x-date-pickers/locales";
import "dayjs/locale/fi";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LocalizationProvider
      adapterLocale="fi"
      localeText={
        fiFI.components.MuiLocalizationProvider.defaultProps.localeText
      }
      dateAdapter={AdapterDayjs}
    >
      <Component {...pageProps} />{" "}
    </LocalizationProvider>
  );
}
