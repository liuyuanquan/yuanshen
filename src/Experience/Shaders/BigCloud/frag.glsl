#include "../Common/aces.glsl"

uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;
varying vec3 vWorldPosition;

uniform sampler2D uTexture;

void main(){
	vec2 uv=vUv;
	
	// 采样云层纹理
	vec4 tex=texture(uTexture,uv);
	
	// 基础云色
	vec3 baseColor=vec3(.090,.569,.980);
	// 根据纹理红色通道调整云的亮度和色彩
	vec3 col=mix(baseColor,vec3(.93),pow(tex.r,.4));
	
	// 使用纹理的 alpha 通道作为透明度
	float alpha=tex.a;
	
	// ACES 色彩映射反变换
	col=ACES_Inv(col);
	
	gl_FragColor=vec4(col,alpha);
}