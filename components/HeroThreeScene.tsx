'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp, Layers, RotateCcw, Smartphone } from 'lucide-react';
import { APPS_PORTFOLIO } from '@/lib/site-config';
import { useTheme } from './ThemeProvider';

const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();

function detectSoftwareWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') || probe.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function createRoundedRectShape(
  width: number,
  height: number,
  radius: number
): THREE.Shape {
  const s = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  s.moveTo(x + radius, y);
  s.lineTo(x + width - radius, y);
  s.quadraticCurveTo(x + width, y, x + width, y + radius);
  s.lineTo(x + width, y + height - radius);
  s.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  s.lineTo(x + radius, y + height);
  s.quadraticCurveTo(x, y + height, x, y + height - radius);
  s.lineTo(x, y + radius);
  s.quadraticCurveTo(x, y, x + radius, y);
  return s;
}

function createScreenCanvasTexture(
  appIndex: number,
  isDark: boolean,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const app = APPS_PORTFOLIO[appIndex] ?? APPS_PORTFOLIO[0];
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const bgGrad = ctx.createLinearGradient(0, 0, 512, 1024);
    if (isDark) {
      bgGrad.addColorStop(0, '#0b1326');
      bgGrad.addColorStop(1, '#111c36');
    } else {
      bgGrad.addColorStop(0, '#f8fbff');
      bgGrad.addColorStop(1, '#e8f0fe');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 512, 1024);

    const accentGrad = ctx.createLinearGradient(0, 0, 512, 260);
    accentGrad.addColorStop(0, app.accentHex);
    accentGrad.addColorStop(1, '#0284c7');
    ctx.fillStyle = accentGrad;
    ctx.fillRect(0, 0, 512, 270);

    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = '600 22px system-ui, sans-serif';
    ctx.fillText('Rahmani International', 36, 56);

    ctx.fillStyle = 'rgba(255,255,255,0.82)';
    ctx.font = '500 20px system-ui, sans-serif';
    ctx.fillText(app.categoryLabel.toUpperCase(), 36, 132);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 42px system-ui, sans-serif';
    ctx.fillText(app.name, 36, 190);

    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = '500 18px ui-monospace, monospace';
    ctx.fillText(app.packageId, 36, 232);

    const cardBg = isDark ? 'rgba(30, 41, 59, 0.85)' : '#ffffff';
    const cardBorder = isDark ? 'rgba(148,163,184,0.2)' : 'rgba(15,23,42,0.08)';
    const textMain = isDark ? '#f1f5f9' : '#0f172a';
    const textSub = isDark ? '#94a3b8' : '#475569';

    ctx.fillStyle = textMain;
    ctx.font = '700 24px system-ui, sans-serif';
    ctx.fillText('Core Capabilities', 36, 332);

    const features = app.features.slice(0, 5);
    features.forEach((feat, idx) => {
      const y = 364 + idx * 96;
      ctx.fillStyle = cardBg;
      ctx.beginPath();
      ctx.roundRect(36, y, 440, 76, 18);
      ctx.fill();
      ctx.strokeStyle = cardBorder;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = app.accentHex;
      ctx.beginPath();
      ctx.roundRect(56, y + 20, 36, 36, 10);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 18px ui-monospace, monospace';
      ctx.fillText(`0${idx + 1}`, 63, y + 44);

      ctx.fillStyle = textMain;
      ctx.font = '600 22px system-ui, sans-serif';
      ctx.fillText(feat.slice(0, 26), 110, y + 45);
    });

    ctx.fillStyle = app.accentHex;
    ctx.beginPath();
    ctx.roundRect(36, 876, 440, 74, 20);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 23px system-ui, sans-serif';
    ctx.fillText('Published on Google Play', 108, 921);

    ctx.fillStyle = textSub;
    ctx.font = '500 17px system-ui, sans-serif';
    ctx.fillText('rahmaniinternational.in', 156, 988);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

function createCircuitCoreTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 1024);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.32)';
    ctx.lineWidth = 3;
    for (let i = 48; i < 480; i += 36) {
      ctx.beginPath();
      ctx.moveTo(i, 60);
      ctx.lineTo(i, 380);
      ctx.lineTo(i + 18, 410);
      ctx.lineTo(i + 18, 940);
      ctx.stroke();
    }

    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(146, 360, 220, 220, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#e0f2fe';
    ctx.font = '700 28px ui-monospace, monospace';
    ctx.fillText('RI-CORE', 194, 466);
    ctx.fillStyle = '#38bdf8';
    ctx.font = '500 18px ui-monospace, monospace';
    ctx.fillText('ANDROID · WEB', 184, 502);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 16, 128, 128, 120);
    grad.addColorStop(0, 'rgba(15, 23, 42, 0.55)');
    grad.addColorStop(0.5, 'rgba(15, 23, 42, 0.22)');
    grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function HeroThreeScene() {
  const { theme } = useTheme();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activeAppIdx, setActiveAppIdx] = useState(0);
  const [exploded, setExploded] = useState(false);
  const [dockOpen, setDockOpen] = useState(true);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  const stateRef = useRef({
    exploded: false,
    appIdx: 0,
    isDark: theme === 'dark',
    resetCamera: false,
  });

  useEffect(() => {
    stateRef.current.exploded = exploded;
  }, [exploded]);

  useEffect(() => {
    stateRef.current.appIdx = activeAppIdx;
  }, [activeAppIdx]);

  useEffect(() => {
    stateRef.current.isDark = theme === 'dark';
  }, [theme]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let renderer: THREE.WebGLRenderer;
    const isSoftwareGl = detectSoftwareWebGL();

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch {
      queueMicrotask(() => setWebglUnavailable(true));
      return;
    }

    const width = container.clientWidth || 520;
    const height = container.clientHeight || 460;

    renderer.setSize(width, height);
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const canvasEl = renderer.domElement;
    canvasEl.style.display = 'block';
    canvasEl.style.width = '100%';
    canvasEl.style.height = '100%';
    container.innerHTML = '';
    container.appendChild(canvasEl);

    const onContextLost = (e: Event) => {
      e.preventDefault();
    };
    const onContextRestored = () => {
      renderer.render(scene, camera);
    };
    canvasEl.addEventListener('webglcontextlost', onContextLost);
    canvasEl.addEventListener('webglcontextrestored', onContextRestored);

    const scene = new THREE.Scene();
    const initialBg = stateRef.current.isDark ? 0x091022 : 0xeef3fb;
    scene.background = new THREE.Color(initialBg);
    scene.fog = new THREE.FogExp2(initialBg, 0.055);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 80);
    const defaultCamPos = new THREE.Vector3(3.15, 1.55, 5.25);
    const defaultLookAt = new THREE.Vector3(0, 1.45, 0);
    camera.position.copy(defaultCamPos);

    const controls = new OrbitControls(camera, canvasEl);
    controls.target.copy(defaultLookAt);
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 3.8;
    controls.maxDistance = 8.2;
    controls.minPolarAngle = Math.PI * 0.2;
    controls.maxPolarAngle = Math.PI * 0.56;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.update();

    let userInteracting = false;
    const onControlStart = () => {
      userInteracting = true;
      stateRef.current.resetCamera = false;
    };
    const onControlEnd = () => {
      userInteracting = false;
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('end', onControlEnd);

    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 0.78);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e0, 1.85);
    keyLight.position.set(4.5, 7.2, 5.0);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.camera.left = -4.2;
    keyLight.shadow.camera.right = 4.2;
    keyLight.shadow.camera.top = 4.2;
    keyLight.shadow.camera.bottom = -4.2;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.05);
    rimLight.position.set(-4.5, 3.6, -4.2);
    scene.add(rimLight);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];

    const maxAniso = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);

    const plinthPoints = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(1.85, 0.0),
      new THREE.Vector2(1.85, 0.08),
      new THREE.Vector2(1.72, 0.16),
      new THREE.Vector2(0.0, 0.16),
    ];
    const plinthGeo = new THREE.LatheGeometry(plinthPoints, 48);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: stateRef.current.isDark ? 0x162036 : 0xe2e8f0,
      roughness: 0.68,
      metalness: 0.12,
    });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.receiveShadow = true;
    scene.add(plinth);
    geometries.push(plinthGeo);
    materials.push(plinthMat);

    const plinthRingGeo = new THREE.TorusGeometry(1.74, 0.018, 16, 64);
    const plinthRingMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.25,
      metalness: 0.85,
    });
    const plinthRing = new THREE.Mesh(plinthRingGeo, plinthRingMat);
    plinthRing.rotation.x = Math.PI / 2;
    plinthRing.position.y = 0.165;
    scene.add(plinthRing);
    geometries.push(plinthRingGeo);
    materials.push(plinthRingMat);

    const contactTex = createContactShadowTexture();
    const shadowPlaneGeo = new THREE.PlaneGeometry(2.6, 2.6);
    const shadowPlaneMat = new THREE.MeshBasicMaterial({
      map: contactTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.45,
    });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.185;
    scene.add(shadowPlane);
    geometries.push(shadowPlaneGeo);
    materials.push(shadowPlaneMat);
    textures.push(contactTex);

    const deviceRoot = new THREE.Group();
    deviceRoot.position.set(0, 1.58, 0);
    scene.add(deviceRoot);

    const frameShape = createRoundedRectShape(1.18, 2.38, 0.18);
    const frameGeo = new THREE.ExtrudeGeometry(frameShape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.024,
      bevelSize: 0.02,
      bevelSegments: 4,
    });
    frameGeo.center();
    const titaniumMat = new THREE.MeshPhysicalMaterial({
      color: 0x94a3b8,
      metalness: 0.92,
      roughness: 0.22,
      clearcoat: 0.35,
      clearcoatRoughness: 0.25,
    });
    const chassisMesh = new THREE.Mesh(frameGeo, titaniumMat);
    chassisMesh.castShadow = true;
    chassisMesh.receiveShadow = true;
    deviceRoot.add(chassisMesh);
    geometries.push(frameGeo);
    materials.push(titaniumMat);

    const btnGeo = new THREE.BoxGeometry(0.032, 0.24, 0.055);
    const btnShortGeo = new THREE.BoxGeometry(0.032, 0.16, 0.055);
    const btnMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.95,
      roughness: 0.18,
    });
    const powerBtn = new THREE.Mesh(btnShortGeo, btnMat);
    powerBtn.position.set(0.615, 0.22, 0);
    const volUpBtn = new THREE.Mesh(btnGeo, btnMat);
    volUpBtn.position.set(-0.615, 0.42, 0);
    const volDownBtn = new THREE.Mesh(btnGeo, btnMat);
    volDownBtn.position.set(-0.615, 0.08, 0);
    deviceRoot.add(powerBtn, volUpBtn, volDownBtn);
    geometries.push(btnGeo, btnShortGeo);
    materials.push(btnMat);

    const coreGroup = new THREE.Group();
    const coreTex = createCircuitCoreTexture(maxAniso);
    const coreGeo = new THREE.BoxGeometry(1.02, 2.18, 0.03);
    const coreMat = new THREE.MeshStandardMaterial({
      map: coreTex,
      roughness: 0.62,
      metalness: 0.35,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);
    deviceRoot.add(coreGroup);
    geometries.push(coreGeo);
    materials.push(coreMat);
    textures.push(coreTex);

    const screenGroup = new THREE.Group();
    const bezelShape = createRoundedRectShape(1.12, 2.31, 0.15);
    const bezelGeo = new THREE.ExtrudeGeometry(bezelShape, {
      depth: 0.018,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 2,
    });
    bezelGeo.center();
    const bezelMat = new THREE.MeshPhysicalMaterial({
      color: 0x090d16,
      roughness: 0.14,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    });
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    bezelMesh.position.z = 0.075;
    screenGroup.add(bezelMesh);

    let currentScreenTex = createScreenCanvasTexture(
      stateRef.current.appIdx,
      stateRef.current.isDark,
      maxAniso
    );
    const screenGeo = new THREE.PlaneGeometry(1.03, 2.18);
    const screenMat = new THREE.MeshStandardMaterial({
      map: currentScreenTex,
      roughness: 0.18,
      metalness: 0.04,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: currentScreenTex,
      emissiveIntensity: 0.28,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = 0.095;
    screenGroup.add(screenMesh);

    const speakerGeo = new THREE.CapsuleGeometry(0.022, 0.16, 4, 12);
    const speakerMat = new THREE.MeshStandardMaterial({
      color: 0x020617,
      roughness: 0.5,
      metalness: 0.2,
    });
    const speakerMesh = new THREE.Mesh(speakerGeo, speakerMat);
    speakerMesh.rotation.z = Math.PI / 2;
    speakerMesh.position.set(0, 1.01, 0.098);
    screenGroup.add(speakerMesh);

    deviceRoot.add(screenGroup);
    geometries.push(bezelGeo, screenGeo, speakerGeo);
    materials.push(bezelMat, screenMat, speakerMat);

    const backGroup = new THREE.Group();
    const backShape = createRoundedRectShape(1.13, 2.32, 0.16);
    const backGeo = new THREE.ExtrudeGeometry(backShape, {
      depth: 0.02,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 2,
    });
    backGeo.center();
    const backMat = new THREE.MeshPhysicalMaterial({
      color: 0x1d4ed8,
      roughness: 0.44,
      metalness: 0.15,
      clearcoat: 0.75,
      clearcoatRoughness: 0.22,
    });
    const backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.position.z = -0.075;
    backGroup.add(backMesh);

    const camIslandShape = createRoundedRectShape(0.46, 0.56, 0.1);
    const camIslandGeo = new THREE.ExtrudeGeometry(camIslandShape, {
      depth: 0.036,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 3,
    });
    camIslandGeo.center();
    const camIslandMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.28,
      metalness: 0.65,
    });
    const camIsland = new THREE.Mesh(camIslandGeo, camIslandMat);
    camIsland.position.set(-0.24, 0.72, -0.105);
    backGroup.add(camIsland);

    const barrelProfile = [
      new THREE.Vector2(0.08, 0.0),
      new THREE.Vector2(0.105, 0.0),
      new THREE.Vector2(0.105, 0.04),
      new THREE.Vector2(0.09, 0.052),
      new THREE.Vector2(0.075, 0.052),
      new THREE.Vector2(0.075, 0.012),
    ];
    const lensBarrelGeo = new THREE.LatheGeometry(barrelProfile, 28);
    const lensBarrelMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      metalness: 0.96,
      roughness: 0.16,
    });
    const lensGlassGeo = new THREE.SphereGeometry(0.074, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.4);
    const lensGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0c192c,
      roughness: 0.04,
      metalness: 0.2,
      clearcoat: 1.0,
      ior: 1.75,
    });

    [0.85, 0.6].forEach((ly) => {
      const barrel = new THREE.Mesh(lensBarrelGeo, lensBarrelMat);
      barrel.rotation.x = -Math.PI / 2;
      barrel.position.set(-0.24, ly, -0.125);
      backGroup.add(barrel);

      const glass = new THREE.Mesh(lensGlassGeo, lensGlassMat);
      glass.rotation.x = -Math.PI / 2;
      glass.position.set(-0.24, ly, -0.145);
      backGroup.add(glass);
    });

    deviceRoot.add(backGroup);
    geometries.push(backGeo, camIslandGeo, lensBarrelGeo, lensGlassGeo);
    materials.push(backMat, camIslandMat, lensBarrelMat, lensGlassMat);

    const orbitGroup = new THREE.Group();
    orbitGroup.position.set(0, 1.58, 0);
    const orbitRingGeo = new THREE.TorusGeometry(1.52, 0.012, 14, 96);
    const orbitRingMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.25,
      metalness: 0.8,
      transparent: true,
      opacity: 0.65,
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI * 0.42;
    orbitRing.rotation.y = Math.PI * 0.12;
    orbitGroup.add(orbitRing);

    const nodeGeo = new THREE.OctahedronGeometry(0.085, 1);
    const nodeColors = [0x1a56db, 0x0284c7, 0x0f766e];
    const orbitNodes: THREE.Mesh[] = [];
    nodeColors.forEach((col, i) => {
      const mat = new THREE.MeshStandardMaterial({
        color: col,
        roughness: 0.28,
        metalness: 0.72,
      });
      materials.push(mat);
      const node = new THREE.Mesh(nodeGeo, mat);
      const angle = (i * Math.PI * 2) / 3;
      node.position.set(Math.cos(angle) * 1.52, Math.sin(angle) * 0.38, Math.sin(angle) * 1.46);
      orbitGroup.add(node);
      orbitNodes.push(node);
    });
    scene.add(orbitGroup);
    geometries.push(orbitRingGeo, nodeGeo);
    materials.push(orbitRingMat);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let renderedAppIdx = stateRef.current.appIdx;
    let renderedDark = stateRef.current.isDark;
    let explodeProgress = 0;

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function syncVisualState(dt: number, elapsed: number) {
      if (renderedDark !== stateRef.current.isDark) {
        renderedDark = stateRef.current.isDark;
        const bgHex = renderedDark ? 0x091022 : 0xeef3fb;
        (scene.background as THREE.Color).setHex(bgHex);
        if (scene.fog instanceof THREE.FogExp2) {
          scene.fog.color.setHex(bgHex);
        }
        plinthMat.color.setHex(renderedDark ? 0x162036 : 0xe2e8f0);

        const nextTex = createScreenCanvasTexture(
          stateRef.current.appIdx,
          renderedDark,
          maxAniso
        );
        screenMat.map = nextTex;
        screenMat.emissiveMap = nextTex;
        screenMat.needsUpdate = true;
        currentScreenTex.dispose();
        currentScreenTex = nextTex;
      }

      if (renderedAppIdx !== stateRef.current.appIdx) {
        renderedAppIdx = stateRef.current.appIdx;
        const nextTex = createScreenCanvasTexture(
          renderedAppIdx,
          renderedDark,
          maxAniso
        );
        screenMat.map = nextTex;
        screenMat.emissiveMap = nextTex;
        screenMat.needsUpdate = true;
        currentScreenTex.dispose();
        currentScreenTex = nextTex;
      }

      const targetExplode = stateRef.current.exploded ? 1 : 0;
      explodeProgress = THREE.MathUtils.damp(
        explodeProgress,
        targetExplode,
        5.5,
        dt
      );
      screenGroup.position.z = explodeProgress * 0.42;
      backGroup.position.z = -explodeProgress * 0.42;
      coreGroup.scale.setScalar(1 + explodeProgress * 0.03);

      if (!reduceMotion) {
        deviceRoot.position.y = 1.58 + Math.sin(elapsed * 1.25) * 0.06;
        if (!userInteracting) {
          deviceRoot.rotation.y = Math.sin(elapsed * 0.55) * 0.28;
        }
        orbitGroup.rotation.y = elapsed * 0.28;
        orbitNodes.forEach((node, idx) => {
          node.rotation.y = elapsed * (0.8 + idx * 0.2);
          node.rotation.x = elapsed * 0.5;
        });
      }

      if (stateRef.current.resetCamera) {
        const dampAlpha = 1 - Math.exp(-6 * dt);
        _targetCamPos.copy(defaultCamPos);
        _targetLookAt.copy(defaultLookAt);
        camera.position.lerp(_targetCamPos, dampAlpha);
        controls.target.lerp(_targetLookAt, dampAlpha);
        if (
          camera.position.distanceTo(_targetCamPos) < 0.02 &&
          controls.target.distanceTo(_targetLookAt) < 0.02
        ) {
          camera.position.copy(_targetCamPos);
          controls.target.copy(_targetLookAt);
          stateRef.current.resetCamera = false;
        }
      }

      controls.update();
    }

    function tick() {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();
      syncVisualState(dt, elapsed);
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(entry.contentRect.width, 280);
        const h = Math.max(entry.contentRect.height, 320);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('end', onControlEnd);
      controls.dispose();
      canvasEl.removeEventListener('webglcontextlost', onContextLost);
      canvasEl.removeEventListener('webglcontextrestored', onContextRestored);

      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      currentScreenTex.dispose();
      envTarget.dispose();
      renderer.dispose();
    };
  }, []);

  const currentApp = APPS_PORTFOLIO[activeAppIdx] ?? APPS_PORTFOLIO[0];

  if (webglUnavailable) {
    return (
      <div className="relative flex h-[430px] w-full flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 text-center">
        <Smartphone className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-3" />
        <p className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
          Rahmani International Product Studio
        </p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-xs">
          5 published Android applications and responsive web platforms engineered for daily utility.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-[430px] sm:h-[480px] w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#eef3fb] dark:bg-[#091022]">
      <div
        ref={mountRef}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        aria-label="Interactive 3D showcase of Rahmani International mobile applications"
      />

      <div className="pointer-events-none absolute top-3.5 left-3.5 rounded-lg border border-slate-300/80 dark:border-slate-700/80 bg-white/92 dark:bg-slate-900/92 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200">
        <span>3D Studio Preview</span>
        <span className="mx-1.5 text-slate-400" aria-hidden="true">·</span>
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          {currentApp.name}
        </span>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center max-w-[94%]">
        <button
          type="button"
          onClick={() => setDockOpen((prev) => !prev)}
          className="mb-1.5 inline-flex items-center gap-1 rounded-md border border-slate-300/80 dark:border-slate-700/80 bg-white/92 dark:bg-slate-900/92 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap"
          aria-expanded={dockOpen}
        >
          {dockOpen ? (
            <>
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              Hide Controls
            </>
          ) : (
            <>
              <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
              Show Controls
            </>
          )}
        </button>

        {dockOpen && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-xl border border-slate-300/80 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 p-1.5 shadow-sm">
            <button
              type="button"
              onClick={() =>
                setActiveAppIdx((prev) => (prev + 1) % APPS_PORTFOLIO.length)
              }
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
            >
              <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
              Next App
            </button>

            <button
              type="button"
              onClick={() => setExploded((prev) => !prev)}
              aria-pressed={exploded}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                exploded
                  ? 'bg-slate-900 text-white dark:bg-blue-500 dark:text-slate-950'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Layers className="h-3.5 w-3.5" aria-hidden="true" />
              {exploded ? 'Assemble' : 'Exploded View'}
            </button>

            <button
              type="button"
              onClick={() => {
                setExploded(false);
                stateRef.current.resetCamera = true;
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
