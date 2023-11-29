'use client';

import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Box } from '@mui/material';

const darkModeStyles: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];

const miamiConventionCenter = {
  lat: 25.79487,
  lng: -80.134697,
};

type Props = {
  address: string;
};

export default function Map({ address }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  //   const loader = useMemo(
  //     () =>
  //       new Loader({
  //         apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  //         version: 'weekly',
  //       }),
  //     []
  //   );

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: 'weekly',
      });
      const { Marker } = (await loader.importLibrary(
        'marker'
      )) as google.maps.MarkerLibrary;
      const { Map } = await loader.importLibrary('maps');

      const position = miamiConventionCenter;
      const mapOptions: google.maps.MapOptions = {
        center: position,
        zoom: 17,
        mapId: 'base-hunt-map',
        styles: darkModeStyles,
      };
      const map = new Map(mapRef.current as HTMLDivElement, mapOptions);

      const marker = new Marker({
        position,
        map,
        title: 'Hello World!',
      });
    };
    initMap();
  }, []);

  return <Box sx={{ height: '600px' }} ref={mapRef}></Box>;
}
