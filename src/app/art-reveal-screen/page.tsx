'use client';
import * as THREE from 'three';
import { Box, Grid, Skeleton, Stack } from '@mui/material';
import { CountdownTimer } from '@/components/ArtRevealScreen/Countdown';
import { useTreasureBoxForRevealScreen } from '@/hooks/useTreasureBoxForRevealScreen';
import { useEffect, useState, useRef, Suspense } from 'react';
import {
  Canvas,
  useFrame,
  useLoader,
  useThree,
  extend,
  ReactThreeFiber,
} from '@react-three/fiber';
import {
  Bloom,
  EffectComposer,
  Scanline,
  ChromaticAberration,
  Glitch,
} from '@react-three/postprocessing';
import {
  Text3D,
  Text,
  OrbitControls,
  useGLTF,
  Stats,
  MeshTransmissionMaterial,
  OrthographicCamera,
  Center,
  Float,
  Effects,
} from '@react-three/drei';
import { useControls } from 'leva';
import { BlendFunction } from 'postprocessing';
import axios from 'axios';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
extend({ GlitchPass, UnrealBloomPass });
declare global {
  namespace JSX {
    interface IntrinsicElements {
      unrealBloomPass: ReactThreeFiber.Node<
        UnrealBloomPass,
        typeof UnrealBloomPass
      >;
      glitchPass: ReactThreeFiber.Node<GlitchPass, typeof GlitchPass>;
    }
  }
}
function Boxx(props: any) {
  // This reference will give us direct access to the mesh
  const meshRef = useRef();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  //useFrame((state, delta) => (meshRef.current.rotation.x += delta));
  // Return view, these are regular three.js elements expressed in JSX
  const config = useControls({
    meshPhysicalMaterial: false,
    transmissionSampler: false,
    backside: false,
    samples: { value: 10, min: 1, max: 32, step: 1 },
    resolution: { value: 2048, min: 256, max: 2048, step: 256 },
    transmission: { value: 1, min: 0, max: 1 },
    roughness: { value: 0.07, min: 0, max: 1, step: 0.01 },
    thickness: { value: 3.5, min: 0, max: 10, step: 0.01 },
    ior: { value: 1.5, min: 1, max: 5, step: 0.01 },
    chromaticAberration: { value: 0.16, min: 0, max: 1 },
    anisotropy: { value: 0.1, min: 0, max: 1, step: 0.01 },
    distortion: { value: 0.0, min: 0, max: 1, step: 0.01 },
    distortionScale: { value: 0.3, min: 0.01, max: 1, step: 0.01 },
    temporalDistortion: { value: 0.5, min: 0, max: 1, step: 0.01 },
    clearcoat: { value: 1, min: 0, max: 1 },
    attenuationDistance: { value: 0.5, min: 0, max: 10, step: 0.01 },
    attenuationColor: '#fff5f5',
    color: '#c4c4c4',
    bg: '#3a4124',
  });
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[20, 40, 4]} />
      <MeshTransmissionMaterial
        background={new THREE.Color(config.bg)}
        {...config}
      />
      {/* <meshStandardMaterial
        color="red"
        emissive="red"
        emissiveIntensity={1.2}
        toneMapped={false}
      /> */}
    </mesh>
  );
}

function TextData({
  animatedHitpoints = 100000,
  totalHitpoints = 100000,
  margin = 0.5,
}) {
  const { width, height } = useThree((state) => state.viewport);

  return (
    <Float floatIntensity={6} speed={0.9}>
      <group position-z={-6}>
        <Center
          bottom
          right
          position={[-width / 2 + margin, height / 2 - margin, 0]}
        >
          <Text3D
            lineHeight={0.75}
            font={'/fonts/Coinbase_Sans_Bold.json'}
            size={2}
          >
            {`5d 6h 4min 6sec`.split(' ').join('\n')}
            <meshStandardMaterial
              color={new THREE.Color('black')}
              // emissive={new THREE.Color('white')}
            />
          </Text3D>
        </Center>
        <Center bottom position={[-margin, -height / 2 + margin + 1, 0]}>
          <Text3D font={'/fonts/Coinbase_Sans_Bold.json'} size={0.9}>
            {animatedHitpoints}/{totalHitpoints}
            {/* <MeshTransmissionMaterial
            background={new THREE.Color(config.bg)}
            {...config}
          /> */}
            <meshStandardMaterial
              color={new THREE.Color('black')}
              // emissive={new THREE.Color('white')}
            />
          </Text3D>
        </Center>
      </group>
    </Float>
  );
}
export default function ArtRevealScreen() {
  const gameId = process.env.NEXT_PUBLIC_GAME_ID ?? '0';

  const { data } = useTreasureBoxForRevealScreen({
    gameId,
  });

  const lerp = (start: number, end: number, alpha: number) =>
    start + (end - start) * alpha;

  const [animatedHitpoints, setAnimatedHitpoints] = useState<number>(0);

  useEffect(() => {
    if (data?.currentHitpoints != null) {
      const animate = () => {
        setAnimatedHitpoints((prev: number) => {
          const distance = data.currentHitpoints - prev;
          const alpha = Math.max(
            0.02,
            0.1 * (Number(distance) / data.currentHitpoints)
          );
          const newValue = lerp(prev, data.currentHitpoints, alpha);

          if (Math.abs(newValue - data.currentHitpoints) < 0.5) {
            return data.currentHitpoints;
          }

          requestAnimationFrame(animate);
          return newValue;
        });
      };
      animate();
    }
  }, [data?.currentHitpoints]);

  return (
    <Stack width="100%" margin="auto">
      <Stack height="100vh">
        <Canvas>
          <Effects>
            <glitchPass
              // @ts-ignore
              attachArray="passes"
            />
            <unrealBloomPass
              // @ts-ignore
              attachArray="passes"
            />
          </Effects>
          <ambientLight />
          <pointLight position={[1, 1, 1]} />
          <Boxx position={[0, 0, -4]} />
          if(data?.currentHitpoints != null && data.totalHitpoints != null)
          {
            <TextData
              animatedHitpoints={Math.round(animatedHitpoints)}
              totalHitpoints={data?.totalHitpoints}
            />
          }
          {/* <Suspense fallback={null}>
            <Model />
          </Suspense> */}
          <OrbitControls />
          <OrthographicCamera
            makeDefault
            zoom={100}
            near={1}
            far={20}
            position={[0, 0, 10]}
          />
          {/* <Effects>
              <Glitch />
              <ChromaticAberration
                // @ts-expect-error: Let's ignore a compile error
                offset={[0.005, 0.002]} // color offset
              />

              <Bloom
                luminanceThreshold={0.1}
                luminanceSmoothing={0.9}
                intensity={0.8}
              />
            </Effects> */}
        </Canvas>
      </Stack>
    </Stack>
  );
}
