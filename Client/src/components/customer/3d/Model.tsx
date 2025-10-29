import React, { useLayoutEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
  isOpen: boolean;
  modelUrl?: string;
  autoRotate: boolean;
}

// 3D Model Component
const Model: React.FC<ModelProps> = ({ isOpen, modelUrl, autoRotate }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(
    modelUrl || 'https://res.cloudinary.com/dwbibirzk/raw/upload/v1760026964/Pre-thesis/Product/3DModel/olanmpyo1owc1hp3gbdx.glb', true
  );
  const { gl } = useThree();

  useLayoutEffect(() => {
    if (!scene || !groupRef.current) return;

    while (groupRef.current.children.length > 0) {
      groupRef.current.remove(groupRef.current.children[0]);
    }

    const clonedScene = scene.clone(true);

    clonedScene.traverse((child) => {
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

    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());
    const scaleFactor = 5 / Math.max(size.x, size.y, size.z);
    clonedScene.scale.setScalar(scaleFactor * 1.0);

    box.setFromObject(clonedScene);
    const scaledCenter = box.getCenter(new THREE.Vector3());
    const scaledSize = box.getSize(new THREE.Vector3());

    clonedScene.position.set(-scaledCenter.x, -scaledCenter.y + scaledSize.y / 3, -scaledCenter.z);

    groupRef.current.add(clonedScene);

    return () => {
      if (groupRef.current) {
        while (groupRef.current.children.length > 0) {
          const child = groupRef.current.children[0];
          groupRef.current.remove(child);
          if (child instanceof THREE.Mesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) child.material.forEach((m: any) => m.dispose());
              else child.material.dispose();
            }
          }
        }
      }
      gl.renderLists.dispose();
    };
  }, [scene, gl, modelUrl]);

  useFrame(() => {
    if (!autoRotate || !isOpen) return;
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return <group ref={groupRef} />;
};

export default Model;