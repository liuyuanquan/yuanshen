import * as kokomi from "kokomi.js";
import * as THREE from "three";
import * as STDLIB from "three-stdlib";

import type Experience from "../Experience";

import { meshList } from "../Data/column";

/**
 * 柱子组件，负责批量实例化和管理场景中的柱子对象
 */
export default class Column extends kokomi.Component {
  declare base: Experience;
  meshInfos: MeshInfo[];
  instanceInfos: InstanceInfo[];
  constructor(base: Experience) {
    super(base);

    // 1. 转换 meshList 数据为 THREE 向量和四元数，便于后续操作
    const meshInfos = meshList.map((item) => {
      return {
        object: item.object,
        position: new THREE.Vector3(
          item.position[0],
          item.position[2],
          -item.position[1]
        ).multiplyScalar(0.1), // 缩放并调整坐标轴
        rotation: new THREE.Quaternion().setFromEuler(
          new THREE.Euler(item.rotation[0], item.rotation[2], item.rotation[1])
        ),
        scale: new THREE.Vector3(
          item.scale[0],
          item.scale[2],
          item.scale[1]
        ).multiplyScalar(0.1), // 缩放并调整坐标轴
      };
    });
    this.meshInfos = meshInfos;

    // 2. 按 object 字段分组，便于实例化管理
    const meshGroup: Record<string, MeshInfo[]> = {};
    meshInfos.forEach((item) => {
      const key = item.object;
      if (!meshGroup[key]) {
        meshGroup[key] = [];
      }
      meshGroup[key].push(item);
    });

    this.instanceInfos = Object.entries(meshGroup).map(([k, v]) => ({
      object: k,
      instanceList: v,
      meshList: [],
    }));

    // 4. 为每一组柱子创建 InstancedMesh，提升渲染效率
    this.instanceInfos.forEach((item) => {
      const model = this.base.am.items[item.object] as STDLIB.GLTF;
      // 遍历模型中的所有 mesh
      // @ts-ignore
      model.scene.traverse((obj: THREE.Mesh) => {
        if (obj.isMesh) {
          // 创建实例化网格
          const im = new THREE.InstancedMesh(
            obj.geometry,
            obj.material,
            item.instanceList.length // 实例数量（即要生成多少个柱子）
          );
          im.castShadow = true; // 允许该实例化网格投射阴影
          im.frustumCulled = false; // 禁用视锥体裁剪，保证所有实例都被渲染
          item.meshList.push(im);
        }
      });
    });
  }

  /**
   * 将所有实例化网格添加到场景容器
   */
  addExisting(): void {
    this.instanceInfos.forEach((item) => {
      item.meshList.forEach((e) => {
        this.container.add(e);
      });
    });
  }

  /**
   * 每帧更新
   */
  update(): void {
    this.updateInstance();
  }

  /**
   * 将所有物体的变换属性同步到实例化网格
   */
  updateInstance() {
    const tempMatrix = new THREE.Matrix4(); // 复用一个临时矩阵
    this.instanceInfos.forEach((item) => {
      item.meshList.forEach((mesh) => {
        item.instanceList.forEach((e, i) => {
          if (item.instanceList.length === 0) return;
          tempMatrix.compose(e.position, e.rotation, e.scale); // 用 position、rotation、scale 组合出实例的变换矩阵
          mesh.setMatrixAt(i, tempMatrix); // 将变换矩阵设置到 InstancedMesh 的第 i 个实例
        });
        mesh.instanceMatrix.needsUpdate = true; // Three.js 才会在下次渲染时把新的矩阵数据同步到 GPU，渲染出最新的实例效果。
      });
    });
  }
}
