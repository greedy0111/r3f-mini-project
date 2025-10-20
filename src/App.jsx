import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import "./App.css";
import { OrbitControls, useHelper } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useState } from "react";

const cardData = [
  {
    name: "tarrot_1",
    imageUrl: "/tarrot_1.png",
    position: [0, -1, 0],
    rotationY: -10,
    rotationZ: 0,
  },
  {
    name: "tarrot_2",
    imageUrl: "/tarrot_2.png",
    position: [0.5, -1.05, -0.1],
    rotationY: -10,
    rotationZ: -10,
  },
  {
    name: "tarrot_3",
    imageUrl: "/tarrot_3.png",
    position: [-0.5, -1.05, 0.1],
    rotationY: -10,
    rotationZ: 10,
  },
  {
    name: "tarrot_4",
    imageUrl: "/tarrot_4.png",
    position: [-1, -1.15, 0.2],
    rotationY: -10,
    rotationZ: 20,
  },
  {
    name: "tarrot_5",
    imageUrl: "/tarrot_5.png",
    position: [1, -1.15, -0.1],
    rotationY: -10,
    rotationZ: -20,
  },
];
import { useSpring, animated } from "@react-spring/three";

const CardComponent = ({ position, rotationY, rotationZ, imageUrl, name }) => {
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  texture.colorSpace = THREE.DisplayP3ColorSpace; //P3ColorSpace로 변경
  const [hovered, setHovered] = useState(false);

  const materials = createMaterials(texture);
  const props = useSpring({
    scale: hovered ? [1.1, 1.1, 1] : [1, 1, 1],
    position: calculatePosition(position, hovered),
    rotation: calculateRotation(rotationY, rotationZ, hovered),
    config: { mass: 5, tension: 400, friction: 100 },
  });
  const onMeshClick = (e) => {
    e.stopPropagation();
    alert(`${name}를 클릭했습니다.`);
  };
  return (
    <animated.mesh
      onClick={onMeshClick}
      castShadow
      receiveShadow
      position={position}
      rotation-y={THREE.MathUtils.degToRad(rotationY)}
      rotation-z={THREE.MathUtils.degToRad(rotationZ)}
      material={materials}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
      {...props}
    >
      <boxGeometry args={[1, 1.6, 0.01]} />
    </animated.mesh>
  );
};
const createMaterials = (texture) => {
  return [
    new THREE.MeshStandardMaterial(), // 오른쪽
    new THREE.MeshStandardMaterial(), // 왼쪽
    new THREE.MeshStandardMaterial(), // 윗면
    new THREE.MeshStandardMaterial(), // 바닥면
    new THREE.MeshStandardMaterial({
      map: texture,
    }), // 앞면 (이미지 적용)
    new THREE.MeshStandardMaterial(), // 뒷면
  ];
};

const calculatePosition = (position, hovered) => {
  return hovered
    ? [position[0], position[1], +0.5, position + 0.5, position[2]]
    : position;
};
const adjustRotation = (rotation, adjustment) => {
  return rotation === 0 ? rotation : rotation + adjustment;
};
const calculateRotation = (rotationY, rotationZ, hovered) => {
  return hovered
    ? [
        0,
        THREE.MathUtils.degToRad(adjustRotation(rotationY, 5)),
        THREE.MathUtils.degToRad(
          adjustRotation(rotationZ, rotationZ > 0 ? -5 : 5)
        ),
      ]
    : [
        0,
        THREE.MathUtils.degToRad(rotationY),
        THREE.MathUtils.degToRad(rotationZ),
      ];
};
// import { useControls } from "leva";

const Elements = () => {
  const { camera } = useThree();

  useFrame(() => {
    camera.lookAt(0, 0.5, 0);
  });
  return (
    <>
      {/* <OrbitControls /> */}
      <ambientLight intensity={0.7} />
      <directionalLight
        castShadow
        intensity={2}
        shadow-mapSize={[5000, 5000]}
        target-position={[0, -1, 0]}
        position={[-4, -2.1, 4]}
      />
      {cardData.map((props) => {
        return <CardComponent key={props.imageUrl} {...props} />;
      })}
    </>
  );
};
function App() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 3] }}>
      <Elements />
    </Canvas>
  );
}

export default App;
