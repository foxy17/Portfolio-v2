'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

type Timeline = {
  LAND_AT: number; OPTIC_AT: number; RISE_AT: number; DROP_SECONDS: number;
  STEP_SECONDS: number; WALK_SECONDS: number; COIL_START: number; STRIKE_START: number; IMPACT_AT: number; IMPACT_HOLD: number;
};
type Props = {
  run: number; timeline: Timeline;
  onTime: (elapsed: number) => void;
  onPlayback: (elapsed: number, playing: boolean) => void;
  onError: () => void;
  onProgress: (progress: number) => void;
  onReady: () => void;
};
const MODEL_BYTES = 1792804;
const clamp = THREE.MathUtils.clamp;
const smooth = (x: number) => { const t = clamp(x, 0, 1); return t * t * (3 - 2 * t); };
const X = new THREE.Vector3(1, 0, 0);
const Y = new THREE.Vector3(0, 1, 0);
const Z = new THREE.Vector3(0, 0, 1);
let loggedRig = false;

// World-space ankle paths stay fixed throughout stance, including while the root advances.
function footPath(time: number, side: number, step: number, stride: number) {
  let z = 0;
  let lift = 0;
  let roll = 0;
  for (let i = side; i < 4; i += 2) {
    const u = clamp((time - i * step) / step, 0, 1);
    const swing = smooth((u - 0.12) / 0.88);
    const end = (i + 1) * stride;
    z = THREE.MathUtils.lerp(z, end, swing);
    if (u > 0 && u < 1) {
      lift = Math.sin(Math.PI * clamp((u - 0.12) / 0.88, 0, 1)) * 0.115;
      roll = Math.sin(u * Math.PI * 2) * 0.22;
    }
  }
  return { z, lift, roll };
}

