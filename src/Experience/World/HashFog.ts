import * as kokomi from "kokomi.js";
import * as THREE from "three";

import type Experience from "../Experience";

import hashFogVertexShader from "../Shaders/HashFog/vert.glsl";
import hashFogFragmentShader from "../Shaders/HashFog/frag.glsl";

export default class HashFog extends kokomi.Component {
  declare base: Experience;
  uj: kokomi.UniformInjector;
  material: THREE.ShaderMaterial;
  mesh: THREE.Mesh;
  constructor(base: Experience) {
    super(base);

    const geometry = new THREE.PlaneGeometry(1000, 1000);

    const uj = new kokomi.UniformInjector(this.base);
    this.uj = uj;

    const material = new THREE.ShaderMaterial({
      vertexShader: hashFogVertexShader,
      fragmentShader: hashFogFragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        ...uj.shadertoyUniforms,
      },
    });
    this.material = material;

    const mesh = new THREE.Mesh(geometry, material);
    this.mesh = mesh;
    this.mesh.position.z = -400;
    this.mesh.frustumCulled = false;
  }
  addExisting(): void {
    this.container.add(this.mesh);
  }
  update(): void {
    this.uj.injectShadertoyUniforms(this.material.uniforms);
  }
}
