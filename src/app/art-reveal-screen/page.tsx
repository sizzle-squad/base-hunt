'use client';
import * as THREE from 'three';
import { Box, Grid, Skeleton, Stack } from '@mui/material';
import { CountdownTimer } from '@/components/ArtRevealScreen/Countdown';
import { useTreasureBoxForRevealScreen } from '@/hooks/useTreasureBoxForRevealScreen';
import { useEffect, useState, useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import {
  Bloom,
  EffectComposer,
  ChromaticAberration,
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
} from '@react-three/drei';
import { useControls } from 'leva';

function Boxx(props: any) {
  // This reference will give us direct access to the mesh
  const meshRef = useRef();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  //useFrame((state, delta) => (meshRef.current.rotation.x += delta));
  // Return view, these are regular three.js elements expressed in JSX
  const config = {
    meshPhysicalMaterial: false,
    transmissionSampler: false,
    backside: false,
    samples: 10,
    resolution: 2048,
    transmission: 1,
    roughness: 0.3,
    thickness: 3.5,
    ior: 1.5,
    chromaticAberration: 0.06,
    anisotropy: 0.1,
    distortion: 0.02,
    distortionScale: 0.3,
    temporalDistortion: 0.5,
    clearcoat: 1,
    attenuationDistance: 0.5,
    attenuationColor: '#ffffff',
    color: '#c9ffa1',
    bg: '#839681',
  };
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[4, 4, 1]} />
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

function Model(props: any) {
  const {
    camera,
    size: { width, height },
  } = useThree();
  const r = useRef();
  const gltf = useGLTF('/models/frame/scene.gltf');
  const child = gltf.scene.getObjectByName('Sketchfab_model');
  const mesh = child?.getObjectByProperty('type', 'Mesh') as THREE.Mesh;
  const config = {
    meshPhysicalMaterial: false,
    transmissionSampler: false,
    backside: false,
    samples: 10,
    resolution: 2048,
    transmission: 1,
    roughness: 0.3,
    thickness: 3.5,
    ior: 1.5,
    chromaticAberration: 0.06,
    anisotropy: 0.1,
    distortion: 0.02,
    distortionScale: 0.3,
    temporalDistortion: 0.5,
    clearcoat: 1,
    attenuationDistance: 0.5,
    attenuationColor: '#ffffff',
    color: '#c9ffa1',
    bg: '#839681',
  };
  //console.log(mesh.geometry);
  //camera.zoom = width / (1.5 * 10);
  return (
    <primitive
      ref={r}
      object={mesh}
      //scale={0.05}
      position={[0, 0, 0]}
      rotation-x={Math.PI * 0.5}
      dispose={null}
    ></primitive>
    // <primitive object={gltf.scene} dispose={null} {...props} />
  );
}

useGLTF.preload('/models/frame/scene.gltf');

function TextData({ animatedHitpoints = 100000, totalHitpoints = 100000 }) {
  const { width, height } = useThree((state) => state.viewport);
  const config = useControls({
    meshPhysicalMaterial: false,
    transmissionSampler: false,
    backside: false,
    samples: { value: 10, min: 1, max: 32, step: 1 },
    resolution: { value: 2048, min: 256, max: 2048, step: 256 },
    transmission: { value: 1, min: 0, max: 1 },
    roughness: { value: 0.0, min: 0, max: 1, step: 0.01 },
    thickness: { value: 3.5, min: 0, max: 10, step: 0.01 },
    ior: { value: 1.5, min: 1, max: 5, step: 0.01 },
    chromaticAberration: { value: 0.06, min: 0, max: 1 },
    anisotropy: { value: 0.1, min: 0, max: 1, step: 0.01 },
    distortion: { value: 0.0, min: 0, max: 1, step: 0.01 },
    distortionScale: { value: 0.3, min: 0.01, max: 1, step: 0.01 },
    temporalDistortion: { value: 0.5, min: 0, max: 1, step: 0.01 },
    clearcoat: { value: 1, min: 0, max: 1 },
    attenuationDistance: { value: 0.5, min: 0, max: 10, step: 0.01 },
    attenuationColor: '#ffffff',
    color: '#c9ffa1',
    bg: '#839681',
  });
  return (
    <group>
      <Center top>
        <Text3D font={'/fonts/Coinbase_Sans_Bold.json'} size={2}>
          {animatedHitpoints}
          <MeshTransmissionMaterial
            background={new THREE.Color(config.bg)}
            {...config}
          />
        </Text3D>
      </Center>
      <Center bottom>
        <Text3D font={'/fonts/Coinbase_Sans_Bold.json'} size={2}>
          /{totalHitpoints}
          <MeshTransmissionMaterial
            background={new THREE.Color(config.bg)}
            {...config}
          />
        </Text3D>
      </Center>
    </group>
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
    <Stack width="100%" margin="auto" background-color="black">
      <Stack>
        <CountdownTimer />
      </Stack>
      {/* <Stack flexDirection="row" justifyContent="center">
        <Stack
          width="100%"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          <>
            <Text useMonoFont fontSize="180px">
              {Math.round(animatedHitpoints) || 0}
            </Text>
            <Text fontSize="180px">/</Text>
            <Text useMonoFont fontSize="180px">
              {(data && data?.totalHitpoints) || 0}
            </Text>
          </>
        </Stack>
      </Stack> */}
      <Stack height="80vh">
        <Canvas>
          <ambientLight />
          <pointLight position={[1, 1, 1]} />
          <Boxx position={[0, 0, -2]} />
          if(data && data?.totalHitpoints)
          {
            <TextData
              animatedHitpoints={
                Math.round(animatedHitpoints) || data?.totalHitpoints
              }
              totalHitpoints={data?.totalHitpoints}
            />
          }
          <Suspense fallback={null}>
            <Model />
          </Suspense>
          <OrbitControls />
          <OrthographicCamera
            makeDefault
            zoom={100}
            near={1}
            far={20}
            position={[0, 0, 10]}
          />
          <EffectComposer>
            {/* <ChromaticAberration
              // @ts-expect-error: Let's ignore a compile error
              offset={[0.005, 0.002]} // color offset
        />*/}

            <Bloom
              luminanceThreshold={0.1}
              luminanceSmoothing={0.9}
              intensity={0.8}
            />
          </EffectComposer>
        </Canvas>
      </Stack>
    </Stack>
  );
}
