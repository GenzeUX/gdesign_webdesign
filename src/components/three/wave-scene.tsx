'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uDpr;
  uniform float uHalo;
  attribute float aSeed;
  varying float vEnergy;
  varying float vTint;
  varying float vAcross;
  varying float vFlowX;
  void main() {
    float x = position.x;
    float across = position.y;
    float strand = floor(aSeed * 6.0);
    float phase = strand * 0.73;
    float t = uTime * 0.16;
    float envelope = exp(-pow(x * 0.76, 4.0)) * (1.0 - smoothstep(0.72, 1.0, abs(x)));
    float sweep = sin(x * 2.65 + phase + t) * 0.76;
    sweep += sin(x * 1.55 - phase * 0.75 - t * 0.7) * 0.34;
    float twist = x * 1.6 + phase * 0.9 + t * 0.42;
    float width = (0.48 + 0.18 * sin(x * 2.0 + phase)) * envelope;
    float flutter = sin(x * 19.0 + across * 5.0 + t) * 0.012;
    vec3 p = vec3(x * 9.8, sweep + across * width * cos(twist) + flutter, sin(twist) * across * 1.0 + cos(x * 1.9 + phase) * 0.55);
    p.y += sin(position.z * 31.0 + phase) * 0.025;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float center = exp(-across * across * 2.8);
    float caustic = pow(0.5 + 0.5 * sin(x * 3.0 + phase * 1.2 + t * 0.55), 3.0);
    vEnergy = envelope * (0.22 + center * 0.78) * (0.48 + caustic * 0.8) * (0.65 + 1.8 * exp(-x * x * 4.0));
    vTint = min(1.0, 0.35 + 0.65 * caustic + exp(-x * x * 5.0) * 0.3);
    vAcross = across;
    vFlowX = x;
    gl_PointSize = (uHalo > 0.5 ? 42.0 : 1.8 + position.z * 1.25) * uDpr * (12.0 / -mv.z);
  }
`;
const fragmentShader = /* glsl */ `
  uniform float uHalo;
  varying float vEnergy;
  varying float vTint;
  varying float vAcross;
  varying float vFlowX;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float radius = dot(uv, uv);
    if (radius > 0.25) discard;
    float glow = exp(-radius * (uHalo > 0.5 ? 15.0 : 11.0));
    vec3 violet = vec3(0.34, 0.10, 0.95);
    vec3 pearl = vec3(0.79, 0.53, 1.0);
    vec3 color = mix(violet, pearl, vTint * 0.68);
    float alpha = glow * vEnergy * (uHalo > 0.5 ? 0.009 : 0.035);
    gl_FragColor = vec4(color, alpha);
  }
`;

/** An animated 3D light field: soft particles arranged in six twisting flow sheets. */
export function WaveScene() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
      });
    } catch {
      return;
    }
    renderer.setClearColor(0x000000, 0);
    const mobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.4);
    renderer.setPixelRatio(dpr);
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.set(0, 0, 13);
    const group = new THREE.Group();
    scene.add(group);
    group.scale.y = 1.3;
    let randomState = 38491;
    const random = () => {
      randomState = (randomState * 16807) % 2147483647;
      return (randomState - 1) / 2147483646;
    };
    function particles(count: number, halo: boolean) {
      const positions = new Float32Array(count * 3);
      const seeds = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = random() * 2 - 1;
        // Gaussian thickness makes every ribbon dissolve into the black instead of having a hard edge.
        positions[i * 3 + 1] = Math.max(
          -2.5,
          Math.min(
            2.5,
            Math.sqrt(-2 * Math.log(Math.max(random(), 0.0001))) *
              Math.cos(random() * Math.PI * 2) *
              0.62,
          ),
        );
        positions[i * 3 + 2] = random();
        seeds[i] = random();
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uDpr: { value: dpr },
          uHalo: { value: halo ? 1 : 0 },
        },
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      });
      const cloud = new THREE.Points(geometry, material);
      cloud.frustumCulled = false;
      group.add(cloud);
      return { geometry, material };
    }
    const ribbonFragment = /* glsl */ `
      varying float vEnergy;
      varying float vTint;
      varying float vAcross;
      varying float vFlowX;
      void main() {
        float veil = exp(-vAcross * vAcross * 1.9);
        float filaments = pow(0.5 + 0.5 * sin(vAcross * 78.0 + sin(vFlowX * 9.0) * 2.0), 18.0);
        float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233))) * 43758.5453);
        vec3 color = mix(vec3(0.25,0.055,0.82), vec3(0.78,0.48,1.0), vTint * 0.8);
        float alpha = veil * vEnergy * (0.24 + filaments * 0.045) * (0.94 + grain * 0.06);
        gl_FragColor = vec4(color, alpha);
      }
    `;
    const veils: {
      geometry: THREE.BufferGeometry;
      material: THREE.ShaderMaterial;
    }[] = [];
    for (let layer = 0; layer < 6; layer++) {
      const geometry = new THREE.PlaneGeometry(2, 5, mobile ? 96 : 160, mobile ? 28 : 36);
      const seeds = new Float32Array(geometry.attributes.position.count).fill((layer + 0.2) / 6);
      geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader: ribbonFragment,
        uniforms: {
          uTime: { value: 0 },
          uDpr: { value: dpr },
          uHalo: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      const veil = new THREE.Mesh(geometry, material);
      veil.frustumCulled = false;
      group.add(veil);
      veils.push({ geometry, material });
    }
    const mist = particles(mobile ? 6000 : 12000, true);
    const filaments = particles(mobile ? 45000 : 140000, false);
    const resources = [...veils, mist, filaments];
    let active = true,
      lost = false,
      frame = 0,
      time = 7,
      previous = 0;
    const target = { x: 0, y: 0 };
    const resize = () => {
      renderer.setSize(element.clientWidth, element.clientHeight);
      camera.aspect = element.clientWidth / element.clientHeight;
      camera.position.z = window.innerWidth < 768 ? 18 : 13;
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    const render = (stamp = performance.now()) => {
      frame = 0;
      if (!active || lost || document.hidden) {
        previous = 0;
        return;
      }
      const delta = previous ? Math.min((stamp - previous) / 1000, 0.05) : 0;
      previous = stamp;
      time += delta;
      group.rotation.y += (target.x - group.rotation.y) * 0.025;
      group.rotation.x += (target.y - group.rotation.x) * 0.025;
      group.position.y = -Math.min(window.scrollY, 900) * 0.0005;
      resources.forEach(({ material }) => {
        material.uniforms.uTime.value = time;
      });
      renderer.render(scene, camera);
      element.dataset.ready = 'true';
      frame = requestAnimationFrame(render);
    };
    const start = () => {
      if (!frame) render();
    };
    const intersection = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active) start();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
        previous = 0;
      }
    });
    intersection.observe(element);
    const move = (event: PointerEvent) => {
      target.x = (event.clientX / innerWidth - 0.5) * 0.14;
      target.y = (event.clientY / innerHeight - 0.5) * 0.08;
    };
    const contextLost = () => {
      lost = true;
      cancelAnimationFrame(frame);
      renderer.domElement.remove();
      delete element.dataset.ready;
    };
    renderer.domElement.addEventListener('webglcontextlost', contextLost);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('visibilitychange', start);
    start();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      window.removeEventListener('pointermove', move);
      document.removeEventListener('visibilitychange', start);
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      resources.forEach(({ geometry, material }) => {
        geometry.dispose();
        material.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
      delete element.dataset.ready;
    };
  }, []);
  return <div ref={host} className="wave-canvas" aria-hidden="true" />;
}

