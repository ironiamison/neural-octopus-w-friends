export const bioluminescentVertexShader = `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    
    vec3 pos = position;
    pos.y += sin(time * 2.0 + position.x * 4.0) * 0.2;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 2.0;
  }
`

export const bioluminescentFragmentShader = `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vec3 color = vec3(0.0, 0.5, 1.0);
    float alpha = 0.5 + 0.5 * sin(time + vPosition.x * 4.0);
    
    gl_FragColor = vec4(color, alpha);
  }
` 