import * as kokomi from "kokomi.js";
import * as THREE from "three";
import type Experience from "../Experience";
import gradientBackgroundFragmentShader from "../Shaders/GradientBackground/frag.glsl";

type GradientParams = {
  color1: string;
  color2: string;
  color3: string;
  stop1: number;
  stop2: number;
};

/**
 * 渐变背景组件，基于全屏Shader实现
 */
export default class GradientBackground extends kokomi.Component {
  declare base: Experience;
  params: GradientParams;
  quad: kokomi.ScreenQuad;

  constructor(base: Experience) {
    super(base);

    // 渐变参数
    this.params = {
      color1: "#001c54",
      color2: "#023fa1",
      color3: "#26a8ff",
      stop1: 0.2,
      stop2: 0.6,
    };

    // 创建全屏Shader平面
    this.quad = new kokomi.ScreenQuad(this.base, {
      fragmentShader: gradientBackgroundFragmentShader,
      shadertoyMode: true, // 兼容 Shadertoy 风格的 Shader 代码
      uniforms: {
        uColor1: { value: new THREE.Color(this.params.color1) },
        uColor2: { value: new THREE.Color(this.params.color2) },
        uColor3: { value: new THREE.Color(this.params.color3) },
        uStop1: { value: this.params.stop1 },
        uStop2: { value: this.params.stop2 },
      },
    });

    // 设置平面属性，使其始终作为背景渲染
    const mesh = this.quad.mesh;
    mesh.position.z = -1000; // 放到场景最后
    mesh.renderOrder = -1; // 最先渲染
    mesh.frustumCulled = false; // 不进行视锥裁剪

    // 关闭深度写入，防止遮挡前景
    const material = this.quad.mesh.material as THREE.ShaderMaterial;
    material.depthWrite = false;

    this.createDebug();
  }

  /**
   * 添加到场景中
   */
  addExisting(): void {
    this.quad.addExisting();
  }

  /**
   * 创建调试面板，支持实时调整渐变参数
   */
  createDebug() {
    const debug = this.base.debug;
    const params = this.params;
    const material = this.quad.mesh.material as THREE.ShaderMaterial;

    if (debug.active) {
      const debugFolder = debug.ui!.addFolder("background");
      debugFolder.addColor(params, "color1").onChange((val: string) => {
        material.uniforms.uColor1.value = new THREE.Color(val);
      });
      debugFolder.addColor(params, "color2").onChange((val: string) => {
        material.uniforms.uColor2.value = new THREE.Color(val);
      });
      debugFolder.addColor(params, "color3").onChange((val: string) => {
        material.uniforms.uColor3.value = new THREE.Color(val);
      });
      debugFolder.add(params, "stop1", 0, 1).onChange((val: number) => {
        material.uniforms.uStop1.value = val;
      });
      debugFolder.add(params, "stop2", 0, 1).onChange((val: number) => {
        material.uniforms.uStop2.value = val;
      });
    }
  }
}
