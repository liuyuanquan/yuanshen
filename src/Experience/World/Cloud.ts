import * as kokomi from "kokomi.js";
import * as THREE from "three";

import type Experience from "../Experience";

import cloudVertexShader from "../Shaders/Cloud/vert.glsl";
import cloudFragmentShader from "../Shaders/Cloud/frag.glsl";

import { meshList } from "../Data/cloud";
import config from "../config";

/**
 * 云层组件，负责批量实例化和管理场景中的云对象
 */
export default class Cloud extends kokomi.Component {
  declare base: Experience;
  params: {
    color1: string;
    color2: string;
  };
  meshInfos: MeshInfo[];
  uj: kokomi.UniformInjector;
  material: THREE.ShaderMaterial;
  instancedMesh: THREE.InstancedMesh;
  constructor(base: Experience) {
    super(base);

    // 云层颜色参数，可用于调试
    this.params = {
      color1: "#00a2f0",
      color2: "#f0f0f5",
    };

    // 转换 meshList 数据为 THREE 向量，便于后续操作
    const meshInfos = meshList.map((item) => {
      return {
        object: item.object,
        position: new THREE.Vector3(
          item.position[0],
          item.position[2],
          -item.position[1]
        ).multiplyScalar(0.1), // 缩放并调整坐标轴
        rotation: new THREE.Quaternion(),
        scale: new THREE.Vector3(1, 1, 1),
      };
    });
    // 按 z 坐标排序，保证渲染顺序一致
    meshInfos.sort((a, b) => {
      return a.position.z - b.position.z;
    });
    this.meshInfos = meshInfos;

    // 创建云层平面几何体
    const geometry = new THREE.PlaneGeometry(3000, 1500);

    // 创建 UniformInjector，用于统一管理 shader uniform
    const uj = new kokomi.UniformInjector(this.base);
    this.uj = uj;
    console.log("🚀 ~ Cloud ~ constructor ~ uj:", uj.shadertoyUniforms);

    // 创建云层 Shader 材质
    const material = new THREE.ShaderMaterial({
      vertexShader: cloudVertexShader,
      fragmentShader: cloudFragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        ...uj.shadertoyUniforms,
        uTexture: {
          value: this.base.am.items["Tex_0062"], // 云层纹理
        },
        uColor1: {
          value: new THREE.Color(this.params.color1),
        },
        uColor2: {
          value: new THREE.Color(this.params.color2),
        },
      },
    });
    this.material = material;

    // 创建实例化网格，批量渲染所有云层
    const instancedMesh = new THREE.InstancedMesh(
      geometry,
      material,
      meshInfos.length
    );
    this.instancedMesh = instancedMesh;
    this.instancedMesh.frustumCulled = false; // 禁用视锥体裁剪，保证所有云层都被渲染

    this.createDebug();
  }

  /**
   * 将云层实例化网格添加到场景容器，并同步实例矩阵
   */
  addExisting(): void {
    this.container.add(this.instancedMesh);
    this.updateInstance();
  }
  // 将所有物体属性同步到网格上
  updateInstance() {
    this.meshInfos.forEach((item, i) => {
      const mat = new THREE.Matrix4();
      mat.compose(item.position, item.rotation, item.scale);
      this.instancedMesh.setMatrixAt(i, mat);
    });
    this.instancedMesh.instanceMatrix.needsUpdate = true;
  }
  createDebug() {
    const debug = this.base.debug;
    const params = this.params;
    const material = this.material;

    if (debug.active && debug.ui) {
      const debugFolder = debug.ui.addFolder("cloud");
      debugFolder.addColor(params, "color1").onChange((val: string) => {
        material.uniforms.uColor1.value = new THREE.Color(val);
      });
      debugFolder.addColor(params, "color2").onChange((val: string) => {
        material.uniforms.uColor2.value = new THREE.Color(val);
      });
    }
  }
}
