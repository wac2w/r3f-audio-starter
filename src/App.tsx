import { Canvas } from "@react-three/fiber";
import { OrbitControls, GizmoHelper, GizmoViewport } from "@react-three/drei";
import { AudioShader } from "./AudioShader";
import { useState } from "react";

function App() {

  const [start, setStart] = useState(false);

  return (
    <div style={{ height: "100dvh", width: "100dvw" }}>
      {!start && 
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 10,
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)"
        }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              color: "white",
              fontSize: "2rem",
              fontWeight: "bold",
              cursor: "pointer"
            }}
            onClick={() => {
              setStart(true);
            }}
          >
            Click to Me
          </div>
        </div>
      }
      <Canvas shadows>
        <ambientLight intensity={1}/>
        <pointLight position={[3, 3, 3]}/>
        <directionalLight position={[-2, 3, 5]}/>
        <OrbitControls/>
        {start &&
          <AudioShader url="/Morning.mp3" />
        }
        <GizmoHelper alignment="top-right" margin={[75, 75]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper>
      </Canvas>
    </div>
  )
}

export default App