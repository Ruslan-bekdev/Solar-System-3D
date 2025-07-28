import React, {useRef, useMemo} from 'react';
import {useFrame} from '@react-three/fiber';

const StarField = () => {
  const starFieldRef = useRef();
  const starCount = 10000;
  
  const positions = useMemo(() => {
    const positionsArray = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      positionsArray[i * 3] = (Math.random() - 0.5) * 1000;
      positionsArray[i * 3 + 1] = (Math.random() - 0.5) * 1000;
      positionsArray[i * 3 + 2] = (Math.random() - 0.5) * 1000;
    }
    return positionsArray;
  }, [starCount]);

  useFrame(() => {
    if (starFieldRef.current){
      starFieldRef.current.rotation.x += 0.001;
      starFieldRef.current.rotation.y += 0.001;
    }
  });

  return (
    <points ref={starFieldRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        color={0xffffff}
        size={0.1}
        transparent={true}
        opacity={0.7}
      />
    </points>
  );
};

export default StarField;
