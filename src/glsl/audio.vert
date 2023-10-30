varying vec2 vUv;
varying vec4 vVertexColor;
uniform float uPower;
uniform float uInnerRadius;
uniform float uOuterRadius;
uniform float uDataLength;
uniform float uDataArray[256];

float PI = 3.1415926;
/**
 * 偏角を取得
 */
float atan2(float y, float x){
  if (x == 0.0){
    // Xが0のとき、無限になるため、yが正なら2π、負なら-2π
    return sign(y) * PI / 2.0;
  }
  else {
    return atan(y, x);
  }
}

/**
 * 直交座標⇒極座標
 */
vec2 xy2pol(vec2 xy){
  // length関数は、動径tを取得できる組み込み関数
  return vec2(atan2(xy.y, xy.x), length(xy));
}

/**
 * 極座標⇒直交座標
 */
vec2 pol2xy(vec2 pol){
  return pol.y * vec2(cos(pol.x), sin(pol.x));
}

/**
* pos-xy座標を中心から 0~1(value) * power移動させる
*/
vec2 move(vec2 pos, float value, float power){
  vec2 pol = xy2pol(pos);
  pol.t += value * power;
  return pol2xy(pol);
}

/**
 * プロシージャルテクスチャ
 * s: 偏角 t: 動径
 */
vec3 tex(vec2 st){
  vec3 innerColor = vec3(0.0, 0.9333, 1.0);
  vec3 outerColor = vec3(0.9569, 1.0, 0.7216);
  return mix(innerColor, outerColor, st.t);
}


void main() {
  float power = uPower;
  float innerRadius = uInnerRadius;
  float outerRadius = uOuterRadius;
  float diff = outerRadius - innerRadius;
  vec3 pos = position;
  float dlength = uDataLength;
  for (float i = 0.; i < dlength; i++) {
    int ind = int(i);
    float value = uDataArray[ind];
    // posの範囲を-π ~ πに変換
    vec2 pol = xy2pol(pos.xy);
    // 偏角の範囲を[0, 2)区画に変換
    pol.s = pol.s / PI + 1.0;
    // 0-1に変換
    pol.s = pol.s / 2.0;
    // 2.0 / dlengthで、1つのデータが占める角度を計算
    float da = 1.0 / dlength;
    float angle = da * i;
    if (pol.s > angle && pol.s < angle + da) {
      if (pol.t >= innerRadius - (diff / 10.0)){
        pos.xy = move(pos.xy, value, power);
      }
    }
    vVertexColor = vec4(tex(pol.xy), 1.0);
  }
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}