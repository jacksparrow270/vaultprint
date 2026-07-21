import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Scene 1 — The Unveiling.
 * A procedurally-modelled VaultPrint kiosk sits in absolute darkness.
 * A virtual spotlight tracks the cursor, raking across brushed-aluminum
 * and matte-glass materials to reveal the hardware as the user explores.
 *
 * Built from primitive geometry (no external GLB dependency) so it loads
 * instantly and stays razor sharp at any resolution.
 */
export function HeroCanvas() {
  const mount = useRef(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(38, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.set(0, 1.2, 9);
    camera.lookAt(0, 0.6, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement);

    // ---- Materials -------------------------------------------------
    const aluminum = new THREE.MeshStandardMaterial({
      color: 0x2a2a2e,
      metalness: 1.0,
      roughness: 0.34,
    });
    const matteGlass = new THREE.MeshStandardMaterial({
      color: 0x050506,
      metalness: 0.2,
      roughness: 0.16,
    });
    const bezel = new THREE.MeshStandardMaterial({
      color: 0x0c0c0e,
      metalness: 0.9,
      roughness: 0.42,
    });
    const laserMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 2.4,
      metalness: 0,
      roughness: 1,
    });

    const kiosk = new THREE.Group();

    // Main tower body
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 4.2, 1.1), aluminum);
    body.position.y = 0.1;
    kiosk.add(body);

    // Beveled front panel (matte glass screen)
    const screen = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.5, 0.08), matteGlass);
    screen.position.set(0, 0.7, 0.56);
    kiosk.add(screen);

    // Screen bezel frame
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.86, 2.66, 0.06), bezel);
    frame.position.set(0, 0.7, 0.53);
    kiosk.add(frame);

    // Laser accent status line
    const laserLine = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.02, 0.02), laserMat);
    laserLine.position.set(0, -0.75, 0.6);
    kiosk.add(laserLine);

    // Secure output tray slot
    const tray = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.12, 0.2), bezel);
    tray.position.set(0, -1.35, 0.5);
    kiosk.add(tray);

    // Token scanner puck
    const scanner = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.1, 48), bezel);
    scanner.rotation.x = Math.PI / 2;
    scanner.position.set(0.6, -0.75, 0.6);
    kiosk.add(scanner);
    const scannerRing = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.012, 16, 48), laserMat);
    scannerRing.position.set(0.6, -0.75, 0.63);
    kiosk.add(scannerRing);

    // Base plinth
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.3, 1.4), bezel);
    base.position.y = -2.15;
    kiosk.add(base);

    // Reflective floor to catch spotlight
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.8, roughness: 0.5 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.3;
    scene.add(floor);

    kiosk.rotation.y = -0.35;
    scene.add(kiosk);

    // ---- Lighting: the darkness + the cursor spotlight -------------
    const ambient = new THREE.AmbientLight(0x0a0a12, 0.6);
    scene.add(ambient);

    // Subtle cyan rim so silhouette never fully disappears
    const rim = new THREE.DirectionalLight(0x0093a8, 0.5);
    rim.position.set(-6, 3, -2);
    scene.add(rim);

    // The spotlight that follows the cursor
    const spot = new THREE.SpotLight(0xffffff, 900, 26, Math.PI / 6, 0.45, 1.4);
    spot.position.set(0, 3, 8);
    const spotTarget = new THREE.Object3D();
    scene.add(spotTarget);
    spot.target = spotTarget;
    scene.add(spot);

    // Cyan accent point that trails the cursor for cryptographic mood
    const accent = new THREE.PointLight(0x00f0ff, 40, 14, 2);
    accent.position.set(0, 1, 5);
    scene.add(accent);

    // ---- Interaction ----------------------------------------------
    const pointer = new THREE.Vector2(0, 0);
    const target = new THREE.Vector3();

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);

    // ---- Render loop ----------------------------------------------
    let raf;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();

      // Spotlight orbits toward cursor position in world space
      target.set(pointer.x * 4.5, pointer.y * 3 + 0.6, 2.4);
      spot.position.lerp(new THREE.Vector3(pointer.x * 6, pointer.y * 4 + 3, 8), 0.06);
      spotTarget.position.lerp(target, 0.08);
      accent.position.lerp(new THREE.Vector3(pointer.x * 5, pointer.y * 3.4 + 1, 5), 0.05);

      // Gentle idle breathing rotation
      const baseRot = -0.35 + pointer.x * 0.28;
      kiosk.rotation.y += (baseRot - kiosk.rotation.y) * 0.05;
      kiosk.rotation.x = Math.sin(t * 0.4) * 0.015 - pointer.y * 0.08;

      // Pulsing laser accents
      laserMat.emissiveIntensity = 2 + Math.sin(t * 2.2) * 0.6;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    if (!prefersReduced) {
      animate();
    } else {
      renderer.render(scene, camera);
    }

    // ---- Resize ----------------------------------------------------
    const onResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mount} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
