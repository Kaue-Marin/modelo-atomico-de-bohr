# Modelo Atômico de Bohr 3D Hiper-Realista

Este projeto é uma simulação interativa e hiper-realista do modelo atômico de Bohr, desenvolvida com Vue.js 3 e Three.js. O sistema utiliza materiais PBR, texturas procedurais, pós-processamento avançado e um ambiente espacial 3D para criar uma visualização científica e artística de um átomo.

## Sumário
- [Demonstração](#demonstração)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Rodar](#como-rodar)
- [Detalhes Técnicos](#detalhes-técnicos)
  - [Cálculos e Algoritmos](#cálculos-e-algoritmos)
  - [Materiais e Texturas](#materiais-e-texturas)
  - [Órbitas e Animação](#órbitas-e-animação)
  - [Fundo Estelar e Reflexões](#fundo-estelar-e-reflexões)
  - [Pós-Processamento](#pós-processamento)
- [Customização e Imagens](#customização-e-imagens)
- [Créditos e Licença](#créditos-e-licença)

---

## Demonstração

> **Sugestão:** Coloque aqui um GIF ou screenshot do átomo renderizado. Exemplo:
>
> ![Exemplo de átomo 3D](./docs/demo-atom.gif)

---

## Funcionalidades
- Núcleo hiper-realista com prótons vermelhos e nêutrons roxos, ambos com texturas e brilho próprio
- Elétrons azuis com glow, animados em órbitas elípticas
- Órbitas texturizadas, com efeito de energia e halo difuso
- Fundo de espaço estrelado 3D (campo de partículas)
- Reflexões físicas realistas (envMap procedural)
- Pós-processamento com bloom para brilho intenso
- Interatividade: zoom, rotação, painel de informações

---

## Estrutura do Projeto

```
modelo-de-bohr/
├── public/
├── src/
│   ├── assets/                # Imagens, texturas externas, HDRs
│   ├── composables/
│   │   ├── useThreeScene.js   # Setup da cena Three.js (câmera, luzes, pós-processamento)
│   │   ├── useFabricaAtomo.js # Fábrica de núcleo, elétrons e órbitas hiper-realistas
│   │   └── useTexturasProcedurais.js # Geração procedural de normal/emissive/glow
│   ├── components/
│   │   └── atom/
│   │       └── AtomCanvas.vue # Canvas principal do átomo
│   ├── views/
│   │   └── HomeView.vue       # View principal
│   └── App.vue
├── package.json
└── README.md
```

---

## Como Rodar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Acesse `http://localhost:5173` no navegador.

---

## Detalhes Técnicos

### Cálculos e Algoritmos
- **Distribuição do núcleo:** Packing de prótons e nêutrons via algoritmo de ângulo dourado (Fibonacci sphere), garantindo distribuição uniforme e visual natural.
- **Órbitas:** Cada camada eletrônica é um grupo 3D com rotação independente, inclinação controlada para simular elipses cruzadas.
- **Animação:** Elétrons giram em torno do núcleo com velocidades distintas, usando requestAnimationFrame.

### Materiais e Texturas
- **Materiais:** MeshPhysicalMaterial para todos os corpos (PBR, clearcoat, emissive, normal map, envMapIntensity).
- **Texturas:**
  - Normal map procedural (Canvas2D) para relevo realista
  - Emissive map procedural para brilho energético
  - Glow sprites para halos luminosos (elétrons e núcleo)
- **EnvMap:** Gerado proceduralmente via PMREMGenerator, com luzes coloridas para reflexões dinâmicas.

### Órbitas e Animação
- **Órbitas:** TubeGeometry e TorusGeometry com materiais emissivos e halos difusos (AdditiveBlending)
- **Elétrons:** Esferas pequenas, cada uma com glow sprite e micro PointLight
- **Inclinação:** Ângulos fixos para cada camada, simulando visual de referência fotorealista

### Fundo Estelar e Reflexões
- **Campo estelar:** 5000 partículas distribuídas em esfera, com variação de cor (temperatura estelar)
- **EnvMap:** Reflexões HDR simuladas via cena procedural

### Pós-Processamento
- **EffectComposer:** RenderPass + UnrealBloomPass (bloom hiper-realista)
- **Configuração:**
  - strength: 1.5
  - radius: 0.65
  - threshold: 0.1

---


## Créditos e Licença

- **Tecnologias:** Vue.js 3, Three.js, JavaScript ES2022
- **Autor:** Kauê Marin
- **Licença:** MIT
- **Imagens:** Se usar texturas externas, cite as fontes.

---

> Dúvidas, sugestões ou bugs? Abra uma issue ou envie um PR!
