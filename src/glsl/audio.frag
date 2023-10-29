varying vec2 vUv;
uniform float uProgress;
uniform float uDataLength;
uniform float uDataArray[256];

void main() {
  vec2 uv = vUv;
  vec3 color = vec3(0.0);
  gl_FragColor = vec4(color, 1.0);
}