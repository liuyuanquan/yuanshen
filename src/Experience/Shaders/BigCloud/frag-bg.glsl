uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;
varying vec3 vWorldPosition;

uniform sampler2D uTexture;

void main(){
	vec2 uv=vUv;
	
	// 采样背景云层纹理
	vec4 tex=texture(uTexture,uv);
	
	// 背景云层颜色（可根据需要调整为更自然的白色或淡蓝色）
	vec3 col=vec3(1.8);
	
	// 使用纹理红色通道控制透明度，增强层次感
	float alpha=tex.r*.4;
	
	gl_FragColor=vec4(col,alpha);
}