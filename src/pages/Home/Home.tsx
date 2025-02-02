/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import * as THREE from "three";
import buildRender from "../../helper/renderer";
import buildCamera from "../../helper/camera";
import startScene from "../../helper/scene";
import setupLighting from "../../helper/lighting";
import createSimpleSphere, { createRing } from "../../helper/geometry";
import createSimpleMat, { createRingMat, createSunMat } from "../../helper/materials";
import createSimpleMesh, { createMoonMesh, createRingMesh } from "../../helper/mesh";
import { asteroidBelt, asteroidBeltOuter, solarData } from "../../data/starData";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import generateSpaceCubeMap from "../../helper/background";
import Navbar from "../../components/Navbar/Navbar";
import { createRingWithPoints } from "../../helper/particles";

export default function Home() {
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer>();
  const [camera, setCamera] = useState<THREE.PerspectiveCamera>();
  const [, setScene] = useState<THREE.Scene>();

  useEffect(() => {
    const newRenderer = buildRender(setRenderer);
    const newCamera = buildCamera(setCamera);
    const newScene = startScene(setScene);
  
    const cameraTarget = new THREE.Vector3(0, 0, 0);
    const clock = new THREE.Clock();
    let animationFrameId: number;
  
    if (newRenderer && newCamera && newScene) {
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
  
        const curTime = clock.getElapsedTime();
  
        meshes.forEach((item, index) => {
          item.position.x = Math.sin(curTime * solarData[index].speed) * solarData[index].distance;
          item.position.z = Math.cos(curTime * solarData[index].speed) * solarData[index].distance;
          item.rotation.y += solarData[index].rotateSpeed;
        });
  
        newCamera.position.y = Math.sin(curTime * 0.02) * 1000;
        newCamera.position.z = Math.sin(curTime * 0.02) * 1000;
        newCamera.position.x = Math.cos(curTime * 0.02) * 1000;
        newCamera.lookAt(cameraTarget);
  
        newRenderer?.render(newScene, newCamera);
      };
  
      const meshes = solarData.map((item) => {
        const geo = createSimpleSphere(item.size);
        const mat = item.name === "Sun" ? createSunMat(item.texture) : createSimpleMat(item.texture);
        const mesh = createSimpleMesh(geo, mat, item.distance, newScene);
  
        if (item.moons?.length) {
          item.moons.forEach((moon) => {
            const moonGeo = createSimpleSphere(moon.size);
            const moonMat = createSimpleMat(moon.texture);
            const moonMesh = createMoonMesh(moonGeo, moonMat, mesh);
            moonMesh.position.x = moon.distance;
          });
        }
  
        if (item.ring) {
          const ringGeo = createRing(item.ring.innerRadius, item.ring.outerRadius);
          const ringMat = createRingMat(item.ring.texture);
          const ringMesh = createRingMesh(ringGeo, ringMat, mesh);
          ringMesh.rotation.x = 45;
        }
  
        return mesh;
      });
  
      // Create asteroid belt
      const asteroidPoints = createRingWithPoints(asteroidBelt.inner, asteroidBelt.outer, 2000);
      const asteroidGeo = new THREE.BufferGeometry().setFromPoints(asteroidPoints);
      const ringMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 });
      const asteroidMesh = new THREE.Points(asteroidGeo, ringMat);
      asteroidMesh.rotation.x = Math.PI / 2;
  
      const asteroidOuterPoints = createRingWithPoints(asteroidBeltOuter.inner, asteroidBeltOuter.outer, 1000);
      const asteroidOuterGeo = new THREE.BufferGeometry().setFromPoints(asteroidOuterPoints);
      const asteroidOuterMesh = new THREE.Points(asteroidOuterGeo, ringMat);
      asteroidOuterMesh.rotation.x = Math.PI / 2;
  
      const controls = new OrbitControls(newCamera, newRenderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.01;
  
      generateSpaceCubeMap(newScene);
      setupLighting(newScene);
      newScene.add(asteroidMesh);
      newScene.add(asteroidOuterMesh);
  
      animate();
  
      return () => {
        cancelAnimationFrame(animationFrameId);
        controls.dispose();
        newRenderer.dispose();
      };
    }
  }, []);
  
  useEffect(() => {
    const handleWindowResize = () => {
      if (camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      }
      if (renderer) {
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };
  
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [camera, renderer]);
  

  return (
    <div>
      <Navbar />
      <canvas className="three" style={{ backgroundColor: 'black' }}>
      </canvas>
    </div>
  )
}
