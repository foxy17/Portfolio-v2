'use client';

import React, { useEffect, useRef } from 'react';
import cn from 'classnames';

type ShaderVariant = 'button' | 'card' | 'modal';

type Props = {
  variant: ShaderVariant;
  className?: string;
};

const VERTEX_SHADER = `
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_variant;
uniform float u_dark;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.0, 289.0))) * 45758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float line(float value, float width) {
  return smoothstep(width, 0.0, abs(value));
}

vec4 cardShader(vec2 uv) {
  vec2 grid = fract((uv + vec2(u_time * 0.025, -u_time * 0.018)) * vec2(9.0, 6.0));
  float h = line(grid.y - 0.5, 0.025);
  float v = line(grid.x - 0.5, 0.018);
  float nodes = smoothstep(0.08, 0.0, length(grid - 0.5));
  float scan = smoothstep(0.20, 0.0, abs(uv.y - fract(u_time * 0.10)));
  float grain = noise(uv * 36.0 + u_time * 0.4);
  float mask = (h * 0.38 + v * 0.28 + nodes * 0.75 + scan * 0.22) * (0.72 + grain * 0.28);

  vec3 blue = vec3(0.071, 0.710, 0.898);
  vec3 green = vec3(0.043, 0.663, 0.357);
  vec3 purple = vec3(0.482, 0.369, 0.655);
  vec3 color = mix(blue, green, uv.x);
  color = mix(color, purple, smoothstep(0.25, 0.9, uv.y));

  return vec4(color, mask * mix(0.30, 0.42, u_dark));
}

vec4 modalShader(vec2 uv) {
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  vec2 center = vec2(
    sin(u_time * 0.18) * 0.10 + 0.13,
    cos(u_time * 0.14) * 0.08 - 0.08
  );
  vec2 q = p - center;
  float radius = length(q);
  float angle = atan(q.y, q.x);

  float rings = 0.0;
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float ringRadius = 0.13 + fi * 0.105 + sin(u_time * 0.32 + fi) * 0.012;
    rings += line(radius - ringRadius, 0.006 + fi * 0.0015);
  }

  float beams = line(sin(angle * 5.0 + u_time * 0.55), 0.065) * smoothstep(0.62, 0.04, radius);
  float lens = smoothstep(0.74, 0.05, radius) * (0.55 + noise(q * 8.0 + u_time * 0.12) * 0.45);
  vec2 pixelGrid = floor((uv + vec2(u_time * 0.015, -u_time * 0.01)) * vec2(36.0, 22.0));
  float glints = step(0.91, hash(pixelGrid)) * smoothstep(0.82, 0.18, length(p));
  float diagonal = line(fract((uv.x + uv.y * 0.72 - u_time * 0.08) * 5.0) - 0.5, 0.025);
  float topGlow = smoothstep(1.0, 0.0, uv.y);

  vec3 cyan = vec3(0.071, 0.710, 0.898);
  vec3 violet = vec3(0.482, 0.369, 0.655);
  vec3 yellow = vec3(0.988, 0.729, 0.157);
  vec3 color = mix(cyan, violet, 0.5 + 0.5 * sin(angle + u_time * 0.28));
  color = mix(color, yellow, smoothstep(0.10, 0.62, radius));

  float mask = rings * 0.58 + beams * 0.18 + lens * 0.12 + glints * 0.28 + diagonal * 0.10;
  return vec4(color, mask * topGlow * mix(0.34, 0.48, u_dark));
}

vec4 buttonShader(vec2 uv) {
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  float burst = 0.0;
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    vec2 point = vec2(
      sin(u_time * (0.7 + fi * 0.13) + fi * 1.7),
      cos(u_time * (0.6 + fi * 0.17) + fi * 1.1)
    ) * 0.42;
    burst += smoothstep(0.20, 0.0, length(p - point));
  }

  float ribbon = sin((uv.x * 8.0 + uv.y * 3.5 + u_time * 1.9) * 3.14159);
  float pop = smoothstep(0.45, 1.0, burst + ribbon * 0.18);
  vec3 yellow = vec3(0.988, 0.729, 0.157);
  vec3 pink = vec3(0.953, 0.545, 0.639);
  vec3 blue = vec3(0.071, 0.710, 0.898);
  vec3 green = vec3(0.043, 0.663, 0.357);

  vec3 color = mix(yellow, pink, smoothstep(0.0, 0.62, uv.x));
  color = mix(color, blue, smoothstep(0.25, 1.0, uv.y));
  color = mix(color, green, pop * 0.45);

  return vec4(color, (0.58 + pop * 0.32) * mix(0.72, 0.88, u_dark));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec4 color;
  if (u_variant < 0.5) {
    color = cardShader(uv);
  } else if (u_variant < 1.5) {
    color = modalShader(uv);
  } else {
    color = buttonShader(uv);
  }
  gl_FragColor = color;
}
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

export default function ProjectShaderCanvas({ variant, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!canvas || reduceMotion.matches) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      powerPreference: 'low-power',
    });

    if (!gl) return;

    const program = createProgram(gl);
    const buffer = gl.createBuffer();

    if (!program || !buffer) return;

    const position = gl.getAttribLocation(program, 'position');
    const resolution = gl.getUniformLocation(program, 'u_resolution');
    const time = gl.getUniformLocation(program, 'u_time');
    const variantUniform = gl.getUniformLocation(program, 'u_variant');
    const dark = gl.getUniformLocation(program, 'u_dark');
    let frame = 0;
    let visible = false;
    let size = { width: 0, height: 0 };

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.35);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));

      if (width === size.width && height === size.height) return;

      size = { width, height };
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    const render = (now: number) => {
      frame = 0;
      if (!visible || document.visibilityState !== 'visible') return;

      resize();
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(resolution, size.width, size.height);
      gl.uniform1f(time, now * 0.001);
      gl.uniform1f(
        variantUniform,
        variant === 'button' ? 2 : variant === 'modal' ? 1 : 0,
      );
      gl.uniform1f(dark, document.documentElement.classList.contains('dark') ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      frame = window.requestAnimationFrame(render);
    };

    const requestRender = () => {
      if (frame || !visible || document.visibilityState !== 'visible') return;
      frame = window.requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) requestRender();
      else if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    });

    observer.observe(canvas);
    window.addEventListener('resize', requestRender);
    document.addEventListener('visibilitychange', requestRender);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', requestRender);
      document.removeEventListener('visibilitychange', requestRender);
      if (frame) window.cancelAnimationFrame(frame);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full motion-reduce:hidden',
        className,
      )}
    />
  );
}
