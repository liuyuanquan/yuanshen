uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;
varying vec3 vWorldPosition;

void main(){
	vec3 p=position;
	
	// 如果启用实例化，应用实例变换矩阵
	#ifdef USE_INSTANCING
	p=vec3(instanceMatrix*vec4(p,1.));
	#endif
	
	// 计算裁剪空间坐标
	gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
	
	// 传递并翻转y轴的uv坐标
	vUv=uv;
	vUv.y=1.-uv.y;
	
	// 计算世界空间位置
	vWorldPosition=vec3(modelMatrix*vec4(p,1.));
}