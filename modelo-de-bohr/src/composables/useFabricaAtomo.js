import * as THREE from 'three';
import { useTexturasProcedurais } from './useTexturasProcedurais';

/**
 * Fábrica de componentes do átomo hiper-realista.
 * Usa MeshPhysicalMaterial, texturas procedurais (normal, emissive),
 * glow sprites com AdditiveBlending e luzes pontuais por partícula.
 */
export function usarFabricaAtomo() {

  const { gerarNormalMap, gerarEmissiveMap, gerarGlowSprite } = useTexturasProcedurais();

  const normalMap   = gerarNormalMap(512);
  const emissiveMap = gerarEmissiveMap(256);
  const glowEletron = gerarGlowSprite(256, 80, 220, 255);  
  const glowNucleo  = gerarGlowSprite(256, 255, 180, 80);  

  const CORES = {
    proton:  new THREE.Color(0xee2233),   
    neutron: new THREE.Color(0x8833dd),   
    eletron: new THREE.Color(0x00ddff),   
    orbita:  new THREE.Color(0x4499ff),  
  };

  const TAMANHO_PARTICULA = 0.42;
  const TAMANHO_ELETRON   = 0.28;

  const criarMaterialNucleon = (cor) => {
    return new THREE.MeshPhysicalMaterial({
      color: cor,
      roughness: 0.28,
      metalness: 0.35,
      emissive: cor,
      emissiveIntensity: 0.55,
      emissiveMap: emissiveMap,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.6, 0.6),
      clearcoat: 0.9,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.8,
    });
  };

  const criarMaterialEletron = () => {
    return new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.08,
      metalness: 0.15,
      emissive: CORES.eletron,
      emissiveIntensity: 3.0,
      emissiveMap: emissiveMap,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMapIntensity: 2.5,
      transparent: true,
      opacity: 0.95,
    });
  };

  const criarSpriteGlow = (textura, cor, escala) => {
    const mat = new THREE.SpriteMaterial({
      map: textura,
      color: cor,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(escala, escala, 1);
    return sprite;
  };

  const criarNucleo = (qtdProtons, qtdNeutrons) => {
    const grupo = new THREE.Group();
    const total = qtdProtons + qtdNeutrons;
    const geoEsfera = new THREE.SphereGeometry(TAMANHO_PARTICULA, 64, 64);

    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < total; i++) {
      const y = 1 - (i / (total - 1)) * 2;
      const raio = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const cor = i < qtdProtons ? CORES.proton : CORES.neutron;
      const mesh = new THREE.Mesh(geoEsfera, criarMaterialNucleon(cor));

      const escalaCluster = 0.65;
      mesh.position.set(
        Math.cos(theta) * raio * escalaCluster,
        y * escalaCluster,
        Math.sin(theta) * raio * escalaCluster,
      );
      grupo.add(mesh);
    }

    grupo.add(criarSpriteGlow(glowNucleo, 0xffaa44, 3.8));

    const haloBranco = criarSpriteGlow(glowNucleo, 0xffffff, 2.2);
    haloBranco.material.opacity = 0.25;
    grupo.add(haloBranco);
    const luzCentral = new THREE.PointLight(0xff8844, 4, 12, 2);
    grupo.add(luzCentral);

    return grupo;
  };

  const criarAnelVisual = (raio) => {
    const grupo = new THREE.Group();

    const geoInner = new THREE.TorusGeometry(raio, 0.02, 16, 300);
    const matInner = new THREE.MeshStandardMaterial({
      color: 0x88ddff,
      emissive: CORES.orbita,
      emissiveIntensity: 1.3,
      transparent: true,
      opacity: 0.85,
      roughness: 0.3,
      metalness: 0.2,
    });
    grupo.add(new THREE.Mesh(geoInner, matInner));

    const geoOuter = new THREE.TorusGeometry(raio, 0.1, 16, 300);
    const matOuter = new THREE.MeshBasicMaterial({
      color: CORES.orbita,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    grupo.add(new THREE.Mesh(geoOuter, matOuter));

    return grupo;
  };


  const criarCamada = (raio, qtdEletrons, velocidade) => {
    const grupoCamadaPai = new THREE.Group();
    grupoCamadaPai.add(criarAnelVisual(raio));

    const grupoGiratorio = new THREE.Group();
    grupoGiratorio.userData = { velocidade };

    const geoEletron = new THREE.SphereGeometry(TAMANHO_ELETRON, 64, 64);
    const passoAngulo = (Math.PI * 2) / qtdEletrons;

    for (let i = 0; i < qtdEletrons; i++) {
      const grupoE = new THREE.Group();

      grupoE.add(new THREE.Mesh(geoEletron, criarMaterialEletron()));

      grupoE.add(criarSpriteGlow(glowEletron, 0x44eeff, TAMANHO_ELETRON * 10));

      grupoE.add(new THREE.PointLight(0x00ccff, 1.2, 5, 2));

      const angulo = i * passoAngulo;
      grupoE.position.set(
        Math.cos(angulo) * raio,
        Math.sin(angulo) * raio,
        0,
      );
      grupoGiratorio.add(grupoE);
    }

    grupoCamadaPai.add(grupoGiratorio);
    return { grupoPai: grupoCamadaPai, animavel: grupoGiratorio };
  };

  return { criarNucleo, criarCamada };
}
