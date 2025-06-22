// // 'use client';
// // import { Canvas, useLoader } from '@react-three/fiber'
// // import { TextureLoader } from 'three'
// // import { useRef } from 'react';
// // import { useScroll } from 'framer-motion';
// // import { motion } from 'framer-motion-3d';

// // export default function earth() {
// //     const scene = useRef(null);
// //     const { scrollYProgress } = useScroll({

// //         target: scene,
    
// //         offset: ['start end', 'end start']
    
// //     })
// //     const [color, normal, aoMap] = useLoader(TextureLoader, [
// //         '/assets/color.webp',
// //         '/assets/normal.webp',
// //         '/assets/occlusion.webp'
// //     ])

// //     return (
// // <div className='md:h-[900px] h-[400px] '>


      
// // <Canvas  ref={scene}>
    
// //             <ambientLight intensity={0.1} />
// //             <directionalLight intensity={9.5} position={[1, 0, -.25]} />
// //             <motion.mesh scale={2.5} rotation-y={scrollYProgress}>
// //                 <sphereGeometry args={[1, 64, 64]}/>
// //                 <meshStandardMaterial map={color} normalMap={normal} aoMap={aoMap}/>
// //             </motion.mesh>
// //         </Canvas>
// //         </div>
        
// //     )
// // }

// 'use client'
// import { Canvas, useLoader, useFrame } from '@react-three/fiber'
// import { TextureLoader } from 'three'
// import { useRef, Suspense } from 'react'
// import { useScroll } from 'framer-motion'
// import { motion } from 'framer-motion-3d'
// import { OrbitControls } from '@react-three/drei'
// import * as THREE from 'three'
// import { FaBtc } from "react-icons/fa6";

// interface OrbitingImageProps {
//   imagePath: string
//   radius: number
//   speed: number
//   offset: number
//   size?: number
// }

// function OrbitingImage({ imagePath, radius, speed, offset, size = 0.5 }: OrbitingImageProps) {
//   const meshRef = useRef<THREE.Mesh>(null)
  
//   // Load the actual image texture
//   const texture = useLoader(TextureLoader, imagePath)
  
//   useFrame((state, delta) => {
//     if (meshRef.current) {
//       const time = state.clock.getElapsedTime() * speed + offset
//       meshRef.current.position.x = Math.cos(time) * radius
//       meshRef.current.position.y = Math.sin(time * 0.3) * 0.8
//       meshRef.current.position.z = Math.sin(time) * radius
      
//       // Add slight rotation for visual interest
//       meshRef.current.rotation.z = time * 0.2
      
//       // Make it face the camera
//       meshRef.current.lookAt(state.camera.position)
//     }
//   })

//   return (
//     <mesh ref={meshRef}>
//       <planeGeometry args={[size, size]} />
//       <meshBasicMaterial 
//         map={texture}
//         transparent={true}
//         alphaTest={0.1}
//         side={THREE.DoubleSide}
//       />
//     </mesh>
//   )
// }

// function FallbackImage({ radius, speed, offset, size = 0.5, color }: OrbitingImageProps & { color: string }) {
//   const meshRef = useRef<THREE.Mesh>(null)
  
//   useFrame((state, delta) => {
//     if (meshRef.current) {
//       const time = state.clock.getElapsedTime() * speed + offset
//       meshRef.current.position.x = Math.cos(time) * radius
//       meshRef.current.position.y = Math.sin(time * 0.3) * 0.8
//       meshRef.current.position.z = Math.sin(time) * radius
      
//       // Make image always face the camera
//       meshRef.current.lookAt(state.camera.position)
//     }
//   })

//   return (
//     <mesh ref={meshRef}>
//       <planeGeometry args={[size, size]} />
//       <meshBasicMaterial 
//         color={color}
//         transparent={true}
//         opacity={0.8}
//         side={THREE.DoubleSide}
//       />
//     </mesh>
//   )
// }

