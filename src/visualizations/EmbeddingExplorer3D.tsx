import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  embeddingAmbientEdges,
  embeddingGroupColors,
  embeddingWords,
  getEmbeddingNeighbors,
  getEmbeddingWord
} from "./embeddingData";

type EmbeddingExplorer3DProps = {
  selected: string;
  reducedMotion: boolean;
  returning: boolean;
  onSelect: (word: string) => void;
};

type WordSceneObject = {
  root: THREE.Group;
  node: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  label: THREE.Sprite;
  labelScale: THREE.Vector3;
  hitArea: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  baseColor: THREE.Color;
};

type ExplorerScene = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  relationGroup: THREE.Group;
  wordObjects: Map<string, WordSceneObject>;
};

const makeLabel = (word: string, color: string) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  context.font = "600 42px Inter, system-ui, sans-serif";
  const measuredWidth = Math.ceil(context.measureText(word).width);
  canvas.width = Math.max(190, measuredWidth + 64);
  canvas.height = 96;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = "600 42px Inter, system-ui, sans-serif";
  context.fillStyle = color;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.shadowColor = color;
  context.shadowBlur = 10;
  context.fillText(word, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    opacity: 0.68
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(canvas.width / 150, 0.64, 1);
  sprite.position.y = 0.43;
  return sprite;
};

const makeLine = (
  from: readonly [number, number, number],
  to: readonly [number, number, number],
  color: string,
  opacity: number
) => {
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(...from),
    new THREE.Vector3(...to)
  ]);
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  return new THREE.Line(geometry, material);
};

const disposeObject = (object: THREE.Object3D) => {
  const disposable = object as THREE.Object3D & {
    geometry?: THREE.BufferGeometry;
    material?: THREE.Material | THREE.Material[];
  };
  disposable.geometry?.dispose();

  const materials = disposable.material
    ? Array.isArray(disposable.material)
      ? disposable.material
      : [disposable.material]
    : [];

  materials.forEach((material) => {
    const textured = material as THREE.Material & { map?: THREE.Texture | null };
    textured.map?.dispose();
    material.dispose();
  });
};

const applySelectionToScene = (explorer: ExplorerScene, selected: string) => {
  const selectedWord = getEmbeddingWord(selected);
  const neighbors = getEmbeddingNeighbors(selected);
  const neighborWords = new Set(neighbors.map((neighbor) => neighbor.word));

  explorer.wordObjects.forEach((object, word) => {
    const isSelected = word === selected;
    const isNeighbor = neighborWords.has(word);
    object.node.material.opacity = isSelected ? 1 : isNeighbor ? 0.82 : 0.28;
    object.node.material.color.set(isSelected ? "#f6f1e8" : object.baseColor);
    object.node.scale.setScalar(isSelected ? 1.85 : isNeighbor ? 1.28 : 1);

    const labelMaterial = object.label.material as THREE.SpriteMaterial;
    labelMaterial.opacity = isSelected ? 1 : isNeighbor ? 0.86 : 0.34;
    object.label.scale.copy(object.labelScale).multiplyScalar(isSelected ? 1.12 : 1);
  });

  explorer.relationGroup.children.forEach(disposeObject);
  explorer.relationGroup.clear();
  neighbors.forEach((neighbor) => {
    const neighborWord = getEmbeddingWord(neighbor.word);
    explorer.relationGroup.add(
      makeLine(
        selectedWord.position,
        neighborWord.position,
        embeddingGroupColors[selectedWord.group],
        0.42
      )
    );
  });

  explorer.renderer.render(explorer.scene, explorer.camera);
};

