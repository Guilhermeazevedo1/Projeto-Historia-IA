import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  lossDomain,
  lossForWeights,
  lossMinimum,
  type LossPoint
} from "./lossLandscapeModel";

type LossLandscape3DProps = {
  points: LossPoint[];
  reducedMotion: boolean;
  running: boolean;
};

type SceneState = {
  camera: THREE.PerspectiveCamera;
  currentMarker: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
  pathGroup: THREE.Group;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  target: THREE.Vector3;
};

const surfaceScale = 2;
const heightScale = 2.8;
const surfaceFloor = -1.35;

const pointToScene = (point: Pick<LossPoint, "w1" | "w2" | "loss">) =>
  new THREE.Vector3(point.w1 * surfaceScale, surfaceFloor + point.loss * heightScale + 0.08, point.w2 * surfaceScale);

const disposeObject = (object: THREE.Object3D) => {
  const disposable = object as THREE.Object3D & {
    geometry?: THREE.BufferGeometry;
    material?: THREE.Material | THREE.Material[];
  };

  disposable.geometry?.dispose();
  if (!disposable.material) {
    return;
  }

  const materials = Array.isArray(disposable.material) ? disposable.material : [disposable.material];
  materials.forEach((material) => material.dispose());
};

const makeSurface = () => {
  const segments = 42;
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const lowColor = new THREE.Color("#7f7838");
  const middleColor = new THREE.Color("#19302d");
  const highColor = new THREE.Color("#35252d");

  for (let zIndex = 0; zIndex <= segments; zIndex += 1) {
    const w2 = lossDomain.min + (zIndex / segments) * (lossDomain.max - lossDomain.min);
    for (let xIndex = 0; xIndex <= segments; xIndex += 1) {
      const w1 = lossDomain.min + (xIndex / segments) * (lossDomain.max - lossDomain.min);
      const loss = lossForWeights(w1, w2);
      positions.push(w1 * surfaceScale, surfaceFloor + Math.min(1.55, loss) * heightScale, w2 * surfaceScale);

      const normalized = Math.min(1, loss / 1.35);
      const color = normalized < 0.4
        ? lowColor.clone().lerp(middleColor, normalized / 0.4)
        : middleColor.clone().lerp(highColor, (normalized - 0.4) / 0.6);
      colors.push(color.r, color.g, color.b);
    }
  }

  const rowLength = segments + 1;
  for (let zIndex = 0; zIndex < segments; zIndex += 1) {
    for (let xIndex = 0; xIndex < segments; xIndex += 1) {
      const a = zIndex * rowLength + xIndex;
      const b = a + 1;
      const c = a + rowLength;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.88,
    metalness: 0.04,
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);

  const wireframe = new THREE.LineSegments(
    new THREE.WireframeGeometry(geometry),
    new THREE.LineBasicMaterial({ color: 0xf6f1e8, transparent: true, opacity: 0.055 })
  );

  return { mesh, wireframe };
};

const updatePath = (sceneState: SceneState, points: LossPoint[]) => {
  sceneState.pathGroup.traverse(disposeObject);
  sceneState.pathGroup.clear();

  const scenePoints = points.map(pointToScene);
  if (scenePoints.length > 1) {
    const curve = new THREE.CatmullRomCurve3(scenePoints, false, "centripetal");
    const pathGeometry = new THREE.TubeGeometry(curve, Math.max(18, scenePoints.length * 8), 0.025, 7, false);
    const pathMaterial = new THREE.MeshBasicMaterial({ color: 0xf2e66d, transparent: true, opacity: 0.78 });
    sceneState.pathGroup.add(new THREE.Mesh(pathGeometry, pathMaterial));
  }

  const markerGeometry = new THREE.SphereGeometry(0.055, 12, 12);
  points.slice(0, -1).forEach((point, index) => {
    const marker = new THREE.Mesh(
      markerGeometry.clone(),
      new THREE.MeshBasicMaterial({
        color: 0xf2e66d,
        transparent: true,
        opacity: Math.max(0.18, 0.52 - index * 0.035)
      })
    );
    marker.position.copy(pointToScene(point));
    sceneState.pathGroup.add(marker);
  });

  const latest = scenePoints[scenePoints.length - 1];
  if (latest) {
    sceneState.target.copy(latest);
  }
};

export default function LossLandscape3D({ points, reducedMotion, running }: LossLandscape3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialPointsRef = useRef(points);
  const sceneRef = useRef<SceneState | null>(null);
  const visibleRef = useRef(false);
  const reducedMotionRef = useRef(reducedMotion);
  const runningRef = useRef(running);
  const [unsupported, setUnsupported] = useState(false);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  useEffect(() => {
    const sceneState = sceneRef.current;
    if (!sceneState) {
      return;
    }

    updatePath(sceneState, points);
    if (reducedMotion) {
      sceneState.currentMarker.position.copy(sceneState.target);
      sceneState.renderer.render(sceneState.scene, sceneState.camera);
    }
  }, [points, reducedMotion]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    setUnsupported(false);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      setUnsupported(true);
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = "loss-landscape-three__canvas";
    renderer.domElement.setAttribute(
      "aria-label",
      "Paisagem tridimensional didática de perda com dois pesos e um caminho de descida até o mínimo"
    );
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 30);
    const cameraTarget = new THREE.Vector3(0, -0.3, 0);
    let yaw = 0.76;
    let pitch = 0.58;
    const distance = 8.2;

    const updateCamera = () => {
      camera.position.set(
        Math.cos(yaw) * Math.cos(pitch) * distance,
        Math.sin(pitch) * distance,
        Math.sin(yaw) * Math.cos(pitch) * distance
      );
      camera.lookAt(cameraTarget);
    };
    updateCamera();

    scene.add(new THREE.HemisphereLight(0xe8edf1, 0x13151c, 1.7));
    const keyLight = new THREE.DirectionalLight(0xffef91, 2.2);
    keyLight.position.set(2.5, 5, 3.5);
    scene.add(keyLight);

    const { mesh, wireframe } = makeSurface();
    scene.add(mesh, wireframe);

    const floorGrid = new THREE.GridHelper(6.4, 12, 0xf2e66d, 0xf6f1e8);
    floorGrid.position.y = surfaceFloor - 0.04;
    const floorMaterials = Array.isArray(floorGrid.material) ? floorGrid.material : [floorGrid.material];
    floorMaterials.forEach((material, index) => {
      material.transparent = true;
      material.opacity = index === 0 ? 0.13 : 0.045;
    });
    scene.add(floorGrid);

    const minimumPosition = pointToScene({
      ...lossMinimum,
      loss: 0
    });
    const minimumRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.17, 0.025, 10, 36),
      new THREE.MeshBasicMaterial({ color: 0x7bd8a4, transparent: true, opacity: 0.92 })
    );
    minimumRing.rotation.x = Math.PI / 2;
    minimumRing.position.copy(minimumPosition);
    minimumRing.position.y += 0.025;
    scene.add(minimumRing);

    const currentMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 20, 20),
      new THREE.MeshStandardMaterial({
        color: 0xfff47b,
        emissive: 0x5f5819,
        emissiveIntensity: 0.9,
        roughness: 0.5
      })
    );
    const initialPoints = initialPointsRef.current;
    currentMarker.position.copy(pointToScene(initialPoints[initialPoints.length - 1]));
    scene.add(currentMarker);

    const pathGroup = new THREE.Group();
    scene.add(pathGroup);
    const sceneState: SceneState = {
      camera,
      currentMarker,
      pathGroup,
      renderer,
      scene,
      target: currentMarker.position.clone()
    };
    sceneRef.current = sceneState;
    updatePath(sceneState, initialPoints);

    let dragging = false;
    let previousX = 0;
    let previousY = 0;
    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      previousX = event.clientX;
      previousY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
      renderer.domElement.dataset.dragging = "true";
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) {
        return;
      }
      yaw -= (event.clientX - previousX) * 0.006;
      pitch = Math.max(0.28, Math.min(1.05, pitch + (event.clientY - previousY) * 0.004));
      previousX = event.clientX;
      previousY = event.clientY;
      updateCamera();
    };
    const onPointerUp = (event: PointerEvent) => {
      dragging = false;
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
      delete renderer.domElement.dataset.dragging;
    };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);

    const resize = () => {
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    let frame = 0;
    const renderFrame = () => {
      if (!visibleRef.current) {
        frame = 0;
        return;
      }

      const marker = sceneState.currentMarker;
      if (reducedMotionRef.current) {
        marker.position.copy(sceneState.target);
      } else {
        marker.position.lerp(sceneState.target, runningRef.current ? 0.12 : 0.18);
        const pulse = runningRef.current ? 1 + Math.sin(performance.now() * 0.009) * 0.08 : 1;
        marker.scale.setScalar(pulse);
      }
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(renderFrame);
    };
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      if (entry.isIntersecting && frame === 0) {
        frame = window.requestAnimationFrame(renderFrame);
      }
    }, { threshold: 0.05 });
    intersectionObserver.observe(container);

    return () => {
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerUp);
      scene.traverse(disposeObject);
      renderer.dispose();
      renderer.domElement.remove();
      sceneRef.current = null;
    };
  }, []);

  if (unsupported) {
    return (
      <div className="loss-landscape-three__fallback">
        <span>paisagem 3D indisponível</span>
        <strong>O ponto mais baixo representa a menor perda.</strong>
      </div>
    );
  }

  return <div className="loss-landscape-three" ref={containerRef} />;
}
