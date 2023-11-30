'use client';

import Layout from '@/components/layout';
import { BadgeLocationMap } from '@/components/Map/BadgeLocationMap';

const miamiConventionCenter = {
  lat: 25.79487,
  lng: -80.134697,
};

export default function Map() {
  return (
    <Layout noPadding>
      <BadgeLocationMap
        height="90vh"
        width="100%"
        lat={miamiConventionCenter.lat}
        lng={miamiConventionCenter.lng}
      />
    </Layout>
  );
}
