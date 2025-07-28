import React, {forwardRef, useEffect, useRef} from "react";
import {useTexture} from "@react-three/drei";

const Sun = forwardRef(({refCallback, shadows}, ref) => {
    const texture = useTexture('/textures/sun.jpg');
    const localRef = useRef();
    const finalRef = ref || localRef;

    useEffect(() => {
        if (refCallback && finalRef.current)
            refCallback(finalRef.current);
    }, [refCallback, finalRef]);

    return (
        <mesh
            name={"Солнце"}
            ref={finalRef}
            castShadow={!shadows}
            receiveShadow={shadows}
        >
            <sphereGeometry args={[2, 32, 32]}/>
            <meshStandardMaterial
                map={texture}
                emissive="yellow"
                emissiveMap={texture}
                emissiveIntensity={5}
                roughness={0.2}
                metalness={0.5}
            />
        </mesh>
    );
});

export default Sun;