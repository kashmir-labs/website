import { RGBELoader } from 'three-stdlib'
import { memo } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Grid, Center, Text3D, Environment, Lightformer, RandomizedLight, AccumulativeShadows, MeshTransmissionMaterial } from '@react-three/drei'
import { easing } from 'maath'
import { useControls } from 'leva'
import { EffectComposer, HueSaturation, TiltShift2 } from '@react-three/postprocessing'

export function App() {
  const { stripes, environment, saturation, /*autoRotate,*/ shadow, ...config } = useControls({
    saturation: { value: -1, min: -1, max: 0 },
    environment: true,
    backside: true,
    backsideThickness: { value: 0.25, min: 0, max: 1, step: 0.01 },
    thickness: { value: 0.89, min: 0, max: 30, step: 0.01 },
    samples: { value: 10, min: 1, max: 32, step: 1 },
    transmission: { value: 0.5, min: 0, max: 1 },
    clearcoat: { value: 1, min: 0.1, max: 1 },
    clearcoatRoughness: { value: 0.5, min: 0, max: 1 },
    chromaticAberration: { value: 1, min: 0, max: 5 },
    anisotropy: { value: 0.15, min: 0, max: 1, step: 0.01 },
    roughness: { value: 0, min: 0, max: 1, step: 0.01 },
    distortion: { value: 2, min: 0, max: 4, step: 0.01 },
    distortionScale: { value: 0.2, min: 0.01, max: 1, step: 0.01 },
    temporalDistortion: { value: 0.04, min: 0, max: 1, step: 0.01 },
    ior: { value: 1.5, min: 0, max: 2, step: 0.01 },
    color: '#ff9cf5',
    stripes: '#444',
    shadow: 'black'
  })

  return (
    <Canvas
      shadows
      orthographic
      // frameloop={autoRotate ? 'always' : 'demand'}
      // TODO: Make the camera position responsive to the screen size.
      camera={{ position: [-10, 10, 10], zoom: 35, near: 0.1, far: 300 }}
      gl={{ antialias: false }}>
      <color attach="background" args={['#141420']} />
      <group position={[0, 1, 0]}>
        <Text lights environment={environment} config={config} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 2.25]}>
          Kashmir
        </Text>
        <Text height={0.15} environment={environment} config={config} rotation={[0, 0, 0]} position={[-1, -1, 8]}>
          Labs
        </Text>
        <Shadows shadow={shadow} />
        <Grid
          position={[0, -1, 0]}
          cellSize={2.25}
          cellThickness={1}
          cellColor="#3a3a3a"
          sectionSize={5.5}
          sectionThickness={1.5}
          sectionColor={stripes}
          fadeDistance={40}
          fadeStrength={1}
          infiniteGrid
        />
      </group>
      <Environment resolution={32}>
        <group rotation={[-Math.PI / 4, -0.3, 0]}>
          <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
          <Lightformer intensity={1} rotation-y={Math.PI / 2} position={[-10, 0, -1]} scale={[10, 2, 1]} />
          <Lightformer intensity={0.5} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 10, 1]} />
        </group>
      </Environment>
      <EffectComposer enableNormalPass={false} multisampling={4}>
        <HueSaturation hue={6} saturation={saturation} />
        <TiltShift2 blur={0.15} />
      </EffectComposer>
      <Rig />
    </Canvas>
  )
}

const Shadows = memo(({ shadow }: { shadow?: string }) => (
  <AccumulativeShadows frames={100} color={shadow} colorBlend={5} toneMapped={true} alphaTest={0.9} opacity={1.3} scale={30} position={[0, -1.01, 0]}>
    <RandomizedLight amount={4} radius={8} position={[0, 10, -10]} size={15} mapSize={256} />
  </AccumulativeShadows>
))

function Rig() {
  // TODO: On mobile, use the accelerometer to rotate the camera.
  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [-12.5 + state.pointer.x, 12.5 + state.pointer.y, 15 + Math.atan(state.pointer.x * 2)], 0.5, delta)
    state.camera.lookAt(2, -1, 0)
  })

  return null
}

function Text({
  height = 0.3,
  lights,
  children,
  environment,
  config,
  ...props
}: {
  height?: number
  lights?: boolean
  children: string
  environment?: boolean
  config: Record<string, unknown>
  font?: string
  rotation?: [number, number, number]
  position?: [number, number, number]
}) {
  const texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/fireplace_1k.hdr')

  return (
    <>
      <group>
        <Center scale={1} front top {...props}>
          <Text3D
            castShadow
            bevelEnabled
            font="helvetiker_bold.typeface.json"
            scale={5}
            letterSpacing={-0.03}
            height={height}
            bevelSize={0.01}
            bevelSegments={3}
            curveSegments={64}
            bevelThickness={0.01}>
            {children}
            {lights ? (
              <MeshTransmissionMaterial {...config} backside={Boolean(lights && config.backside)} background={lights && environment ? texture : undefined} />
            ) : (
              <meshPhysicalMaterial {...config} transmission={0} color="#999" />
            )}
          </Text3D>
        </Center>
        {lights && (
          <group {...props}>
            <Center position={[0.1, 0.2, 0.75]} scale={[0.925, 0.875, 1]} front top>
              <Text3D
                bevelEnabled={true}
                font="helvetiker_regular.typeface.json"
                scale={5}
                letterSpacing={0.1}
                height={0.01}
                bevelSize={0.01}
                bevelSegments={1}
                curveSegments={10}
                bevelThickness={0.01}>
                {children}
                <meshBasicMaterial />
              </Text3D>
            </Center>
          </group>
        )}
      </group>
    </>
  )
}
