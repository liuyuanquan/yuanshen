import * as kokomi from "kokomi.js";
import * as THREE from "three";

import type Experience from "../Experience";

/**
 * ForwardCamera 控制器：实现相机沿 Z 轴前进、停止和冲刺动画
 */
export default class ForwardCamera extends kokomi.Component {
  declare base: Experience;
  params: { speed: number; isRunning: boolean };
  center: THREE.Vector3;
  constructor(base: Experience) {
    super(base);

    // 相机运动参数
    this.params = {
      speed: 500, // 前进速度
      isRunning: true, // 是否自动前进
    };

    // 相机中心点
    this.center = new THREE.Vector3(0, 0, 0);

    this.createDebug();
  }

  /**
   * 每帧更新相机位置，实现持续前进
   * 根据 deltaTime 保证不同帧率下移动距离一致，实现匀速运动
   */
  update(): void {
    if (this.params.isRunning) {
      const delta = this.base.clock.deltaTime; // 获取每帧的时间间隔（秒）
      // 计算本帧应移动的距离向量（沿 Z 轴负方向）
      const moveVec = new THREE.Vector3(0, 0, -this.params.speed * delta);
      this.center.add(moveVec); // 更新中心点位置
      this.base.camera.position.copy(this.center); // 同步相机位置
    }
  }

  /**
   * 创建调试面板
   */
  createDebug() {
    const debug = this.base.debug;
    const params = this.params;

    if (debug.active) {
      const debugFolder = debug.ui!.addFolder("forwardCamera");
      debugFolder.add(params, "speed").min(-500).max(500);
      debugFolder.add(params, "isRunning");
    }
  }
}
