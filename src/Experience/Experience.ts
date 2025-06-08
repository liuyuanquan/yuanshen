import * as kokomi from "kokomi.js";
import * as THREE from "three";

import World from "./World/World";

import { resources } from "./resources";

export default class Experience extends kokomi.Base {
  world: World;
  am: kokomi.AssetManager;
  constructor(sel = "#sketch") {
    super(sel, {
      autoAdaptMobile: true,
    });

    (window as any).experience = this;

    kokomi.enableShadow(this.renderer);

    this.am = new kokomi.AssetManager(this, resources, {
      useDracoLoader: true,
    });

    this.camera.position.set(0, 0, 0);
    const camera = this.camera as THREE.PerspectiveCamera;
    camera.fov = 45;
    camera.near = 50;
    camera.far = 100000;
    camera.rotation.x = THREE.MathUtils.degToRad(5.5);
    camera.updateProjectionMatrix();

    new kokomi.OrbitControls(this);

    this.world = new World(this);
  }
}