// function MultipleImages() {
//   const images: OrbitingImageProps[] = [
//     { imagePath: "/assets/eth2.png", radius: 2.8, speed: 0.5, offset: 0, size: 0.6 },
//     { imagePath: "/assets/btc.png", radius: 3.2, speed: -0.4, offset: Math.PI / 2, size: 0.5 },
//     { imagePath: "/assets/dollar.png", radius: 3.6, speed: 0.3, offset: Math.PI, size: 0.7 },
//     // { imagePath: "/assets/eth.png", radius: 2.4, speed: -0.6, offset: Math.PI * 1.5, size: 0.55 }
//   ]

//   return (
//     <>
//       {images.map((item, index) => (
//         <Suspense 
//           key={index}
//           fallback={
//             <mesh>
//               <planeGeometry args={[item.size || 0.5, item.size || 0.5]} />
//               <meshBasicMaterial color="#666666" transparent opacity={0.5} />
//             </mesh>
//           }
//         >
//           <OrbitingImage
//             imagePath={item.imagePath}
//             radius={item.radius}
//             speed={item.speed}
//             offset={item.offset}
//             size={item.size}
//           />
//         </Suspense>
//       ))}
//     </>
//   )
// }

// function EarthMesh() {
//   const meshRef = useRef<THREE.Mesh>(null)
//   const { scrollYProgress } = useScroll({
//     target: useRef(document.documentElement),
//     offset: ['start start', 'end end']
//   })

//   // Load Earth textures
//   const [colorMap, normalMap, aoMap] = useLoader(TextureLoader, [
//     '/assets/color.webp',
//     '/assets/normal.webp',
//     '/assets/occlusion.webp'
//   ])

//   useFrame(() => {
//     if (meshRef.current) {
//       meshRef.current.rotation.y = scrollYProgress.get() * Math.PI * 2
//     }
//   })

//   return (
//     <motion.mesh 
//       ref={meshRef} 
//       scale={2.5}
//       position={[0, 0, 0]}
//     >
//       <sphereGeometry args={[1, 64, 64]} />
//       <meshStandardMaterial 
//         map={colorMap}
//         normalMap={normalMap}
//         aoMap={aoMap}
//         roughness={0.8}
//         metalness={0.1}
//       />
//     </motion.mesh>
//   )
// }

// // Fallback Earth component
// function FallbackEarth() {
//   const meshRef = useRef<THREE.Mesh>(null)
//   const { scrollYProgress } = useScroll({
//     target: useRef(document.documentElement),
//     offset: ['start start', 'end end']
//   })

//   useFrame(() => {
//     if (meshRef.current) {
//       meshRef.current.rotation.y = scrollYProgress.get() * Math.PI * 2
//     }
//   })

//   return (
//     <motion.mesh 
//       ref={meshRef} 
//       scale={2.5}
//       position={[0, 0, 0]}
//     >
//       <sphereGeometry args={[1, 64, 64]} />
//       <meshStandardMaterial 
//         color="#4A90E2"
//         roughness={0.8}
//         metalness={0.1}
//       />
//     </motion.mesh>
//   )
// }

// export default function Earth() {
//   return (
//     <div className='relative md:h-[900px] h-[400px] w-full'>
//       <Canvas 
//         camera={{ 
//           position: [0, 0, 8], 
//           fov: 50,
//           near: 0.1,
//           far: 1000 
//         }}
//         gl={{ antialias: true }}
//       >
//         <ambientLight intensity={0.2} />
//         <directionalLight 
//           intensity={9.5} 
//           position={[1, 0, -.25]} 
//           castShadow
//         />
        
//         <Suspense fallback={<FallbackEarth />}>
//           <EarthMesh />
//         </Suspense>

//         <MultipleImages />

//         <OrbitControls 
//           enableZoom={false}
//           enablePan={false}
//           enableRotate={false}
//         />
//       </Canvas>
//     </div>
//   )
// }


 'use client'
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { TextureLoader } from 'three'
import { useRef, Suspense, useState, useEffect } from 'react'
import { useScroll } from 'framer-motion'
import { motion } from 'framer-motion-3d'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface OrbitingImageProps {
  imagePath: string
  radius: number
  speed: number
  offset: number
  size?: number
}

