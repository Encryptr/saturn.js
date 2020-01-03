import { Vector3 } from './math/Vector3.js';

// texture wrapping
export const RepeatWrapping = Symbol('REPEAT');
export const ClampToEdgeWrapping = Symbol('CLAMP_TO_EDGE');
export const MirroredRepeatWrapping = Symbol('MIRRORED_REPEAT');

// texture filtering
export const NearestFilter = Symbol('NEAREST');
export const LinearFilter = Symbol('LINEAR');
export const NearestMipmapNearestFilter = Symbol('NEAREST_MIPMAP_NEAREST');
export const LinearMipmapNearestFilter = Symbol('LINEAR_MIPMAP_NEAREST');
export const NearestMipmapLinearFilter = Symbol('NEAREST_MIPMAP_LINEAR');
export const LinearMipmapLinearFilter = Symbol('LINEAR_MIPMAP_LINEAR');

// Euler angle orders
export const XYZ = Symbol('XYZ');
export const ZYX = Symbol('ZYX');

// useful math utils
export const RollAxis = new Vector3(1, 0, 0);
export const PitchAxis = new Vector3(0, 1, 0);
export const YawAxis = new Vector3(0, 0, 1);