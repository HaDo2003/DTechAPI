import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Html } from '@react-three/drei';
import Model from '../3d/model';

interface ThreeDModelViewerProps {
  isOpen: boolean;
  onClose: () => void;
  modelUrl?: string;
}

// Loading Fallback Component
const CanvasLoader = () => {
  return (
    <Html center>
      <div className="text-center">
        <div className="threed-spinner spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-light mt-2">Loading Model...</p>
      </div>
    </Html>
  );
};

// Main 3D Viewer Component
const ThreeDModelViewer: React.FC<ThreeDModelViewerProps> = ({ isOpen, onClose, modelUrl }) => {
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [controlsEnabled, setControlsEnabled] = useState<boolean>(true);
  const [, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const t = setTimeout(() => setIsVisible(false), 400);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Preload the model. This helps in subsequent loads.
  useGLTF.preload(
    modelUrl || 'https://res.cloudinary.com/dwbibirzk/raw/upload/v1760026964/Pre-thesis/Product/3DModel/olanmpyo1owc1hp3gbdx.glb'
  );

  return (
    <div
      className={`viewer-container ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="div-container bg-dark rounded-3 shadow-lg d-flex flex-column"
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-secondary">
          <div>
            <h4 className="mb-0 text-white">3D Product Viewer</h4>
          </div>
          <button
            className="btn-close btn-close-white"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>

        {/* 3D Canvas Container */}
        <div
          className="flex-grow-1 position-relative"
          style={{ minHeight: 0, visibility: isOpen ? 'visible' : 'hidden' }}
        >
          <Canvas
            shadows
            frameloop={isOpen ? 'always' : 'demand'}
            className="canvas-custom"
            style={{
              opacity: isOpen ? 1 : 0
            }}
            camera={{ position: [0, 2, 5], fov: 70, near: 0.01, far: 2000 }}
          >

            {/* Lights */}
            <ambientLight
              intensity={0.25}
            />

            <directionalLight
              position={[3, 5, 2]}
              intensity={0.8}
              castShadow
            />

            {/* 3D Model with Suspense */}
            <Suspense fallback={<CanvasLoader />}>
              <Model isOpen={isOpen} key={modelUrl} modelUrl={modelUrl} autoRotate={autoRotate} />
              <Environment preset="studio" environmentIntensity={0.5} resolution={256} />
            </Suspense>

            {/* Ground plane with shadow */}
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -1, 0]}
              receiveShadow
            >
              <planeGeometry args={[20, 20]} />
              <shadowMaterial opacity={0.3} />
            </mesh>

            {/* Orbit Controls */}
            {controlsEnabled && (
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={1.2}
                maxDistance={10}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2}
                autoRotate={false}
              />
            )}
          </Canvas>

          {/* Floating Controls Panel */}
          <div
            className="position-absolute top-0 end-0 m-3 bg-dark bg-opacity-75 rounded-3 shadow p-2 border border-secondary"
            style={{ zIndex: 10 }}
          >
            <div className="d-flex flex-column gap-2">
              <button
                className={`btn btn-sm ${autoRotate ? 'btn-primary' : 'btn-outline-light'}`}
                onClick={() => setAutoRotate(!autoRotate)}
                title={autoRotate ? 'Stop Auto Rotation' : 'Start Auto Rotation'}
              >
                <i className={`fas fa-sync-alt ${autoRotate ? 'fa-spin' : ''}`}></i>
              </button>
              <button
                className={`btn btn-sm ${controlsEnabled ? 'btn-primary' : 'btn-outline-light'}`}
                onClick={() => setControlsEnabled(!controlsEnabled)}
                title={controlsEnabled ? 'Disable Controls' : 'Enable Controls'}
              >
                <i className="fas fa-hand-pointer"></i>
              </button>
              <button
                className="btn btn-sm btn-outline-light"
                onClick={() => {
                  setAutoRotate(true);
                  setControlsEnabled(true);
                }}
                title="Reset View"
              >
                <i className="fas fa-redo"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Footer with Controls Info */}
        <div className="p-3 border-top border-secondary bg-dark">
          <div className="row g-2 text-center">
            <div className="col-md-3">
              <small className="text-light">
                <i className="fas fa-mouse me-1 text-primary"></i>
                <strong>Rotate:</strong> Left Click + Drag
              </small>
            </div>
            <div className="col-md-3">
              <small className="text-light">
                <i className="fas fa-arrows-alt me-1 text-success"></i>
                <strong>Pan:</strong> Right Click + Drag
              </small>
            </div>
            <div className="col-md-3">
              <small className="text-light">
                <i className="fas fa-search-plus me-1 text-warning"></i>
                <strong>Zoom:</strong> Scroll Wheel
              </small>
            </div>
            <div className="col-md-3">
              <small className="text-light">
                <i className="fas fa-hand-pointer me-1 text-info"></i>
                <strong>Auto:</strong> Toggle Button
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDModelViewer;