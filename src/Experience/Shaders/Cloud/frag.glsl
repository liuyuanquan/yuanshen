#include "../Common/aces.glsl"

// 通用 Shadertoy 风格 uniform
uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;// 传递的 UV 坐标
varying vec3 vWorldPosition;// 世界空间位置（可用于体积等效果）
varying vec3 vInstPosition;// 实例化时的位置信息（可用于动画等）

uniform sampler2D uTexture;// 云层纹理
uniform vec3 uColor1;// 云层主色
uniform vec3 uColor2;// 云层高光色

void main(){
	vec2 uv=vUv;
	
	// 采样云层纹理
	vec4 tex=texture(uTexture,uv);
	
	// 以 uColor1 为基础色，按纹理红色通道混合到 uColor2，形成云的渐变
	vec3 col=uColor1;
	col=mix(col,uColor2,pow(tex.r,.6));
	
	// 使用纹理 alpha 通道作为透明度
	float alpha=tex.a;
	
	// ACES 色彩映射反变换，提升色彩表现力
	col=ACES_Inv(col);
	
	// 输出最终颜色
	gl_FragColor=vec4(col,alpha);
}