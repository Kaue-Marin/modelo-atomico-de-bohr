import * as THREE from 'three';

/**
 * Gerador de texturas procedurais via Canvas2D.
 * Cria todas as texturas necessárias sem arquivos PNG externos.
 */
export function useTexturasProcedurais() {

  const _canvas = (tamanho, fn) => {
    const c = document.createElement('canvas');
    c.width = c.height = tamanho;
    fn(c.getContext('2d'), tamanho);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  };

  const gerarNormalMap = (tam = 512) => {
    return _canvas(tam, (ctx, t) => {
      ctx.fillStyle = 'rgb(128,128,255)';
      ctx.fillRect(0, 0, t, t);

      for (let i = 0; i < 60; i++) {
        const x = Math.random() * t;
        const y = Math.random() * t;
        const r = 6 + Math.random() * 25;
        const d = (Math.random() - 0.5) * 50;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgb(${128 + d},${128 + d},255)`);
        g.addColorStop(1, 'rgb(128,128,255)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };


  const gerarEmissiveMap = (tam = 256) => {
    return _canvas(tam, (ctx, t) => {
      const g = ctx.createRadialGradient(t / 2, t / 2, 0, t / 2, t / 2, t / 2);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.25, '#dddddd');
      g.addColorStop(0.6, '#444444');
      g.addColorStop(1, '#000000');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, t, t);
    });
  };

  /**
   * Textura radial de glow para Sprites (RGBA com transparência).
   * @param {number} tam  Resolução do canvas
   * @param {number} r    Red   (0-255)
   * @param {number} g    Green (0-255)
   * @param {number} b    Blue  (0-255)
   */
  const gerarGlowSprite = (tam = 256, r = 255, g = 255, b = 255) => {
    return _canvas(tam, (ctx, t) => {
      ctx.clearRect(0, 0, t, t);
      const grad = ctx.createRadialGradient(t / 2, t / 2, 0, t / 2, t / 2, t / 2);
      grad.addColorStop(0,    `rgba(${r},${g},${b},1)`);
      grad.addColorStop(0.12, `rgba(${r},${g},${b},0.85)`);
      grad.addColorStop(0.35, `rgba(${r},${g},${b},0.3)`);
      grad.addColorStop(0.6,  `rgba(${r},${g},${b},0.08)`);
      grad.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, t, t);
    });
  };

  return { gerarNormalMap, gerarEmissiveMap, gerarGlowSprite };
}
