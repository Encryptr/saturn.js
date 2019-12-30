import { Cache } from './Cache.js';

const contextMap = new WeakMap();

export function compileShader(gl, source, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader;
  } else {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return undefined;
  }
}

export function compileProgram(gl, vertexSource, fragmentSource) {
  const vertex = compileShader(gl, vertexSource, gl.VERTEX_SHADER);
  const fragment = compileShader(gl, fragmentSource, gl.FRAGMENT_SHADER);
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return program;
  } else {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return undefined;
  }
}

export function createTexture(gl, image) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,                // mip level
    gl.RGBA,          // internal format
    gl.RGBA,          // format
    gl.UNSIGNED_BYTE, // type
    image,            // data
  );
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return texture;
}

export function createSingleColorTexture(gl, r, g, b) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,                         // level
    gl.RGB,                    // internal format
    1,                         // width
    1,                         // height
    0,                         // border
    gl.RGB,                    // format
    gl.UNSIGNED_BYTE,          // type
    new Uint8Array([r, g, b]), // data
  );
  gl.bindTexture(gl.TEXTURE_2D, null);
  return texture;
}
