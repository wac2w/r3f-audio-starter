import { useEffect, useRef } from "react";
import vertexShader from "./glsl/audio.vert";
import fragmentShader from "./glsl/audio.frag";
import { ShaderMaterial } from "three";
import { suspend } from "suspend-react";
import { useControls } from "leva";
import { createAudio } from "./utils/audio";

type AudioShaderProps = {
  url : string;
};
export const AudioShader = (
  { url }: AudioShaderProps
) => {
  const ref = useRef<ShaderMaterial>(null);
  const { progress, fftSize } = useControls({
    progress: {
      step: 0.01,
      value: 0.5,
      max: 1.0,
      min: 0.0,
    },
    fftSize: {
      value: 64,
      options: [32, 64, 128, 256],
    }
  });
  const { gain, context, update, data } = suspend(() => createAudio(url, fftSize), [url]);

  useEffect(() => {
    gain.connect(context.destination);
    return () => gain.disconnect();
  }, [gain, context]);

  const shaderMaterial = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uProgress: { value: progress },
      uDataLength: { value: data.length },
      uDataArray: { value: Array.from(data).map((v) => v / 255.0) },
    }
  });

  return (
    <mesh scale={3}>
      <planeGeometry args={[1, 1, 1]}/>
      <primitive object={shaderMaterial} ref={ref} attach="material"/>
    </mesh>
  )
}