import { useEffect, useRef } from "react";
import vertexShader from "./glsl/audio.vert";
import fragmentShader from "./glsl/audio.frag";
import { ShaderMaterial } from "three";
import { suspend } from "suspend-react";
import { useControls } from "leva";
import { createAudio } from "./utils/audio";
import { useFrame } from "@react-three/fiber";

type AudioShaderProps = {
  url : string;
};
export const AudioShader = (
  { url }: AudioShaderProps
) => {
  const ref = useRef<ShaderMaterial>(null);
  const { power, fftSize, innerRadius, outerRadius, wireframe, pause } = useControls({
    power: {
      step: 0.1,
      value: 0.2,
      max: 1.0,
      min: 0.0,
    },
    fftSize: {
      value: 64,
      options: [32, 64, 128, 256],
    },
    innerRadius: {
      value: 0.5,
      max: 1.0,
      min: 0.0,
    },
    outerRadius: {
      value: 0.6,
      max: 1.0,
      min: 0.0,
    },
    wireframe: false,
    pause: false
  });
  const { gain, context, update, data } = suspend(() => createAudio(url, fftSize), [url, fftSize]);

  useEffect(() => {
    gain.connect(context.destination);
    return () => gain.disconnect();
  }, [gain, context]);

  useEffect(() => {
    if (pause) {
      gain.disconnect();
    } else {
      gain.connect(context.destination);
    }
  }, [pause]);

  const shaderMaterial = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uPower: { value: power },
      uInnerRadius: { value: innerRadius },
      uDataLength: { value: data.length },
      uDataArray: { value: Array.from(data).map((v) => v / 255.0) },
    },
    wireframe,
  });

  useFrame(()=> {
    const avg = update();
    const values = Array.from(data).map((v) => v / 255.0);
    // console.log(avg, values);
    shaderMaterial.uniforms.uDataArray.value = values;
  });

  return (
    <mesh scale={3}>
      <ringGeometry args={[innerRadius, outerRadius, data.length, 1]}/>
      <primitive object={shaderMaterial} ref={ref} attach="material"/>
    </mesh>
  )
}