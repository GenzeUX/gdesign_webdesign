'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type AmbientVariant = 'orbits' | 'network';

/** Two restrained environments share a lazy renderer and an interpolated scroll timeline. */
export function AmbientScene({ variant }: { variant: AmbientVariant }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    const section = element?.closest('section');
    if (!element || !section) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, innerWidth < 1024 ? 1 : 1.25));
    renderer.setClearColor(0x050507, 0);
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 30);
    camera.position.z = variant === 'orbits' ? 7.8 : 7;
    const group = new THREE.Group();
    scene.add(group);
    const geometries: THREE.BufferGeometry[] = [];
    const materials: {
      material: THREE.LineBasicMaterial | THREE.PointsMaterial;
      opacity: number;
    }[] = [];
    const textureData = new Uint8Array(32 * 32 * 4);
    for (let y = 0; y < 32; y++)
      for (let x = 0; x < 32; x++) {
        const offset = (y * 32 + x) * 4;
        textureData[offset] = textureData[offset + 1] = textureData[offset + 2] = 255;
        textureData[offset + 3] = Math.round(
          255 * Math.exp(-((x - 15.5) ** 2 + (y - 15.5) ** 2) / 34),
        );
      }
    const dotTexture = new THREE.DataTexture(textureData, 32, 32);
    dotTexture.needsUpdate = true;

    const points = (positions: number[], size: number, opacity: number, color = 0xc5a6ff) => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({
        size,
        color,
        opacity,
        map: dotTexture,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      group.add(new THREE.Points(geometry, material));
      geometries.push(geometry);
      materials.push({ material, opacity });
    };
    const line = (positions: number[], opacity: number, segments = false) => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      const material = new THREE.LineBasicMaterial({
        color: 0xc5a6ff,
        opacity,
        transparent: true,
        depthWrite: false,
      });
      group.add(
        segments ? new THREE.LineSegments(geometry, material) : new THREE.Line(geometry, material),
      );
      geometries.push(geometry);
      materials.push({ material, opacity });
    };

    if (variant === 'orbits') {
      for (let ring = 0; ring < 4; ring++) {
        const positions: number[] = [];
        for (let i = 0; i <= 180; i++) {
          const t = (i / 180) * Math.PI * 2;
          const twist = ring * 0.34;
          const x = Math.cos(t) * (2.15 - ring * 0.08);
          const y = Math.sin(t) * (1.6 + ring * 0.08);
          const z = Math.sin(t * 2 + twist) * 0.22;
          positions.push(
            x,
            y * Math.cos(twist) - z * Math.sin(twist),
            y * Math.sin(twist) + z * Math.cos(twist),
          );
        }
        line(positions, 0.4 - ring * 0.045);
        if (ring === 0) line(positions.slice(45 * 3, 78 * 3), 0.72);
      }
      points([2.15, 0, 0, -1.6, 1.05, 0.4, 0.5, -1.7, -0.3], 0.11, 0.8);
    } else {
      const nodes = [new THREE.Vector3(0, 0, 0)];
      for (let i = 0; i < 9; i++) {
        const t = (i / 9) * Math.PI * 2;
        nodes.push(
          new THREE.Vector3(
            Math.cos(t) * (1.5 + 0.2 * Math.sin(i)),
            Math.sin(t) * 1.65,
            Math.sin(t * 2 + 0.4) * 0.7,
          ),
        );
      }
      const links: number[] = [];
      for (let i = 1; i < nodes.length; i++) {
        links.push(...nodes[i].toArray(), ...nodes[i === nodes.length - 1 ? 1 : i + 1].toArray());
        if (i % 2) links.push(...nodes[0].toArray(), ...nodes[i].toArray());
      }
      links.push(
        ...nodes[2].toArray(),
        ...nodes[6].toArray(),
        ...nodes[4].toArray(),
        ...nodes[8].toArray(),
      );
      line(links, 0.33, true);
      points(
        nodes.slice(1).flatMap((node) => node.toArray()),
        0.14,
        0.9,
      );
      points([0, 0, 0], 0.25, 1, 0xe9ddff);
      points([0, 0, 0], 0.8, 0.13);
    }

    let frame = 0,
      active = false,
      lost = false,
      previous = 0;
    let sectionTop = 0,
      sectionHeight = 1,
      targetProgress = 0.5,
      progress = 0.5;
    const updateTarget = () => {
      targetProgress = THREE.MathUtils.clamp(
        (scrollY + innerHeight - sectionTop) / (sectionHeight + innerHeight),
        0,
        1,
      );
    };
    const resize = () => {
      const rect = section.getBoundingClientRect();
      sectionTop = rect.top + scrollY;
      sectionHeight = rect.height;
      renderer.setSize(element.clientWidth, element.clientHeight);
      camera.aspect = element.clientWidth / Math.max(element.clientHeight, 1);
      camera.updateProjectionMatrix();
      updateTarget();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(element);
    resizeObserver.observe(section);
    resizeObserver.observe(document.body);
    resize();
    progress = targetProgress;
    const render = (stamp: number) => {
      frame = 0;
      if (!active || document.hidden || lost) {
        previous = 0;
        return;
      }
      const dt = previous ? Math.max(0, Math.min((stamp - previous) / 1000, 0.06)) : 0.016;
      previous = stamp;
      progress += (targetProgress - progress) * (1 - Math.exp(-dt * 4));
      const phase = progress - 0.5;
      group.rotation.set(
        (variant === 'orbits' ? 0.78 : 0.16) + phase * 0.5,
        -0.3 + phase * 0.75,
        -0.22 + phase * 0.22,
      );
      group.position.z = phase * 0.55;
      group.position.y = phase * 0.25;
      materials.forEach(({ material, opacity }) => {
        material.opacity = opacity * (0.83 + Math.sin(progress * Math.PI) * 0.17);
      });
      renderer.render(scene, camera);
      element.dataset.ready = 'true';
      element.dataset.state = 'running';
      const measured = Number(element.dataset.progress || '-1');
      if (Math.abs(measured - progress) > 0.01) element.dataset.progress = progress.toFixed(3);
      frame = requestAnimationFrame(render);
    };
    const sync = () => {
      if (!active || document.hidden || lost) {
        cancelAnimationFrame(frame);
        frame = 0;
        previous = 0;
        element.dataset.state = lost ? 'fallback' : 'paused';
      } else if (!frame) frame = requestAnimationFrame(render);
    };
    const intersection = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      sync();
    });
    intersection.observe(element);
    const onLost = () => {
      lost = true;
      sync();
      renderer.domElement.remove();
      delete element.dataset.ready;
    };
    renderer.domElement.addEventListener('webglcontextlost', onLost);
    window.addEventListener('scroll', updateTarget, { passive: true });
    document.addEventListener('visibilitychange', sync);
    return () => {
      cancelAnimationFrame(frame);
      intersection.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('scroll', updateTarget);
      document.removeEventListener('visibilitychange', sync);
      renderer.domElement.removeEventListener('webglcontextlost', onLost);
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach(({ material }) => material.dispose());
      dotTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      delete element.dataset.ready;
      delete element.dataset.state;
      delete element.dataset.progress;
    };
  }, [variant]);

  return <div className="ambient-canvas" ref={host} data-variant={variant} />;
}
