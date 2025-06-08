// 渐变背景片元着色器

uniform vec3 uColor1;// 第一段颜色
uniform vec3 uColor2;// 第二段颜色
uniform vec3 uColor3;// 第三段颜色
uniform float uStop1;// 第一段渐变终止位置
uniform float uStop2;// 第二段渐变终止位置

#include "../Common/aces.glsl"// ACES 色彩映射工具

// 主函数，兼容 Shadertoy 风格
void mainImage(out vec4 fragColor,in vec2 fragCoord){
	// 归一化屏幕坐标
	vec2 uv=fragCoord/iResolution.xy;
	
	// 读取颜色参数
	vec3 col1=uColor1;
	vec3 col2=uColor2;
	vec3 col3=uColor3;
	float stop1=uStop1;
	float stop2=uStop2;
	
	// 计算 y 方向（自下而上）
	float y=1.-uv.y;
	// 计算每一段的混合权重
	float mask1=1.-smoothstep(0.,stop1,y);// 第一段
	float mask2=smoothstep(0.,stop1,y)*(1.-smoothstep(stop1,stop2,y));// 第二段
	float mask3=smoothstep(stop1,stop2,y);// 第三段
	// 叠加三段颜色
	vec3 col=vec3(0.);
	col+=col1*mask1;
	col+=col2*mask2;
	col+=col3*mask3;
	
	// ACES 色彩映射反变换
	col=ACES_Inv(col);
	
	// 输出最终颜色
	fragColor=vec4(col,1.);
}