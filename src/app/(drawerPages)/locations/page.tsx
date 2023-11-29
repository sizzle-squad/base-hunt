'use client';

import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Box, NoSsr, Stack } from '@mui/material';
import Layout from '@/components/layout';

const miamiConventionCenter = {
  lat: 25.79487,
  lng: -80.134697,
};

export default function Map() {
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

      const position = miamiConventionCenter;
      const mapOptions: google.maps.MapOptions = {
        center: position,
        zoom: 17,
        mapId: 'cba24c3765b42df8', // need to use CB account before launch
      };
      const map = new Map(mapRef.current as HTMLDivElement, mapOptions);

      const marker = new Marker({
        position,
        map,
      });
    }
    initMap();
  }, []);

  return (
    <Layout noPadding>
      <NoSsr>
        <Stack sx={{ height: '90vh', width: '100%' }} ref={mapRef}></Stack>
      </NoSsr>
    </Layout>
  );
}