function OrbitingImage({ imagePath, radius, speed, offset, size = 0.5 }: OrbitingImageProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const texture = useLoader(TextureLoader, imagePath)
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime() * speed + offset
      meshRef.current.position.x = Math.cos(time) * radius
      meshRef.current.position.y = Math.sin(time * 0.3) * 0.8
      meshRef.current.position.z = Math.sin(time) * radius
      meshRef.current.rotation.z = time * 0.2
      meshRef.current.lookAt(state.camera.position)
    }
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial 
        map={texture}
        transparent={true}
        alphaTest={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function EarthMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  const controlsRef = useRef<any>(null)
  const { scrollYProgress } = useScroll({
    target: useRef(document.documentElement),
    offset: ['start start', 'end end']
  })

  const [isInteracting, setIsInteracting] = useState(false)
  const [manualRotation, setManualRotation] = useState(0)
  
  const [colorMap, normalMap, aoMap] = useLoader(TextureLoader, [
    '/assets/color.webp',
    '/assets/normal.webp',
    '/assets/occlusion.webp'
  ])

  useFrame(() => {
    if (!meshRef.current) return
    
    // Only apply scroll rotation when not manually interacting
    if (!isInteracting) {
      const scrollRotation = scrollYProgress.get() * Math.PI * 2
      meshRef.current.rotation.y = scrollRotation + manualRotation
    }
    
    
    // Sync OrbitControls rotation with our mesh
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0)
      controlsRef.current.update()
    }
  })

  // Handle OrbitControls change
  const handleChange = () => {
    if (controlsRef.current && meshRef.current) {
      setIsInteracting(true)
      // Get the rotation from the controls and apply it to our mesh
      meshRef.current.rotation.y = controlsRef.current.getAzimuthalAngle()
      setManualRotation(controlsRef.current.getAzimuthalAngle())
    }
  }

  // Reset interaction state after a delay
  useEffect(() => {
    if (!isInteracting) return
    
    const timer = setTimeout(() => {
      setIsInteracting(false)
    }, 3000) // 3 seconds after last interaction
    
    return () => clearTimeout(timer)
  }, [isInteracting])

  return (
    <>
      <motion.mesh 
        ref={meshRef} 
        scale={2.5}
        position={[0, 0, 0]}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          map={colorMap}
          normalMap={normalMap}
          aoMap={aoMap}
          roughness={0.8}
          metalness={0.1}
        />
      </motion.mesh>
      
      <OrbitControls 
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        onChange={handleChange}
      />
    </>
  )
}

export default function Earth() {
  return (
    <div className='relative md:h-[900px] h-[400px] w-full'>
      <Canvas 
        camera={{ 
          position: [0, 0, 8], 
          fov: 50,
          near: 0.1,
          far: 1000 
        }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.2} />
        <directionalLight 
          intensity={9.5} 
          position={[1, 0, -.25]} 
          castShadow
        />
        
        <Suspense fallback={null}>
          <EarthMesh />
          <MultipleImages />
        </Suspense>
      </Canvas>
    </div>
  )
}

function MultipleImages() {
  const images: OrbitingImageProps[] = [
    { imagePath: "/assets/eth2.png", radius: 2.8, speed: 0.5, offset: 0, size: 0.6 },
    { imagePath: "/assets/btc.png", radius: 3.2, speed: -0.4, offset: Math.PI / 2, size: 0.5 },
    { imagePath: "/assets/dollar.png", radius: 3.6, speed: 0.3, offset: Math.PI, size: 0.7 },
  ]

  return (
    <>
      {images.map((item, index) => (
        <Suspense key={index} fallback={null}>
          <OrbitingImage {...item} />
        </Suspense>
      ))}
    </>
  )
}