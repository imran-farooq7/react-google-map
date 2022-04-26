import React from "react";
import styled from "styled-components";
import { rem } from "polished";
import { Text } from "../components/Typography";
import { Box } from "../components/Layout";
import { useDebouncedCallback } from "use-debounce";

import { COLOR, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACE } from "../Theme";

const LocationImage = styled("div")`
	height: ${rem(200)};
	border-radius: ${RADIUS.L};
	${({ src }) => `
     background: url("${src}") center / cover no-repeat;
  `}
`;
export const TextWrapper = styled("div")`
	border-top-right-radius: ${RADIUS.L};
	background-color: ${COLOR.WHITE};
	padding: ${SPACE.S};
`;
const DURATION = 400;
const Card = ({ title, src, onHover, id }) => {
	const debounced = useDebouncedCallback((value) => {
		onHover(value);
	}, DURATION);

	return (
		<Box
			onMouseEnter={() => debounced.callback(id)}
			onMouseLeave={() => debounced.callback(null)}
			position="relative"
			mb={SPACE.L}>
			<LocationImage src={src} />
			<Box position="absolute" bottom={0}>
				<TextWrapper>
					<Text
						as="p"
						fontSize={FONT_SIZE.L}
						fontWeight={FONT_WEIGHT.BOLD}
						color={COLOR.BLACK}>
						{title}
					</Text>
				</TextWrapper>
			</Box>
		</Box>
	);
};
export default Card;
