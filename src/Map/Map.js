import React from "react";
import {
	Marker,
	GoogleMap,
	InfoWindow,
	withScriptjs,
	withGoogleMap,
	 DirectionsRenderer,
} from "react-google-maps";
import InfoWindowContent from "./InfoWindow";
import { MAP_SETTINGS } from "../constants";
import heartIcon from "../images/heart.png";
import locationIconActive from "../images/location-active.png";
import locationIconInactive from "../images/location-inactive.png";
import mapStyles from "./mapStyles.json";
import OutsideClickHandler from "react-outside-click-handler";

const {
	MARKER_SIZE,
	DEFAULT_ZOOM,
	DEFAULT_CENTER,
	DEFAULT_MAP_OPTIONS,
	PIXEL_OFFSET,
	 DIRECTIONS_OPTIONS,
} = MAP_SETTINGS;
const DIRECTION_REQUEST_DELAY = 300;
const delay = (time) =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, time);
	});

const directionsRequest = ({ DirectionsService, origin, destination }) =>
	new Promise((resolve, reject) => {
		DirectionsService.route(
			{
				origin: new window.google.maps.LatLng(origin.lat, origin.lon),
				destination: new window.google.maps.LatLng(
					destination.lat,
					destination.lon,
				),
				travelMode: window.google.maps.TravelMode.DRIVING,
			},
			(result, status) => {
				if (status === window.google.maps.DirectionsStatus.OK) {
					resolve(result);
				} else {
					reject(status);
				}
			},
		);
	});

const MapContainer = ({ origins, destinations, hoveredOriginId }) => {
	const mapRef = React.useRef(null);
	const [selectedOriginId, setSelectedOriginId] = React.useState(null);
    const [directions, setDirections] = React.useState({});

	const selectedOrHoveredOriginId = hoveredOriginId || selectedOriginId;
	const selectedOrigin = origins.find(({ id }) => selectedOriginId === id);
	const [isClickOutsideDisabled, setIsClickOutsideDisabled] =
		React.useState(false);
	React.useEffect(() => {
		const bounds = new window.google.maps.LatLngBounds();
		origins.forEach(({ coordinates: { lat, lon } }) => {
			bounds.extend(new window.google.maps.LatLng(lat, lon));
		});
		destinations.forEach(({ coordinates: { lat, lon } }) => {
			bounds.extend(new window.google.maps.LatLng(lat, lon));
		});
		mapRef.current.fitBounds(bounds);
	}, [destinations, origins]);
	React.useEffect(() => {
		if (hoveredOriginId) {
			setSelectedOriginId(null);
		}
	}, [hoveredOriginId]);
     const directionsToSelectedOrHoveredOrigin =
				directions[selectedOrHoveredOriginId];
			React.useEffect(() => {
				if (selectedOrHoveredOriginId && !directionsToSelectedOrHoveredOrigin) {
					const DirectionsService = new window.google.maps.DirectionsService();
					const fetchDirections = async () => {
						const selectedOrHoveredOrigin = origins.find(
							({ id }) => selectedOrHoveredOriginId === id,
						);
						const tempDirectionsToOrigin = [];
						for (const destination of destinations) {
							const direction = await directionsRequest({
								DirectionsService,
								origin: {
									lat: selectedOrHoveredOrigin.coordinates.lat,
									lon: selectedOrHoveredOrigin.coordinates.lon,
								},
								destination: {
									lat: destination.coordinates.lat,
									lon: destination.coordinates.lon,
								},
							});
							await delay(DIRECTION_REQUEST_DELAY);
							tempDirectionsToOrigin.push(direction);
						}
						setDirections((prevState) => ({
							...prevState,
							[selectedOrHoveredOriginId]: tempDirectionsToOrigin,
						}));
					};
					fetchDirections();
				}
			}, [
				destinations,
				directionsToSelectedOrHoveredOrigin,
				selectedOrHoveredOriginId,
				origins,
			]);
	return (
		<GoogleMap
			ref={mapRef}
			defaultZoom={DEFAULT_ZOOM}
			defaultCenter={DEFAULT_CENTER}
			defaultOptions={{ ...DEFAULT_MAP_OPTIONS, styles: mapStyles }}
			onDragStart={() => setIsClickOutsideDisabled(true)}
			onDragEnd={() => setIsClickOutsideDisabled(false)}>
			{origins.map(({ coordinates: { lat, lon: lng }, id }) => (
				<Marker
					key={id}
					position={{ lat, lng }}
					icon={{
						url:
							id === selectedOrHoveredOriginId
								? locationIconActive
								: locationIconInactive,
						scaledSize: new window.google.maps.Size(MARKER_SIZE, MARKER_SIZE),
					}}
					onClick={() => {
						setSelectedOriginId(id);
					}}
				/>
			))}
			{destinations.map(({ coordinates: { lat, lon: lng }, id }) => (
				<Marker
					key={id}
					position={{ lat, lng }}
					icon={{
						url: heartIcon,
						scaledSize: new window.google.maps.Size(MARKER_SIZE, MARKER_SIZE),
					}}
				/>
			))}
			{selectedOrigin && (
				<InfoWindow
					position={{
						lat: selectedOrigin.coordinates.lat,
						lng: selectedOrigin.coordinates.lon,
					}}
					options={{
						pixelOffset: new window.google.maps.Size(
							PIXEL_OFFSET.MARKER.X,
							PIXEL_OFFSET.MARKER.Y,
						),
					}}>
					<OutsideClickHandler
						onOutsideClick={() => {
							setSelectedOriginId(null);
						}}
						disabled={isClickOutsideDisabled}>
						<InfoWindowContent {...selectedOrigin} />
					</OutsideClickHandler>
				</InfoWindow>
			)}
			{directionsToSelectedOrHoveredOrigin &&
				directionsToSelectedOrHoveredOrigin.map((direction, i) => (
					<DirectionsRenderer
						key={i}
						directions={direction}
						options={DIRECTIONS_OPTIONS}
					/>
				))}
		</GoogleMap>
	);
};
export default withScriptjs(withGoogleMap(MapContainer));
