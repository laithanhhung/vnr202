import { Environment, Float, OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import { useAtom } from "jotai";
import { Book } from "./Book";
import { fixedPoseAtom } from "./UI";

export const Experience = () => {
  const [fixedPose] = useAtom(fixedPoseAtom);

  const controlsRef = useRef();
  const bookGroupRef = useRef();
  const { camera } = useThree();

  const smoothOffsetX = useRef(0);

  // Khi tắt Cố định: reset camera về vị trí gốc của animated-book
  useEffect(() => {
    if (!fixedPose) {
      const isMobile = window.innerWidth <= 768;
      camera.position.set(-0.5, 1, isMobile ? 9 : 4);
      camera.fov = 45;
      camera.updateProjectionMatrix();
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
      smoothOffsetX.current = 0;
    }
  }, [fixedPose]);

  useFrame((_, delta) => {
    // Chỉ can thiệp camera khi đang ở chế độ Cố định
    if (!fixedPose) return;

    const isMobile = window.innerWidth <= 768;

    // Snap camera về vị trí nhìn thẳng
    const pos = new Vector3(0, 2.0, 4.2);
    const target = new Vector3(0, 1.0, 0);
    camera.position.copy(pos);

    if (controlsRef.current) {
      controlsRef.current.target.set(0, 1.0, 0);
      controlsRef.current.update();
    }

    // Reset rotation sách về thẳng đứng
    if (bookGroupRef.current) {
      bookGroupRef.current.position.set(0, 0, 0);
      bookGroupRef.current.rotation.set(0, 0, 0);
      bookGroupRef.current.updateMatrixWorld();
    }

    const targetFov = isMobile ? 45 : 38;
    camera.fov = targetFov;
    camera.updateProjectionMatrix();
  });

  return (
    <>
      <group ref={bookGroupRef}>
        <Float
          key={fixedPose ? "fixed" : "anim"}
          rotation-x={fixedPose ? 0 : -Math.PI / 4}
          floatIntensity={fixedPose ? 0 : 1}
          speed={fixedPose ? 0 : 2}
          rotationIntensity={fixedPose ? 0 : 2}
          position={fixedPose ? [0, 1.2, 0] : [0, 0, 0]}
        >
          <Book />
        </Float>
      </group>

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.08}
        enableRotate={!fixedPose}
        enableZoom={!fixedPose}
        enablePan
      />

      <Environment preset="studio" />
      <directionalLight
        position={[2, 5, 2]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      <mesh position-y={-1.5} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
    </>
  );
};
