import * as THREE from 'three';
import ModelBone from './ModelBone.js';
import { updateBone } from './skeleton.js';

class ModelSkeleton {
  #root: THREE.Object3D;
  #bones: ModelBone[];
  #boneTexture: THREE.DataTexture;
  #boneMatrices: Float32Array;

  constructor(root: THREE.Object3D, bones: ModelBone[] = []) {
    this.#root = root;
    this.#bones = bones;

    this.#createBoneData();
  }

  get bones() {
    return this.#bones;
  }

  get boneTexture() {
    return this.#boneTexture;
  }

  dispose() {
    if (this.#boneTexture) {
      this.#boneTexture.dispose();
    }
  }

  updateBones(camera: THREE.Camera) {
    // Ensure model view matrix is synchronized
    this.#root.modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, this.#root.matrixWorld);

    for (const [index, bone] of this.#bones.entries()) {
      updateBone(this.#root, bone);
      bone.matrix.toArray(this.#boneMatrices, index * 16);
    }

    this.#boneTexture.needsUpdate = true;
  }

  /**
   * From Skeleton#computeBoneTexture in Three.js. Creates bone matrices array and bone texture.
   *
   * @private
   */
  #createBoneData() {
    let size = Math.sqrt(this.#bones.length * 4);
    size = Math.ceil(size / 4) * 4;
    size = Math.max(size, 4);

    const boneMatrices = new Float32Array(size * size * 4);

    const boneTexture = new THREE.DataTexture(
      boneMatrices,
      size,
      size,
      THREE.RGBAFormat,
      THREE.FloatType,
    );
    boneTexture.needsUpdate = true;

    this.#boneMatrices = boneMatrices;
    this.#boneTexture = boneTexture;
  }
}

export default ModelSkeleton;
