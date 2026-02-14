import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { shallowRef, markRaw } from 'vue';

/**
 * Composable da cena Three.js hiper-realista.
 * Inclui campo estelar 3D, env map procedural para reflexões PBR,
 * iluminação de estúdio e pós-processamento com Bloom.
 */
export function usarCena3D(refCanvas) {

  const cena = shallowRef(null);
  let camera = null;
  let renderizador = null;
  let controles = null;
  let compositor = null;

  const criarEstrelas = () => {
    const geo = new THREE.BufferGeometry();
    const posicoes = [];
    const cores = [];

    for (let i = 0; i < 5000; i++) {
      const r = 60 + Math.random() * 250;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      posicoes.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      );

      const temp = Math.random();
      if (temp < 0.65)       cores.push(1, 1, 1);
      else if (temp < 0.80)  cores.push(0.7, 0.85, 1);
      else if (temp < 0.92)  cores.push(1, 0.92, 0.75);
      else                    cores.push(0.6, 0.7, 1);
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(posicoes, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(cores, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      depthWrite: false,
    });

    return new THREE.Points(geo, mat);
  };

  const gerarEnvMap = (renderer) => {
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x020212);

    const l1 = new THREE.PointLight(0xff4422, 12, 80);
    l1.position.set(15, 10, 8);
    envScene.add(l1);

    const l2 = new THREE.PointLight(0x2244ff, 10, 80);
    l2.position.set(-12, -8, -10);
    envScene.add(l2);

    const l3 = new THREE.PointLight(0x00ffaa, 6, 60);
    l3.position.set(0, 14, -6);
    envScene.add(l3);

    const rt = pmrem.fromScene(envScene, 0.04);
    const envMap = rt.texture;
    pmrem.dispose();
    return envMap;
  };
  const iniciar = () => {
    cena.value = markRaw(new THREE.Scene());
    cena.value.background = new THREE.Color('#020212');

    const largura = window.innerWidth;
    const altura = window.innerHeight;

    camera = markRaw(new THREE.PerspectiveCamera(60, largura / altura, 0.1, 1000));
    camera.position.set(0, 2, 12);

    renderizador = markRaw(new THREE.WebGLRenderer({
      canvas: refCanvas.value,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    }));
    renderizador.setSize(largura, altura);
    renderizador.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderizador.outputColorSpace = THREE.SRGBColorSpace;
    renderizador.toneMapping = THREE.ACESFilmicToneMapping;
    renderizador.toneMappingExposure = 1.3;

    cena.value.environment = gerarEnvMap(renderizador);

    cena.value.add(criarEstrelas());

    controles = markRaw(new OrbitControls(camera, renderizador.domElement));
    controles.enableDamping = true;
    controles.dampingFactor = 0.05;
    controles.target.set(0, 0, 0);
    controles.minDistance = 4;
    controles.maxDistance = 40;
    controles.update();


    cena.value.add(new THREE.AmbientLight(0x0a0a1a, 1.0));

    const keyLight = new THREE.PointLight(0xfff0dd, 3.0, 80);
    keyLight.position.set(16, 20, 14);
    cena.value.add(keyLight);

    const fillLight = new THREE.PointLight(0x2255ff, 1.6, 60);
    fillLight.position.set(-14, -8, -12);
    cena.value.add(fillLight);

    const rimLight = new THREE.PointLight(0x44aaff, 1.8, 50);
    rimLight.position.set(-10, 15, -8);
    cena.value.add(rimLight);

    compositor = markRaw(new EffectComposer(renderizador));
    compositor.addPass(new RenderPass(cena.value, camera));

    const bloom = new UnrealBloomPass(
      new THREE.Vector2(largura, altura), 1.5, 0.5, 0.1,
    );
    bloom.threshold = 0.1;
    bloom.strength  = .3;
    bloom.radius    = 0.65;
    compositor.addPass(bloom);

    animar();
    window.addEventListener('resize', aoRedimensionarJanela);
  };

  const animar = () => {
    requestAnimationFrame(animar);
    if (controles) controles.update();

    if (compositor && cena.value && camera) {
      compositor.render();
    } else if (renderizador && cena.value && camera) {
      renderizador.render(cena.value, camera);
    }
  };

  const aoRedimensionarJanela = () => {
    if (!camera || !renderizador) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderizador.setSize(window.innerWidth, window.innerHeight);
    if (compositor) compositor.setSize(window.innerWidth, window.innerHeight);
  };

  const limpar = () => {
    window.removeEventListener('resize', aoRedimensionarJanela);
    if (renderizador) renderizador.dispose();
  };

  return {
    iniciar,
    limpar,
    cena,
    camera,
    renderizador,
  };
}
