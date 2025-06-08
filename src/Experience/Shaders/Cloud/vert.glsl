#include "/node_modules/lygia/generative/random.glsl"

uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;// 传递到片元着色器的UV坐标
varying vec3 vWorldPosition;// 传递到片元着色器的世界空间位置

// 通过扭曲UV来随机化云层纹理采样，增强变化感
vec2 distortUV(vec2 uv,vec2 offset){
	vec2 wh=vec2(2.,4.);// 网格分块数
	uv/=wh;
	float rn=ceil(random(offset)*wh.x*wh.y);// 基于偏移的随机数
	vec2 cell=vec2(1.,1.)/wh;
	uv+=vec2(cell.x*mod(rn,wh.x),cell.y*(ceil(rn/wh.x)-1.));
	return uv;
}

void main(){
	vec3 p=position;
	
	#ifdef USE_INSTANCING
	p=vec3(instanceMatrix*vec4(p,1.));
	
	vec3 instPosition=vec3(instanceMatrix*vec4(vec3(0.),1.));
	#endif
	
	// 计算裁剪空间坐标
	gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
	
	// 扭曲UV，增强云层的变化感
	vUv=distortUV(uv,instPosition.xy);
	
	// 计算世界空间位置
	vWorldPosition=vec3(modelMatrix*vec4(p,1));
}