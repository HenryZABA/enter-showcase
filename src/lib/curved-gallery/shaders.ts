export const vertexSource = `
precision highp float;
attribute vec2 a_position;
uniform vec2 u_view;
uniform vec2 u_size;
uniform float u_center;
uniform float u_camera;
uniform float u_speed;
uniform float u_hover;
varying vec2 v_uv;
varying float v_light;
const float PI=3.141592653589793;
void main(){
 v_uv=vec2(a_position.x*.5+.5,.5-a_position.y*.5);
 float halfW=u_view.x*.5;
 float x=u_center+a_position.x*u_size.x*.5;
 float y=a_position.y*u_size.y*.5;
 float q=x/halfW*1.15-.2;
 float wave=sin(PI*q)*exp(-q*q);
 float slope=(PI*cos(PI*q)-2.*q*sin(PI*q))*exp(-q*q);
 float z=-halfW*.2*(1.+1.1*u_speed)*wave;
 float roll=-.16*slope/PI+1.8*u_speed*smoothstep(.3,.9,abs(x/halfW))*sign(x/halfW);
 float originalY=y;
 y=originalY*cos(roll)-z*sin(roll);
 z=originalY*sin(roll)+z*cos(roll);
 y+=.03*x;
 float edge=clamp(x/halfW,-1.,1.);
 z+=-.12*halfW*edge*(1.5-.5*edge*edge);
 float rear=1.-smoothstep(-1.,.3,x/halfW);
 y+=.1*halfW*u_speed*rear;
 z+=.2*halfW*u_speed*rear;
 float dome=(1.-a_position.x*a_position.x)*(1.-a_position.y*a_position.y);
 z-=u_hover*.1*u_size.y*dome;
 v_light=clamp(.94+.06*cos(slope*.35+roll)+.08*z/u_camera,.82,1.02);
 gl_Position=vec4(x/halfW,-y/(u_view.y*.5),-z/(u_camera*4.),1.-z/u_camera);
}`;

export const fragmentSource = `
precision highp float;
uniform sampler2D u_media;
uniform sampler2D u_overlay;
uniform vec2 u_size;
varying vec2 v_uv;
varying float v_light;
void main(){
 vec2 p=abs((v_uv-.5)*u_size)-(u_size*.5-18.);
 float rounded=length(max(p,0.))+min(max(p.x,p.y),0.)-18.;
 if(rounded>0.)discard;
 vec4 image=texture2D(u_media,v_uv);
 vec4 overlay=texture2D(u_overlay,v_uv);
 vec3 color=mix(image.rgb*v_light,overlay.rgb,overlay.a);
 float rim=(1.-smoothstep(-1.,0.,rounded))*.025;
 gl_FragColor=vec4(color+rim,1.);
}`;

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to allocate gallery shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) || "Gallery shader failed";
    gl.deleteShader(shader);
    throw new Error(message);
  }
  return shader;
};

export function createProgram(gl: WebGLRenderingContext) {
  const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!program) throw new Error("Unable to allocate gallery program");
  gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
  gl.deleteShader(vertex); gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || "Gallery program failed");
  return program;
}

export function createMesh(gl: WebGLRenderingContext) {
  const positions: number[] = [], indices: number[] = [], steps = 40;
  for (let y=0;y<=steps;y++) for(let x=0;x<=steps;x++) positions.push(x/steps*2-1,y/steps*2-1);
  for (let y=0;y<steps;y++) for(let x=0;x<steps;x++) { const a=y*(steps+1)+x,b=a+steps+1; indices.push(a,b,a+1,a+1,b,b+1); }
  const vertex=gl.createBuffer(),index=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,vertex);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(positions),gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,index);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
  return {vertex,index,count:indices.length};
}
