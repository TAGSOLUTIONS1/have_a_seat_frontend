import React, { useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";

const GlobeComponent = ({ locations }) => {
  const globeEl = useRef();
  const [globeSize, setGlobeSize] = useState({ width: 350, height: 350 });

  useEffect(() => {
    const updateGlobeSize = () => {
      if (window.innerWidth > 768) {
        setGlobeSize({ width: 600, height: 600 });
      } else if (window.innerWidth > 1023) {
        setGlobeSize({ width: 800, height: 800 });
      } else {
        setGlobeSize({ width: 350, height: 350 });
      }
    };

    // Set initial size
    updateGlobeSize();

    // Update size on window resize
    window.addEventListener("resize", updateGlobeSize);
    return () => window.removeEventListener("resize", updateGlobeSize);
  }, []);

  useEffect(() => {
    console.log(locations, "locations in globe");
    const globe = globeEl.current;
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;

    const backgroundTexture = new THREE.TextureLoader().load(
      "/path/to/your/background.jpg"
    );
    globe.scene().background = backgroundTexture;
  }, [locations]);

  return (
    <Globe
      ref={globeEl}
      width={globeSize.width}
      height={globeSize.height}
      globeImageUrl="https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg"
      pointsData={locations}
      pointAltitude={0.01}
      pointColor={() => "red"}
      pointRadius={0.8}
      labelsData={locations}
      labelLat={(d) => d.lat}
      labelLng={(d) => d.lng}
      labelText={(d) => d.name}
      labelSize={(d) => 1}
      labelDotRadius={(d) => 0.5}
      labelColor={() => "white"}
      labelResolution={10}
    />
  );
};

export default GlobeComponent;
