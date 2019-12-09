import * as WebGL from './WebGL/WebGL.js';

(async () => {

  const loader = new WebGL.OBJLoader();
  const geometry = await loader.load('./teapot.obj')
  const material = new WebGL.Material();

  const object = new WebGL.Mesh(geometry, material);

  const canvas = document.querySelector('canvas');
  const renderer = new WebGL.Renderer(canvas);
  const list = new WebGL.RenderList();

  const camera = new WebGL.PerspectiveCamera(Math.PI * 0.5, renderer.aspectRatio, 1, 10000);

  list.add(object);
  object.scale = 2;

  camera.position.z = 10;

  const render = time => {
    renderer.updateAspectRatio();

    object.rotation.set(time/2000, time/2000, time/2000);

    camera.updateProjectionMatrix(Math.PI * 0.5, renderer.aspectRatio, 1, 10000);

    renderer.render(list, camera);
    window.requestAnimationFrame(render);
  }
  window.requestAnimationFrame(render);

})();
