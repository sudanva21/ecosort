import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const leafShapes = [
  {
    path: 'M12 2c-1.5 2-3 4-3 7 0 3 1.5 5 3 7 1.5-2 3-4 3-7 0-3-1.5-5-3-7z M10 9c-1-1.5-1.5-3-1.5-4.5 0 0 0.5 1 1.5 2 1-1 1.5-2 1.5-2 0 1.5-0.5 3-1.5 4.5z',
    viewBox: '0 0 24 24'
  },
  {
    path: 'M20 8c-3 0-5 2-6 4-1-2-3-4-6-4-3 0-5 2-5 5s2 5 5 5c3 0 5-2 6-4 1 2 3 4 6 4 3 0 5-2 5-5s-2-5-5-5z',
    viewBox: '0 0 24 24'
  },
  {
    path: 'M12 2L8 8c-1 1.5-2 3-2 5 0 3 2 6 6 6s6-3 6-6c0-2-1-3.5-2-5l-4-6z M12 10c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2z',
    viewBox: '0 0 24 24'
  },
];

const FallingLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [key, setKey] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const leafCount = 20;
    const newLeaves = Array.from({ length: leafCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      size: 25 + Math.random() * 30,
      rotation: Math.random() * 360,
      rotateX: Math.random() * 180,
      rotateY: Math.random() * 180,
      opacity: 0.6 + Math.random() * 0.3,
      shape: leafShapes[Math.floor(Math.random() * leafShapes.length)],
      windStrength: 40 + Math.random() * 60,
      swayDuration: 2 + Math.random() * 2,
      tumbleDuration: 0.8 + Math.random() * 1.2,
      color: ['#2d5016', '#3d6e1f', '#4d7c26', '#5d8c35', '#1e4620', '#2a5a2d'][Math.floor(Math.random() * 6)]
    }));
    setLeaves(newLeaves);
    setKey(prev => prev + 1);
  }, [location.pathname]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {leaves.map((leaf) => (
        <motion.div
          key={`${key}-${leaf.id}`}
          initial={{
            top: -80,
            left: `${leaf.left}%`,
            opacity: 0,
            scale: 0.5
          }}
          animate={{
            top: '110vh',
            opacity: [0, leaf.opacity, leaf.opacity, leaf.opacity * 0.7, 0],
            scale: [0.5, 1, 0.95, 0.9, 0.7],
            x: [
              0,
              leaf.windStrength * 0.3,
              -leaf.windStrength * 0.2,
              leaf.windStrength * 0.4,
              -leaf.windStrength * 0.1,
              leaf.windStrength * 0.2,
              0
            ],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
            opacity: {
              times: [0, 0.15, 0.7, 0.9, 1],
              duration: leaf.duration
            },
            scale: {
              times: [0, 0.2, 0.5, 0.8, 1],
              duration: leaf.duration
            },
            x: {
              times: [0, 0.2, 0.35, 0.5, 0.65, 0.8, 1],
              duration: leaf.duration,
              ease: 'easeInOut'
            }
          }}
          className="absolute"
        >
          <motion.div
            animate={{
              rotateZ: [leaf.rotation, leaf.rotation + 180, leaf.rotation + 360],
              rotateX: [leaf.rotateX, leaf.rotateX + 90, leaf.rotateX + 180],
              rotateY: [leaf.rotateY, leaf.rotateY + 180, leaf.rotateY + 360],
            }}
            transition={{
              rotateZ: {
                duration: leaf.tumbleDuration,
                repeat: Infinity,
                ease: 'linear'
              },
              rotateX: {
                duration: leaf.tumbleDuration * 1.3,
                repeat: Infinity,
                ease: 'easeInOut'
              },
              rotateY: {
                duration: leaf.tumbleDuration * 0.8,
                repeat: Infinity,
                ease: 'easeInOut'
              }
            }}
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
          >
            <svg
              width={leaf.size}
              height={leaf.size}
              viewBox={leaf.shape.viewBox}
              style={{
                filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25)) drop-shadow(0 1px 2px rgba(0,0,0,0.15))',
              }}
            >
              <path
                d={leaf.shape.path}
                fill={leaf.color}
                stroke="rgba(0,0,0,0.2)"
                strokeWidth="0.5"
              />
              <path
                d={leaf.shape.path}
                fill="url(#leafGradient)"
                opacity="0.4"
              />
              <defs>
                <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.3)', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: 'rgba(255,255,255,0)', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: 'rgba(0,0,0,0.2)', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default FallingLeaves;
