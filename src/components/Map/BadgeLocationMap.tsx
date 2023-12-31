'use client';

import { useEffect, useRef, useMemo, memo } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Box, NoSsr, Stack } from '@mui/material';

type Props = {
  height: string;
  width: string;
  lat: number;
  lng: number;
  roundedBorder?: boolean;
};

export const BadgeLocationMap = memo(function BadgeLocationMap({
  height,
  width,
  lat,
  lng,
  roundedBorder,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function initMap() {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: 'weekly',
      });
      const { Marker } = (await loader.importLibrary(
        'marker'
      )) as google.maps.MarkerLibrary;
      const { Map } = await loader.importLibrary('maps');

      const position = { lat, lng };
      const mapOptions: google.maps.MapOptions = {
        center: position,
        zoom: 17,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID!, // need to use CB account before launch
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        rotateControl: false,
      };
      const map = new Map(mapRef.current as HTMLDivElement, mapOptions);

      const marker = new Marker({
        position,
        map,
      });
    }
    initMap();
  }, [lat, lng]);

  return (
    <NoSsr>
      <Stack
        sx={{
          height: height,
          width: width,
          borderRadius: roundedBorder ? '16px' : undefined,
        }}
        ref={mapRef}
      ></Stack>
    </NoSsr>
  );
});
