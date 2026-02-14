<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { usarCena3D } from '@/composables/useThreeScene';
import { usarFabricaAtomo } from '@/composables/useFabricaAtomo';
import { MathUtils } from 'three'; 

const refCanvas = ref(null);
const { iniciar, limpar, cena } = usarCena3D(refCanvas);
const { criarNucleo, criarCamada } = usarFabricaAtomo();

const objetosParaAnimar = [];
let frameId;

const loopAnimacao = () => {
  frameId = requestAnimationFrame(loopAnimacao);
  
  objetosParaAnimar.forEach((obj) => {
    obj.rotation.z += obj.userData.velocidade;
  });
};

onMounted(() => {
  iniciar();

  const nucleo = criarNucleo(6, 6);
  if (cena && cena.value) cena.value.add(nucleo);

  const adicionarCamada = (raio, eletrons, velocidade, rotX, rotY) => {
    const { grupoPai, animavel } = criarCamada(raio, eletrons, velocidade);

    if (typeof rotX === 'number') {
      grupoPai.rotation.x = MathUtils.degToRad(rotX);
    }
    if (typeof rotY === 'number') {
      grupoPai.rotation.y = MathUtils.degToRad(rotY);
    }

    if (cena && cena.value) cena.value.add(grupoPai);
    objetosParaAnimar.push(animavel);
  };


  adicionarCamada(3.0, 2, 0.04, 20, -10);

  adicionarCamada(4.1, 4, 0.028, -40, 35);

  adicionarCamada(5.6, 1, 0.018, 75, -25);

  loopAnimacao();
});

onUnmounted(() => {
  cancelAnimationFrame(frameId);
  limpar();
});
</script>
<template>
  <div class="container-canvas">
    <canvas ref="refCanvas"></canvas>
    <div class="painel-sobreposto">
      <h2>Simulação de Bohr</h2>
      <p>Modelo Dinâmico</p>
      <br>
      <small>🖱️ Arraste para girar | 🔍 Zoom</small>
    </div>
  </div>
</template>

<style scoped>
.container-canvas {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: #000;
}
canvas { display: block; outline: none; }
.painel-sobreposto {
  position: absolute; top: 20px; left: 20px;
  color: white; background: rgba(0, 0, 0, 0.7);
  padding: 1.5rem; border-radius: 12px;
  pointer-events: none; font-family: 'Segoe UI', sans-serif;
  user-select: none; min-width: 200px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
h2 { margin: 0 0 10px 0; color: #00E5FF; } 
p { margin: 5px 0; font-size: 0.9rem; }
</style>