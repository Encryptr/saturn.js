# saturn.js
Small 3D engine built on WebGL 2.0

*Note: all current modules have been deprecated. The engine will be rewritten soon*


## Intended Features:
* **Renderers**
  - [ ] `ForwardRenderer`
  - [ ] `DeferredRenderer` (?)
  - [ ] `RenderList`

* **Materials**
  - [ ] `ShaderMaterial`
  - [ ] `FlatMaterial`
  - [ ] `LambertMaterial`
  - [ ] `PhongMaterial`
  
* **Math Utilities**
  - [x] `Matrix4`
  - [x] `Vector4`
  - [x] `Vector3`
  - [ ] `Vector2`
  - [ ] `Quaternion` (?)

* **Lights**
  - [ ] `PointLight`
  - [ ] `DirectionalLight`
  - [ ] `SpotLight`

* **Scene-Graph**
  - [ ] `RenderObject`
  - [ ] `Mesh`

* **Loaders**
  - [ ] `GLTFLoader`

* **Misc.**
  - [ ] `Geometry`
  - [ ] `TextureLoader`, `Texture`

## Example Usages

**Math Utilities:**
```javascript
import * as SATURN from './saturn/saturn.js';

const a = new SATURN.Matrix4([
  3, 0, 0, 0,
  0, 6, 0, 0,
  0, 0, 5, 0,
  1, 9, 8, 1,
]);
const b = SATURN.Matrix4.makeRotationX(Math.PI / 2);
const c = b.clone().multiply(a);

const u = new SATURN.Vector3(0, 1, 0);
const v = u.clone().applyMatrix4(b);
```
