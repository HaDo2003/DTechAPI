import React, { useLayoutEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
  isOpen: boolean;
  modelUrl?: string;
  autoRotate: boolean;
  productColor: string;
}

// 3D Model Component
const Model: React.FC<ModelProps> = ({ isOpen, modelUrl, autoRotate, productColor }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(
    modelUrl || 'https://res.cloudinary.com/dwbibirzk/raw/upload/v1760026964/Pre-thesis/Product/3DModel/olanmpyo1owc1hp3gbdx.glb', true
  );
  const { gl } = useThree();

  useLayoutEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.frustumCulled = false;

        if (child.material) {
          const mat = Array.isArray(child.material) ? child.material : [child.material];
          mat.forEach((m) => {
            if (m.transparent || m.alphaTest > 0 || m.name.toLowerCase().includes("text")) {
              m.depthWrite = false;
              m.depthTest = false;
              m.needsUpdate = true;
            }
          });
        }
      }
    });

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const scaleFactor = 5 / Math.max(size.x, size.y, size.z);
    scene.scale.setScalar(scaleFactor);

    box.setFromObject(scene);
    const scaledCenter = box.getCenter(new THREE.Vector3());
    const scaledSize = box.getSize(new THREE.Vector3());

    scene.position.set(-scaledCenter.x, -scaledCenter.y + scaledSize.y / 3, -scaledCenter.z);

    console.groupEnd();

    return () => {
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach((m: any) => m.dispose());
            else obj.material.dispose();
          }
        }
      });
      gl.renderLists.dispose();
    };
  }, [scene, gl]);

  useFrame(() => {
    if (!autoRotate || !isOpen) return;
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  // useEffect(() => {
  //   scene.traverse((child: any) => {
  //     if (child.isMesh && child.material) {
  //       child.material = child.material.clone();
  //       child.material.color.set(productColor);
  //     }
  //   });
  // }, [productColor, scene]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={1.5} />
    </group>
  );
};

export default Model;