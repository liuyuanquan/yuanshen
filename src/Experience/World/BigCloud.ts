import * as kokomi from "kokomi.js";
import * as THREE from "three";
import * as STDLIB from "three-stdlib";

import type Experience from "../Experience";

import bigCloudVertexShader from "../Shaders/BigCloud/vert.glsl";
import bigCloudFragmentShader from "../Shaders/BigCloud/frag.glsl";
import bigCloudBgFragmentShader from "../Shaders/BigCloud/frag-bg.glsl";

/**
 * 大云层组件，负责加载和管理云层模型及其材质
 */
export default class BigCloud extends kokomi.Component {
  declare base: Experience;
  model: STDLIB.GLTF;
  constructor(base: Experience) {
    super(base);

    // 创建主云层材质
    const material1 = new THREE.ShaderMaterial({
      vertexShader: bigCloudVertexShader,
      fragmentShader: bigCloudFragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTexture: {
          value: this.base.am.items["Tex_0063"],
        },
      },
    });

    // 创建背景云层材质
    const material2 = new THREE.ShaderMaterial({
      vertexShader: bigCloudVertexShader,
      fragmentShader: bigCloudBgFragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTexture: {
          value: this.base.am.items["Tex_0067b"],
        },
      },
    });

    // 获取云层模型
    const model = this.base.am.items["SM_BigCloud"] as STDLIB.GLTF;
    this.model = model;

    // 遍历模型中的所有 mesh，设置缩放、渲染顺序、裁剪和材质
    model.scene.traverse((obj: THREE.Mesh) => {
      if (obj.isMesh) {
        obj.position.multiplyScalar(0.1); // 缩放位置
        obj.scale.multiplyScalar(0.1); // 缩放大小
        obj.renderOrder = -1; // 提前渲染，保证在背景
        obj.frustumCulled = false; // 不进行视锥裁剪，防止云层消失
        // 根据 mesh 名称分配不同材质
        if (obj.name === "Plane011") {
          obj.material = material1;
        } else {
          obj.material = material2;
        }
      }
    });
  }
  addExisting(): void {
    this.container.add(this.model.scene);
  }
  /**
   * 每帧更新云层位置，使其始终跟随相机
   */
  update(): void {
    this.model.scene.position.copy(this.base.camera.position);
  }
}
