varying vec2 vUv;
varying vec4 vVertexColor;
uniform float uPower;
uniform float uInnerRadius;
uniform float uOuterRadius;
uniform float uDataLength;
uniform float uDataArray[256];

void main() {
  gl_FragColor = vVertexColor;
}