export default function EmbeddingExplorer3D({
  selected,
  reducedMotion,
  returning,
  onSelect
}: EmbeddingExplorer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ExplorerScene | null>(null);
  const selectedRef = useRef(selected);
  const returningRef = useRef(returning);
  const [unsupported, setUnsupported] = useState(false);

  useEffect(() => {
    selectedRef.current = selected;
    const explorer = sceneRef.current;
    if (!explorer) {
      return;
    }

    applySelectionToScene(explorer, selected);
  }, [selected]);

  useEffect(() => {
    returningRef.current = returning;
  }, [returning]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    setUnsupported(false);
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
    } catch {
      setUnsupported(true);
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "embedding-three-canvas";
    renderer.domElement.tabIndex = 0;
    renderer.domElement.setAttribute(
      "aria-label",
      "Projeção tridimensional navegável de palavras semanticamente próximas"
    );
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#08090d");
    scene.fog = new THREE.FogExp2(0x08090d, 0.032);

    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 70);
    camera.position.set(0, 0, 16);
    camera.rotation.order = "YXZ";

    const grid = new THREE.GridHelper(30, 20, 0x9fd1ff, 0x9fd1ff);
    grid.position.y = -4.7;
    const gridMaterial = grid.material as THREE.LineBasicMaterial;
    gridMaterial.transparent = true;
    gridMaterial.opacity = 0.055;
    scene.add(grid);

    const ambientRelations = new THREE.Group();
    embeddingAmbientEdges.forEach(([fromWord, toWord]) => {
      const from = getEmbeddingWord(fromWord);
      const to = getEmbeddingWord(toWord);
      ambientRelations.add(makeLine(from.position, to.position, embeddingGroupColors[from.group], 0.09));
    });
    ambientRelations.scale.z = reducedMotion ? 1 : 0;
    scene.add(ambientRelations);

    const relationGroup = new THREE.Group();
    relationGroup.scale.z = reducedMotion ? 1 : 0;
    scene.add(relationGroup);

    const sphereGeometry = new THREE.SphereGeometry(0.13, 18, 18);
    const hitGeometry = new THREE.SphereGeometry(0.52, 10, 10);
    const wordObjects = new Map<string, WordSceneObject>();

    embeddingWords.forEach((item) => {
      const root = new THREE.Group();
      root.position.set(item.position[0], item.position[1], reducedMotion ? item.position[2] : 0);
      root.userData.originalPosition = new THREE.Vector3(...item.position);

      const baseColor = new THREE.Color(embeddingGroupColors[item.group]);
      const nodeMaterial = new THREE.MeshBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: 0.46
      });
      const node = new THREE.Mesh(sphereGeometry, nodeMaterial);
      root.add(node);

      const wordLabel = makeLabel(item.word, embeddingGroupColors[item.group]);
      if (wordLabel) {
        root.add(wordLabel);
      }
      const label = wordLabel ?? new THREE.Sprite(new THREE.SpriteMaterial({ opacity: 0 }));

      const hitMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false
      });
      const hitArea = new THREE.Mesh(hitGeometry, hitMaterial);
      hitArea.userData.word = item.word;
      root.add(hitArea);

      scene.add(root);
      wordObjects.set(item.word, {
        root,
        node,
        label,
        labelScale: label.scale.clone(),
        hitArea,
        baseColor
      });
    });

    sceneRef.current = { scene, camera, renderer, relationGroup, wordObjects };
    applySelectionToScene(sceneRef.current, selectedRef.current);

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (width <= 0 || height <= 0) {
        return;
      }
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const keys = new Set<string>();
    const movementCodes = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "ShiftLeft", "ShiftRight"]);
    const onKeyDown = (event: KeyboardEvent) => {
      if (movementCodes.has(event.code)) {
        event.preventDefault();
        keys.add(event.code);
      }
    };
    const onKeyUp = (event: KeyboardEvent) => keys.delete(event.code);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    const canvas = renderer.domElement;
    const pointer = { active: false, moved: 0, x: 0, y: 0 };
    let yaw = 0;
    let pitch = 0;
    const raycaster = new THREE.Raycaster();
    const pointerPosition = new THREE.Vector2();

    const onPointerDown = (event: PointerEvent) => {
      pointer.active = true;
      pointer.moved = 0;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!pointer.active || returningRef.current) {
        return;
      }
      const deltaX = event.clientX - pointer.x;
      const deltaY = event.clientY - pointer.y;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.moved += Math.abs(deltaX) + Math.abs(deltaY);
      yaw -= deltaX * 0.0035;
      pitch = THREE.MathUtils.clamp(pitch - deltaY * 0.0035, -1.05, 1.05);
      camera.rotation.set(pitch, yaw, 0);
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!pointer.active) {
        return;
      }
      pointer.active = false;
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }

      if (pointer.moved > 8 || returningRef.current) {
        return;
      }

      const bounds = canvas.getBoundingClientRect();
      pointerPosition.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointerPosition.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(pointerPosition, camera);
      const intersections = raycaster.intersectObjects(
        Array.from(wordObjects.values(), (object) => object.hitArea),
        false
      );
      const word = intersections[0]?.object.userData.word as string | undefined;
      if (word) {
        onSelect(word);
      }
    };
    const onWheel = (event: WheelEvent) => {
      if (returningRef.current) {
        return;
      }
      event.preventDefault();
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      camera.position.addScaledVector(forward, event.deltaY * -0.0025);
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    const movement = new THREE.Vector3();
    const worldUp = new THREE.Vector3(0, 1, 0);
    const retreatTarget = new THREE.Vector3(0, 0, 28);
    let animationFrame = 0;
    let lastFrame = performance.now();
    let lastRendered = 0;
    let lastProximityCheck = 0;
    let depthProgress = reducedMotion ? 1 : 0;

    const animate = (now: number) => {
      animationFrame = window.requestAnimationFrame(animate);
      if (document.visibilityState === "hidden") {
        lastFrame = now;
        return;
      }

      const minimumFrameTime = reducedMotion ? 70 : 32;
      if (now - lastRendered < minimumFrameTime) {
        return;
      }

      const delta = Math.min((now - lastFrame) / 1000, 0.08);
      lastFrame = now;
      lastRendered = now;

      if (returningRef.current) {
        camera.position.lerp(retreatTarget, reducedMotion ? 1 : 0.13);
        depthProgress = THREE.MathUtils.lerp(depthProgress, 0, reducedMotion ? 1 : 0.12);
        ambientRelations.scale.z = depthProgress;
        relationGroup.scale.z = depthProgress;
        wordObjects.forEach((object) => {
          object.root.position.z = THREE.MathUtils.lerp(
            object.root.position.z,
            0,
            reducedMotion ? 1 : 0.12
          );
          object.node.material.opacity *= reducedMotion ? 0 : 0.91;
          (object.label.material as THREE.SpriteMaterial).opacity *= reducedMotion ? 0 : 0.9;
        });
      } else {
        depthProgress = THREE.MathUtils.lerp(depthProgress, 1, reducedMotion ? 1 : 0.075);
        ambientRelations.scale.z = depthProgress;
        relationGroup.scale.z = depthProgress;
        wordObjects.forEach((object) => {
          const target = object.root.userData.originalPosition as THREE.Vector3;
          object.root.position.z = THREE.MathUtils.lerp(
            object.root.position.z,
            target.z,
            reducedMotion ? 1 : 0.075
          );
        });

        movement.set(0, 0, 0);
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();
        right.crossVectors(forward, worldUp).normalize();
        if (keys.has("KeyW")) movement.add(forward);
        if (keys.has("KeyS")) movement.sub(forward);
        if (keys.has("KeyD")) movement.add(right);
        if (keys.has("KeyA")) movement.sub(right);

        if (movement.lengthSq() > 0) {
          const accelerated = keys.has("ShiftLeft") || keys.has("ShiftRight");
          movement.normalize().multiplyScalar(delta * (accelerated ? 8.5 : 3.6));
          camera.position.add(movement);
          camera.position.x = THREE.MathUtils.clamp(camera.position.x, -11, 11);
          camera.position.y = THREE.MathUtils.clamp(camera.position.y, -5, 7);
          camera.position.z = THREE.MathUtils.clamp(camera.position.z, -12, 22);
        }

        if (!reducedMotion) {
          const selectedObject = wordObjects.get(selectedRef.current);
          if (selectedObject) {
            const pulse = 1.85 + Math.sin(now * 0.003) * 0.08;
            selectedObject.node.scale.setScalar(pulse);
          }
        }

        if (now - lastProximityCheck > 320) {
          lastProximityCheck = now;
          let nearestWord = "";
          let nearestDistance = Number.POSITIVE_INFINITY;
          wordObjects.forEach((object, word) => {
            const distance = camera.position.distanceTo(object.root.position);
            if (distance < nearestDistance) {
              nearestDistance = distance;
              nearestWord = word;
            }
          });
          if (nearestDistance < 3.4 && nearestWord !== selectedRef.current) {
            onSelect(nearestWord);
          }
        }
      }

      renderer.render(scene, camera);
    };

    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
      scene.traverse(disposeObject);
      sphereGeometry.dispose();
      hitGeometry.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
      sceneRef.current = null;
    };
  }, [onSelect, reducedMotion]);

  if (unsupported) {
    return (
      <div className="embedding-webgl-fallback" role="status">
        <p>A projeção 3D não está disponível neste dispositivo.</p>
        <div>
          {embeddingWords.map((item) => (
            <button key={item.word} type="button" onClick={() => onSelect(item.word)}>
              {item.word}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return <div className="embedding-three" ref={containerRef} />;
}
