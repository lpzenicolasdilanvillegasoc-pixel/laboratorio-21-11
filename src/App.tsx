import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { BackSide, Shape, SRGBColorSpace, TextureLoader } from 'three'
import type { Mesh, Texture } from 'three'

const triangulo = new Shape()
triangulo.moveTo(0, 0.9)
triangulo.lineTo(-0.8, -0.6)
triangulo.lineTo(0.8, -0.6)
triangulo.closePath()

function Figuras() {
  const prisma = useRef<Mesh>(null)
  const cilindro = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (prisma.current) prisma.current.rotation.y += delta
    if (cilindro.current) cilindro.current.rotation.z += delta * 0.6
  })

  return (
    <>
      <mesh ref={prisma} position={[-1.25, 0, 0]}>
        <extrudeGeometry args={[triangulo, { depth: 0.4, bevelEnabled: false }]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh ref={cilindro} position={[1.25, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 1.5, 32]} />
        <meshStandardMaterial color="royalblue" />
      </mesh>
    </>
  )
}

function Fondo360() {
  const [imagen, setImagen] = useState<Texture | null>(null)

  useEffect(() => {
    let activo = true

    const textura = new TextureLoader().load(
      '/fondo.jpg',
      (foto) => {
        if (!activo) return
        foto.colorSpace = SRGBColorSpace
        setImagen(foto)
      },
      undefined,
      (error) => {
        if (activo) console.error('No se pudo cargar /360.jpg', error)
      },
    )

    return () => {
      activo = false
      textura.dispose()
    }
  }, [])

  if (!imagen) return null

  return (
    <mesh>
      <sphereGeometry args={[50, 32, 16]} />
      <meshBasicMaterial map={imagen} side={BackSide} toneMapped={false} />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 6] }} style={{ height: '100vh' }}>
      <color attach="background" args={['#ddd']} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 4, 5]} intensity={2} />

      <Figuras />
      <Fondo360 />
      <OrbitControls enablePan={false} maxDistance={20} />
    </Canvas>
  )
}