export default function TitanScene({ run, timeline: T, onTime, onPlayback, onError, onProgress, onReady }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const runRef = useRef(run);
  const reset = useRef<((nextRun: number) => void) | null>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      onError();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x100f13, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x100f13, 0.13);
    const camera = new THREE.PerspectiveCamera(75, 1, 0.015, 30);
    const distance = 1 / (2 * Math.tan(THREE.MathUtils.degToRad(75 / 2)) * 0.7);
    const approach = distance * (1 - 0.7 / 0.9);
    const stride = approach / 4;
    camera.position.set(0, 0.5, distance + 0.18);
    const cameraHome = camera.position.clone();
    camera.lookAt(0, camera.position.y, 0);
    scene.add(new THREE.HemisphereLight(0xbedbff, 0x29212b, 2));
    const key = new THREE.DirectionalLight(0xffe2be, 4);
    key.position.set(-1, 3, 2);
    scene.add(key);
    for (const side of [-1, 1]) {
      const rim = new THREE.DirectionalLight(0x86b7ff, 3);
      rim.position.set(side * 2, 1.5, -1);
      scene.add(rim);
    }
    const dust = new THREE.Mesh(
      new THREE.RingGeometry(0.15, 0.35, 48),
      new THREE.MeshBasicMaterial({ color: 0xb9b9ab, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }),
    );
    dust.rotation.x = -Math.PI / 2;
    dust.position.y = 0.012;
    scene.add(dust);
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.25, 32),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3, depthWrite: false }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.scale.y = 0.6;
    shadow.position.y = 0.002;
    scene.add(shadow);
    const root = new THREE.Group();
    scene.add(root);
    let disposed = false;
    let visible = false;
    let loaded = false;
    let frame = 0;
    let last = 0;
    let elapsed = 0;
    let playing = false;
    let settled = false;
    let pose: ((time: number) => void) | undefined;
    let fitCamera = () => {};
    const punchAt = T.DROP_SECONDS + T.WALK_SECONDS;
    const hitAt = punchAt + T.IMPACT_AT;
    const endAt = hitAt + 1.02;
    const disposeObject = (object: THREE.Object3D) => {
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      const textures = new Set<THREE.Texture>();
      object.traverse((node) => {
        if (!(node instanceof THREE.Mesh)) return;
        geometries.add(node.geometry);
        (Array.isArray(node.material) ? node.material : [node.material]).forEach((material) => {
          materials.add(material);
          Object.values(material).forEach((value) => { if (value instanceof THREE.Texture) textures.add(value); });
        });
        if (node instanceof THREE.SkinnedMesh) node.skeleton.dispose();
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => { texture.dispose(); if (typeof ImageBitmap !== 'undefined' && texture.source.data instanceof ImageBitmap) texture.source.data.close(); });
    };
    const tick = (now: number) => {
      frame = 0;
      if (disposed || !loaded || !visible || document.hidden) return;
      if (runRef.current > 0 && !settled) {
        if (!playing) { playing = true; last = now; onPlayback(elapsed, true); }
        elapsed = Math.min(endAt, elapsed + (now - last) / 1000);
        last = now;
        pose?.(elapsed);
        onTime(elapsed);
      }
      renderer.render(scene, camera);
      if (elapsed >= endAt) {
        settled = true;
        playing = false;
        onPlayback(elapsed, false);
      }
      if (runRef.current > 0 && !settled) frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!visible || document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        if (playing) { playing = false; onPlayback(elapsed, false); }
      } else if (!frame && loaded) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; wake(); });
    observer.observe(element);
    document.addEventListener('visibilitychange', wake);
    const resize = new ResizeObserver(() => {
      const { width, height } = element.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      fitCamera();
      pose?.(elapsed);
      wake();
    });
    resize.observe(element);
    const fail = (error: unknown) => {
      if (disposed) return;
      cancelAnimationFrame(frame);
      loaded = false;
      onPlayback(elapsed, false);
      console.error('BT intro unavailable:', error);
      onError();
    };
    const contextLost = (event: Event) => { event.preventDefault(); fail('WebGL context lost'); };
    renderer.domElement.addEventListener('webglcontextlost', contextLost);
    reset.current = (nextRun) => {
      runRef.current = nextRun;
      if (playing) onPlayback(elapsed, false);
      elapsed = 0;
      playing = false;
      settled = false;
      pose?.(0);
      wake();
    };
    new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load('/models/bt-7274.glb', (gltf) => {
      if (disposed) { disposeObject(gltf.scene); return; }
      root.add(gltf.scene);
      try {
        gltf.scene.traverse((node) => { if (node.name === 'Plane' || node.name.startsWith('Plane_')) node.visible = false; });
        // Exclude the supplied ground from normalization as well as rendering.
        const bounds = new THREE.Box3();
        gltf.scene.updateMatrixWorld(true);
        gltf.scene.traverseVisible((node) => { if (node instanceof THREE.Mesh) bounds.expandByObject(node); });
        const height = bounds.getSize(new THREE.Vector3()).y;
        if (!Number.isFinite(height) || height <= 0) throw new Error('Invalid BT model bounds');
        gltf.scene.scale.multiplyScalar(1 / height);
        gltf.scene.position.y -= bounds.min.y / height;
        root.updateMatrixWorld(true);
        const bones: THREE.Bone[] = [];
        const eyes: THREE.MeshStandardMaterial[] = [];
        gltf.scene.traverse((node) => {
          if (node instanceof THREE.Bone) bones.push(node);
          if (node instanceof THREE.Mesh) {
            node.frustumCulled = false; // Animated limbs can leave the bind-pose bounds.
            (Array.isArray(node.material) ? node.material : [node.material]).forEach((m) => {
              if (m instanceof THREE.MeshStandardMaterial && m.name.toLowerCase().includes('eye_cine') && !eyes.includes(m)) {
                m.emissive.set(0x90dcff);
                eyes.push(m);
              }
            });
          }
        });
        const bone = (prefix: string) => {
          const found = bones.find((b) => b.name.startsWith(`${prefix}_`));
          if (!found) throw new Error(`Missing BT joint: ${prefix}`);
          return found;
        };
        const rest = new Map(bones.map((b) => [b, { q: b.quaternion.clone(), p: b.position.clone(), world: b.getWorldQuaternion(new THREE.Quaternion()) }]));
        const position = (b: THREE.Object3D) => b.getWorldPosition(new THREE.Vector3());
        const hip = bone('def_c_hip');
        const spine = ['A', 'B', 'C'].map((part) => bone(`def_c_spine${part}`));
        const neck = bone('def_c_neck1');
        const optic = bone('def_c_eye_rotate');
        const eyeball = bone('def_c_eyeball');
        const detached = bone('def_c_eye_detached');
        const outerEye = bone('def_c_eye_outer');
        const legs = ['l', 'r'].map((side) => ({
          thigh: bone(`def_${side}_thigh`), low: bone(`def_${side}_thighLow`), knee: bone(`def_${side}_knee`),
          ankle: bone(`def_${side}_ankle`), ball: bone(`def_${side}_ball`), heel: bone(`def_${side}_heel`),
        }));
        const arms = ['l', 'r'].map((side) => ({
          clav: bone(`def_${side}_clav`), shoulder: bone(`def_${side}_shoulder`), elbow: bone(`def_${side}_elbow`), wrist: bone(`def_${side}_wrist`),
        }));
        const fingers = bones.filter((b) => /^def_[lr]_fin(Thumb|Index|Mid|Ring)[ABC]_/.test(b.name));
        // Axes are expressed in the joint's rest frame, not assumed from its name.
        const axes = new Map(bones.map((b) => {
          const inverse = rest.get(b)!.world.clone().invert();
          return [b, [X.clone().applyQuaternion(inverse), Y.clone().applyQuaternion(inverse), Z.clone().applyQuaternion(inverse)]];
        }));
        const offset = (b: THREE.Bone, axis: THREE.Vector3, angle: number) => b.quaternion.copy(rest.get(b)!.q).multiply(new THREE.Quaternion().setFromAxisAngle(axis, angle));
        const worldOrientation = (b: THREE.Bone, desired: THREE.Quaternion) => {
          const local = b.parent!.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(desired);
          const delta = rest.get(b)!.q.clone().invert().multiply(local);
          b.quaternion.copy(rest.get(b)!.q).multiply(delta);
          b.updateWorldMatrix(false, true);
        };
        const aim = (b: THREE.Bone, endpoint: THREE.Bone, target: THREE.Vector3) => {
          const origin = position(b);
          const from = position(endpoint).sub(origin).normalize();
          const to = target.clone().sub(origin).normalize();
          const turn = new THREE.Quaternion().setFromUnitVectors(from, to);
          worldOrientation(b, turn.multiply(b.getWorldQuaternion(new THREE.Quaternion())));
        };
        const solve = (upper: THREE.Bone, middle: THREE.Bone, end: THREE.Bone, target: THREE.Vector3, pole: THREE.Vector3) => {
          const start = position(upper);
          const a = start.distanceTo(position(middle));
          const b = position(middle).distanceTo(position(end));
          const direction = target.clone().sub(start);
          const d = clamp(direction.length(), Math.abs(a - b) + 0.0001, a + b - 0.0001);
          direction.normalize();
          const bend = pole.clone().sub(start);
          bend.addScaledVector(direction, -bend.dot(direction)).normalize();
          const along = (a * a + d * d - b * b) / (2 * d);
          const joint = start.clone().addScaledVector(direction, along).addScaledVector(bend, Math.sqrt(Math.max(0, a * a - along * along)));
          aim(upper, middle, joint);
          aim(middle, end, target);
        };
        const ankleY = legs.map((l) => position(l.ankle).y);
        const footWorld = legs.map((l) => rest.get(l.ankle)!.world.clone());
        const handWorld = arms.map((a) => rest.get(a.wrist)!.world.clone());
        const coilHand = new THREE.Vector3();
        const neckFollow = rest.get(neck)!.world.clone();
        const opticFollow = rest.get(optic)!.world.clone();
        const eyeFollow = rest.get(eyeball)!.world.clone();
        let lastOpticTime = -Infinity;
        const eyeBones = [neck, optic, detached, eyeball, outerEye];
        const restForward = Z.clone().applyQuaternion(rest.get(eyeball)!.world);
        const opticalAxes = new Map(eyeBones.map((b) => [b, restForward.clone().applyQuaternion(rest.get(b)!.world.clone().invert())]));
        const orientForward = (b: THREE.Bone, localAxis: THREE.Vector3, direction: THREE.Vector3) =>
          new THREE.Quaternion().setFromUnitVectors(localAxis.clone().applyQuaternion(rest.get(b)!.world), direction).multiply(rest.get(b)!.world);
        const logEyePose = (label: string) => {
          console.table(eyeBones.map((b) => {
            const q = b.getWorldQuaternion(new THREE.Quaternion());
            const viewer = cameraHome.clone().sub(position(b)).normalize();
            const forward = opticalAxes.get(b)!.clone().applyQuaternion(q);
            const vector = (v: THREE.Vector3) => v.toArray().map((n) => +n.toFixed(3)).join(', ');
            return { pose: label, bone: b.name, localOpticalAxis: vector(opticalAxes.get(b)!),
              worldX: vector(X.clone().applyQuaternion(q)), worldY: vector(Y.clone().applyQuaternion(q)), worldZ: vector(Z.clone().applyQuaternion(q)),
              opticalForward: vector(forward), toCamera: vector(viewer), angleDegrees: +THREE.MathUtils.radToDeg(forward.angleTo(viewer)).toFixed(2),
              mountLocal: vector(b.position), mountDrift: b.position.distanceTo(rest.get(b)!.p) };
          }));
        };
        const debug = process.env.NODE_ENV !== 'production';
        if (debug && !loggedRig) {
          loggedRig = true;
          logEyePose('rest');
          console.table([hip, ...spine, neck, optic, eyeball, ...legs.flatMap((l) => [l.thigh, l.low, l.knee, l.ankle, l.ball]), ...arms.flatMap((a) => [a.clav, a.shoulder, a.elbow, a.wrist]), ...fingers].map((b) => ({
            joint: b.name, rest: rest.get(b)!.q.toArray().map((v) => +v.toFixed(3)).join(', '),
            pitchAxis: axes.get(b)![0].toArray().map((v) => +v.toFixed(3)).join(', '),
            yawAxis: axes.get(b)![1].toArray().map((v) => +v.toFixed(3)).join(', '),
            fingerCurlAxis: fingers.includes(b) ? 'local Z' : '',
          })));
          console.assert(T.WALK_SECONDS === 4 * T.STEP_SECONDS && T.LAND_AT < T.OPTIC_AT && T.OPTIC_AT < T.RISE_AT && T.RISE_AT < T.DROP_SECONDS && T.COIL_START < T.STRIKE_START && T.STRIKE_START < T.IMPACT_AT, 'BT timeline ordering / four footfalls');
          for (let i = 0; i < 4; i++) {
            const a = footPath((i + 0.3) * T.STEP_SECONDS, 1 - i % 2, T.STEP_SECONDS, stride);
            const b = footPath((i + 0.7) * T.STEP_SECONDS, 1 - i % 2, T.STEP_SECONDS, stride);
            console.assert(a.z === b.z && a.lift === 0 && b.lift === 0, 'BT stance foot must stay planted');
            console.assert(Math.abs(footPath((i + 1) * T.STEP_SECONDS, i % 2, T.STEP_SECONDS, stride).z - (i + 1) * stride) < 1e-6, 'BT footfall position');
          }
        }
        pose = (time) => {
          bones.forEach((b) => { b.quaternion.copy(rest.get(b)!.q); b.position.copy(rest.get(b)!.p); });
          const rise = smooth((time - T.RISE_AT) / (T.DROP_SECONDS - T.RISE_AT));
          const landing = 1 - rise;
          const walk = clamp(time - T.DROP_SECONDS, 0, T.WALK_SECONDS);
          const stepIndex = Math.min(3, Math.floor(walk / T.STEP_SECONDS));
          const u = clamp(walk / T.STEP_SECONDS - stepIndex, 0, 1);
          const walking = time >= T.DROP_SECONDS && time < punchAt;
          let footfallDrop = 0;
          let armLag = 0;
          let armJolt = 0;
          let eyeSaccade = 0;
          for (let i = 1; i <= 4; i++) {
            const age = time - T.DROP_SECONDS - i * T.STEP_SECONDS;
            if (age >= 0) {
              footfallDrop -= 0.018 * Math.exp(-age * 18);
              armLag += (i % 2 ? 1 : -1) * Math.sin(age * 23) * Math.exp(-age * 8) * 0.035;
              armJolt += Math.exp(-age * 28) * 0.018;
              eyeSaccade += (i % 2 ? 1 : -1) * Math.sin(age * 42) * Math.exp(-age * 20) * 0.018;
            }
          }
          const pull = smooth((time - punchAt) / T.COIL_START);
          const stroke = clamp((time - punchAt - T.STRIKE_START) / (T.IMPACT_AT - T.STRIKE_START), 0, 1);
          const strike = stroke * stroke;
          const recoil = smooth((time - hitAt - T.IMPACT_HOLD) / 0.16);
          const open = smooth((time - hitAt - T.IMPACT_HOLD - 0.18) / 0.65);
          const coilAge = time - punchAt - T.COIL_START;
          const tremble = coilAge >= 0 && time < punchAt + T.STRIKE_START ? Math.sin(coilAge * 85) * 0.0015 * Math.sin(Math.PI * coilAge / (T.STRIKE_START - T.COIL_START)) : 0;
          // Root travel happens while the opposite foot is planted; swing endpoints remain in world space.
          root.position.set(walking ? Math.sin(u * Math.PI) * (stepIndex % 2 ? 1 : -1) * 0.018 : 0,
            -0.28 * landing + footfallDrop + (walking ? Math.sin(u * Math.PI) * 0.018 : 0),
            (stepIndex + smooth((u - 0.12) / 0.88)) * stride);
          if (time < T.DROP_SECONDS) root.position.z = 0;
          if (time >= punchAt) {
            root.position.z = approach;
            root.position.x = -0.025 * pull + 0.04 * strike;
            root.position.y -= 0.035 * pull - 0.02 * strike;
          }
          if (time < T.LAND_AT) root.position.y += 2.7 * (1 - (time / T.LAND_AT) ** 2);
          offset(hip, axes.get(hip)![0], 0.48 * landing);
          spine.forEach((b, i) => {
            const share = i === 2 ? 0.4 : 0.3;
            const pitch = 0.12 * landing + (-0.1 * pull + 0.28 * strike - 0.08 * open) * share;
            const twist = (-THREE.MathUtils.degToRad(23) * pull + THREE.MathUtils.degToRad(34) * strike - 0.08 * open) * share;
            b.quaternion.copy(rest.get(b)!.q)
              .multiply(new THREE.Quaternion().setFromAxisAngle(axes.get(b)![0], pitch))
              .multiply(new THREE.Quaternion().setFromAxisAngle(axes.get(b)![1], twist));
          });
          const awake = smooth((time - T.OPTIC_AT) / 0.25);
          offset(neck, axes.get(neck)![0], landing * (0.14 - awake * 0.24));
          root.updateMatrixWorld(true);
          legs.forEach((l, i) => {
            const path = footPath(walk, i, T.STEP_SECONDS, stride);
            const x = i === 0 ? 0.15 : -0.15;
            const fallHeight = time < T.LAND_AT ? root.position.y + 0.28 : 0;
            const target = new THREE.Vector3(x, ankleY[i] + path.lift + fallHeight + landing * (i === 0 ? 0 : 0.025), path.z + (i === 0 ? 0.11 : -0.13) * landing);
            offset(l.low, axes.get(l.low)![0], path.lift * 1.2 + landing * 1.15 + pull * 0.1);
            root.updateMatrixWorld(true);
            solve(l.thigh, l.knee, l.ankle, target, new THREE.Vector3(x, 0.3, 1));
            const pivot = new THREE.Quaternion().setFromAxisAngle(Y, i === 1 ? strike * 0.28 : 0);
            worldOrientation(l.ankle, pivot.multiply(new THREE.Quaternion().setFromAxisAngle(X, path.roll)).multiply(footWorld[i]));
            offset(l.ball, axes.get(l.ball)![0], -path.roll * 0.7);
            offset(l.heel, axes.get(l.heel)![0], path.roll * 0.35);
          });
          arms.forEach((a, i) => {
            const side = i === 0 ? 1 : -1;
            offset(a.clav, axes.get(a.clav)![1], i === 1 ? -pull * 0.08 + strike * 0.2 : pull * 0.08 - strike * 0.12);
            root.updateMatrixWorld(true);
            const shoulder = position(a.shoulder);
            const swing = clamp(-side * (Math.sin((walk - 0.12) / T.STEP_SECONDS * Math.PI) * THREE.MathUtils.degToRad(10) + armLag) * smooth(walk / 0.22) + armJolt * side, -THREE.MathUtils.degToRad(12), THREE.MathUtils.degToRad(12));
            const flex = THREE.MathUtils.degToRad(clamp(20 + Math.sin(swing) * 24 + armJolt * 40, 15, 25));
            const upperDirection = new THREE.Vector3(side * 0.22, -Math.cos(swing), Math.sin(swing)).normalize();
            const lowerDirection = upperDirection.clone().applyAxisAngle(X, -flex);
            const upperLength = shoulder.distanceTo(position(a.elbow));
            const lowerLength = position(a.elbow).distanceTo(position(a.wrist));
            const heavyElbow = shoulder.clone().addScaledVector(upperDirection, upperLength);
            const heavyHand = heavyElbow.clone().addScaledVector(lowerDirection, lowerLength);
            const hand = new THREE.Vector3(side * 0.29, 0.43 - landing * 0.1, root.position.z + 0.06).lerp(heavyHand, rise);
            if (time < T.LAND_AT) hand.y += root.position.y + 0.28;
            if (i === 1) {
              hand.lerp(new THREE.Vector3(-0.23, 0.04, 0.22), landing);
              const windHand = new THREE.Vector3(-0.32, shoulder.y - 0.02 + tremble, shoulder.z + 0.235);
              hand.lerp(windHand, pull);
              if (stroke > 0) {
                const hitHand = new THREE.Vector3(-0.015, cameraHome.y + 0.015, cameraHome.z - 0.14);
                hand.copy(coilHand).lerp(hitHand, strike);
                hand.z -= recoil * 0.09 + open * 0.12;
                hand.y -= recoil * 0.025 + open * 0.1;
                // Telescope only as the straight stroke exceeds the rig's natural reach.
                const upper = shoulder.distanceTo(position(a.elbow));
                const forearm = position(a.elbow).distanceTo(position(a.wrist));
                a.wrist.position.multiplyScalar(Math.max(1, (shoulder.distanceTo(hand) - upper * 0.99) / forearm));
                root.updateMatrixWorld(true);
              }
            } else {
              hand.lerp(new THREE.Vector3(0.25, shoulder.y - 0.05, approach + 0.26), pull);
              hand.lerp(new THREE.Vector3(0.31, 0.5, approach - 0.035), strike);
            }
            // An outboard, forward elbow pole keeps the coiled arm visible beside the hull.
            const elbowPole = new THREE.Vector3(side * 0.65, shoulder.y - 0.12, root.position.z + 0.3).lerp(heavyElbow, rise * (1 - pull));
            solve(a.shoulder, a.elbow, a.wrist, hand, elbowPole);
            const wristRest = handWorld[i];
            const hangingHand = new THREE.Quaternion().setFromUnitVectors(X.clone().applyQuaternion(wristRest), lowerDirection).multiply(wristRest);
            if (i === 1) {
              const forward = X.clone().applyQuaternion(wristRest);
              const punchHand = new THREE.Quaternion().setFromUnitVectors(forward, Z).multiply(wristRest);
              const palmUp = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(Z, Y, X.clone().negate()));
              worldOrientation(a.wrist, wristRest.clone().slerp(hangingHand, rise).slerp(punchHand.slerp(palmUp, open), pull));
            } else worldOrientation(a.wrist, wristRest.clone().slerp(hangingHand, rise));
          });
          fingers.forEach((b) => {
            const right = b.name.startsWith('def_r_');
            // Right fingers are pre-curled in this Source rig; local Z unfolds the mirrored chain.
            offset(b, Z, right ? (0.5 * (1 - pull) + open) * (b.name.includes('Thumb') ? -0.55 : 1.35) : 0.35 * (1 - pull));
          });
          root.updateMatrixWorld(true);
          const dt = time - lastOpticTime;
          const snapAim = dt <= 0 || dt > 0.25;
          const follow = (current: THREE.Quaternion, goal: THREE.Quaternion, speed: number) => {
            if (snapAim) current.copy(goal);
            else current.slerp(goal, 1 - Math.exp(-dt * speed));
          };
          // Keep the neck socket fixed; turn its forward axis so the carrier stays centred in the hatch.
          const neckDirection = cameraHome.clone().sub(position(neck)).setY(-0.08 * landing).normalize();
          const neckGoal = neck.getWorldQuaternion(new THREE.Quaternion()).slerp(orientForward(neck, Z, neckDirection), awake);
          follow(neckFollow, neckGoal, 14);
          worldOrientation(neck, neckFollow);
          const viewer = cameraHome.clone().sub(position(eyeball)).normalize();
          const looking = new THREE.Vector3(0, -0.5, 1).normalize().lerp(viewer, awake).normalize();
          // The lens faces local +Z; its carrier's optical axis includes the child's rest rotation.
          follow(opticFollow, orientForward(optic, opticalAxes.get(optic)!, looking), 18);
          worldOrientation(optic, opticFollow);
          const eyeDirection = cameraHome.clone().sub(position(eyeball)).normalize();
          const eyeLooking = new THREE.Vector3(0, -0.5, 1).normalize().lerp(eyeDirection, awake).normalize()
            .applyAxisAngle(Y, eyeSaccade * awake);
          follow(eyeFollow, orientForward(eyeball, Z, eyeLooking), 40);
          worldOrientation(eyeball, eyeFollow);
          const bezelGoal = eyeFollow.clone().multiply(rest.get(eyeball)!.world.clone().invert()).multiply(rest.get(outerEye)!.world);
          worldOrientation(outerEye, bezelGoal);
          lastOpticTime = time;
          if (debug && time >= T.RISE_AT && time < punchAt + T.STRIKE_START) {
            const forward = Z.clone().applyQuaternion(eyeball.getWorldQuaternion(new THREE.Quaternion()));
            const toCamera = cameraHome.clone().sub(position(eyeball)).normalize();
            console.assert(forward.angleTo(toCamera) < THREE.MathUtils.degToRad(8), 'BT lens local +Z must face camera within 8 degrees');
            console.assert(eyeBones.every((b) => b.position.distanceTo(rest.get(b)!.p) < 1e-6), 'BT eye assembly must remain attached to its centred socket');
          }
          const flicker = time < T.OPTIC_AT ? 0 : time < T.OPTIC_AT + 0.25 ? (Math.sin(time * 115) > 0 ? 4.2 : 0.08) : 3.5;
          eyes.forEach((m) => { m.emissiveIntensity = flicker; });
          const dustAge = time - T.LAND_AT;
          dust.visible = dustAge >= 0 && dustAge < 0.85;
          dust.scale.setScalar(1 + clamp(dustAge, 0, 0.85) * 4);
          dust.material.opacity = Math.max(0, 0.35 * (1 - dustAge / 0.85));
          shadow.position.z = root.position.z;
          shadow.visible = time >= T.LAND_AT;
          const landShake = dustAge >= 0 ? Math.exp(-dustAge * 12) * 0.022 : 0;
          const hitAge = time - hitAt;
          const hitShake = hitAge >= 0 ? Math.exp(-hitAge * 15) * 0.04 : 0;
          camera.position.copy(cameraHome).add(new THREE.Vector3(Math.sin(time * 139) * (landShake + hitShake), Math.cos(time * 171) * (landShake + hitShake), 0));
          renderer.domElement.style.opacity = String(1 - 0.6 * smooth((time - hitAt - 0.2) / 0.8));
          root.visible = runRef.current > 0;
          root.updateMatrixWorld(true);
        };
        // Fit the posed vertices across late walk and wind-up, before any fist crosses the frame.
        const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 0.85;
        let upperEnvelope = -Infinity;
        let lowerEnvelope = Infinity;
        let nearestVertex = -Infinity;
        const vertex = new THREE.Vector3();
        const framingTimes = [T.DROP_SECONDS];
        for (let i = 0; i <= 8; i++) framingTimes.push(punchAt - T.STEP_SECONDS + T.STEP_SECONDS * i / 8);
        for (let i = 1; i <= 8; i++) framingTimes.push(punchAt + T.COIL_START * i / 8);
        framingTimes.push(punchAt + T.STRIKE_START - 0.0001);
        for (const time of framingTimes) {
          pose(time);
          root.visible = true;
          root.traverseVisible((node) => {
            if (!(node instanceof THREE.Mesh)) return;
            const count = node.geometry.getAttribute('position').count;
            for (let i = 0; i < count; i++) {
              node.getVertexPosition(i, vertex).applyMatrix4(node.matrixWorld);
              upperEnvelope = Math.max(upperEnvelope, vertex.y + vertex.z * tangent);
              lowerEnvelope = Math.min(lowerEnvelope, vertex.y - vertex.z * tangent);
              nearestVertex = Math.max(nearestVertex, vertex.z);
            }
          });
        }
        fitCamera = () => {
          const { width, height } = element.getBoundingClientRect();
          if (width > 0 && height > 0) camera.aspect = width / height;
          cameraHome.set(0, (upperEnvelope + lowerEnvelope) / 2, Math.max(nearestVertex + camera.near, (upperEnvelope - lowerEnvelope) / (2 * tangent)) + 0.008);
          camera.position.copy(cameraHome);
          camera.lookAt(0, cameraHome.y, 0);
          camera.updateProjectionMatrix();
        };
        fitCamera();
        pose(punchAt - 0.0001);
        if (debug) arms.forEach((arm) => {
          const elbow = position(arm.elbow);
          const flex = Math.PI - position(arm.shoulder).sub(elbow).angleTo(position(arm.wrist).sub(elbow));
          console.assert(flex >= THREE.MathUtils.degToRad(14.5) && flex <= THREE.MathUtils.degToRad(25.5), 'BT hanging arm must keep a slight elbow bend');
        });
        if (debug) logEyePose('late walk aimed');
        pose(punchAt + T.COIL_START);
        coilHand.copy(position(arms[1].wrist));
        if (debug) {
          logEyePose('coiled aimed');
          const elbow = position(arms[1].elbow);
          const bend = position(arms[1].shoulder).sub(elbow).angleTo(coilHand.clone().sub(elbow));
          console.assert(bend >= THREE.MathUtils.degToRad(100) && bend <= THREE.MathUtils.degToRad(110), 'BT coiled elbow must stay bent beside the hull');
          console.assert(Math.abs(T.IMPACT_AT - T.STRIKE_START - 0.2) < 1e-6, 'BT straight punch must span 0.20 seconds');
        }
        pose(0);
        loaded = true;
        onProgress(1);
        onReady();
        wake();
      } catch (error) { fail(error); }
    }, (event) => {
      if (!disposed) onProgress(Math.min(0.99, event.loaded / (event.total || MODEL_BYTES)));
    }, fail);
    return () => {
      disposed = true;
      reset.current = null;
      cancelAnimationFrame(frame);
      onPlayback(elapsed, false);
      observer.disconnect();
      resize.disconnect();
      document.removeEventListener('visibilitychange', wake);
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      disposeObject(scene);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [T, onTime, onPlayback, onError, onProgress, onReady]);
  useEffect(() => { reset.current?.(run); }, [run]);
  return <div ref={host} className="h-full w-full" />;
}
