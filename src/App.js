import "sanitize.css";
import React from "react";
import { ThemeProvider } from "styled-components";
import {  theme } from "./Theme";
import ListMap from "./Map/ListMap";
import {MOCK_DESTINATIONS_DATA,MOCK_ORIGINS_DATA} from "./data"

const App = () => (
	<ThemeProvider theme={theme}>
		<ListMap />
    	</ThemeProvider>
);

export default App;
