import React from "react";
import {
	Marker,
	GoogleMap,
	InfoWindow,
	withScriptjs,
	withGoogleMap,
	// DirectionsRenderer,
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
	// DIRECTIONS_OPTIONS,
} = MAP_SETTINGS;
const MapContainer = ({ origins, destinations, hoveredOriginId }) => {
	const mapRef = React.useRef(null);
	const [selectedOriginId, setSelectedOriginId] = React.useState(null);
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
		</GoogleMap>
	);
};
export default withScriptjs(withGoogleMap(MapContainer));
