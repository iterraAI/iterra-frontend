import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface MousePosition {
  x: number;
  y: number;
}

export const JellyfishBlobs = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [blobs] = useState(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      size: Math.random() * 150 + 100,
      delay: Math.random() * 2,
      speed: Math.random() * 0.3 + 0.1,
    }))
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {blobs.map((blob) => {
        const offsetX = (mousePosition.x - blob.initialX) * blob.speed;
        const offsetY = (mousePosition.y - blob.initialY) * blob.speed;

        return (
          <motion.div
            key={blob.id}
            className="absolute pointer-events-none"
            style={{
              left: `${blob.initialX}%`,
              top: `${blob.initialY}%`,
              width: blob.size,
              height: blob.size,
            }}
            animate={{
              x: offsetX,
              y: offsetY,
            }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 50,
              mass: 1,
            }}
          >
            {/* Main blob */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle at 30% 30%, 
                  rgba(16, 185, 129, ${0.15 + blob.id * 0.02}), 
                  rgba(59, 130, 246, ${0.1 + blob.id * 0.015}), 
                  transparent 70%)`,
                filter: 'blur(40px)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 15 + blob.delay * 5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: blob.delay,
              }}
            />

            {/* Trailing effect - jellyfish tentacles */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  width: `${80 - i * 20}%`,
                  height: `${80 - i * 20}%`,
                  transform: 'translate(-50%, -50%)',
                  background: `radial-gradient(circle, 
                    rgba(16, 185, 129, ${0.08 - i * 0.02}), 
                    transparent 60%)`,
                  filter: 'blur(30px)',
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: blob.delay + i * 0.5,
                }}
              />
            ))}
          </motion.div>
        );
      })}
    </>
  );
};
