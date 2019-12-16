const ShaderUtil = {
  createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      return shader;
    
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return undefined;
  },
  createProgram(gl, vertex, fragment) {
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) 
      return program;
    
    console.warn(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return undefined;
  },
}

export { ShaderUtil };
