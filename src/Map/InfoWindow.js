import react from "react";
import styled from "styled-components/macro";
import { rem } from "polished";
import { text } from "../components/Typography";
import { Box } from "../components/Layout";
import { COLOR, FONT_SIZE, FONT_WEIGHT } from "../Theme";
const MAX_WIDTH = rem(240);
const LocationImage = styled("img")`
	object-fit: cover;
	width: 100%;
	height: ${rem(200)};
`;
const InfoWindow = ({ title, src }) => {
	return (
		<Box maxWidth={MAX_WIDTH}>
			<LocationImage src={src} />
			<Box position="absolute" bottom={0}></Box>
		</Box>
	);
};
export default InfoWindow;
