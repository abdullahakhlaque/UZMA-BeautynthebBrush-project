import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Float, ContactShadows, Environment } from '@react-three/drei';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import soapHeroImg from '@/assets/soap-hero.jpg';
import soapStack from '@/assets/soap-stack.jpg';
import soapRustic from '@/assets/soap-rustic.jpg';

const SoapModel = ({ scrollProgress }: { scrollProgress: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useLoader(TextureLoader, soapHeroImg);

  useMemo(() => {
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      scrollProgress * Math.PI * 2.5,
      delta * 3
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      Math.sin(scrollProgress * Math.PI) * 0.4,
      delta * 3
    );
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      Math.sin(scrollProgress * Math.PI * 2) * 0.6,
      delta * 3
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      Math.sin(scrollProgress * Math.PI) * 0.3,
      delta * 3
    );
    const targetScale = 1 + Math.sin(scrollProgress * Math.PI) * 0.2;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, delta * 3)
    );
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.4, 1.0, 0.75]} />
          <meshStandardMaterial
            map={texture}
            color="#e88a9a"
            roughness={0.35}
            metalness={0.05}
            envMapIntensity={0.6}
          />
        </mesh>
        <mesh position={[0, 0.52, 0]}>
          <boxGeometry args={[2.2, 0.06, 0.65]} />
          <meshStandardMaterial
            color="#d4576a"
            roughness={0.4}
            metalness={0.02}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>
    </Float>
  );
};

const textBlocks = [
  { title: 'Pure Ingredients', desc: 'Crafted with 100% natural oils and botanical extracts for gentle, effective cleansing.' },
  { title: 'Handmade Care', desc: 'Each bar is carefully handcrafted in small batches with love and precision.' },
  { title: 'Luxury Skin Experience', desc: 'Gentle cleansing that leaves your skin soft, radiant, and beautifully nourished.' },
];

const SoapScrollSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setProgress(v);
  });

  return (
    <>
      {/* 3D Scroll Section - completely self-contained */}
      <section ref={containerRef} className="relative bg-gradient-to-b from-background to-cream" style={{ height: '200vh' }}>
        <div className="sticky top-0 h-screen flex flex-col lg:flex-row items-center justify-center overflow-hidden">
          {/* 3D Canvas */}
          <div className="w-full lg:w-1/2 h-[50vh] lg:h-[70vh]">
            <Canvas
              camera={{ position: [0, 0, 5], fov: 42 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true }}
            >
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
              <directionalLight position={[-3, 3, 2]} intensity={0.4} color="#f5e0d0" />
              <pointLight position={[0, -2, 3]} intensity={0.3} color="#ffeedd" />
              <SoapModel scrollProgress={progress} />
              <ContactShadows position={[0, -1.0, 0]} opacity={0.3} blur={2.5} scale={6} />
              <Environment preset="studio" environmentIntensity={0.3} />
            </Canvas>
          </div>

          {/* Text Content */}
          <div className="w-full lg:w-1/2 px-8 lg:px-16 py-8 lg:py-0">
            <p className="font-accent text-primary tracking-[0.2em] uppercase text-sm mb-4">
              Our Product Line
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-8">
              Artisan Luxury Soaps
            </h2>
            <div className="space-y-8">
              {textBlocks.map((block, i) => (
                <motion.div
                  key={block.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="border-l-2 border-primary/30 pl-6"
                >
                  <h3 className="font-heading text-lg font-semibold mb-1">{block.title}</h3>
                  <p className="font-body text-muted-foreground text-sm">{block.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product images - SEPARATE section, renders after scroll completes */}
      <section className="bg-cream py-20">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="rounded-2xl overflow-hidden luxury-shadow-card"
          >
            <img src={soapStack} alt="Handmade soap collection" className="w-full h-72 object-cover" loading="lazy" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="rounded-2xl overflow-hidden luxury-shadow-card"
          >
            <img src={soapRustic} alt="Artisan soaps" className="w-full h-72 object-cover" loading="lazy" />
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default SoapScrollSection;
