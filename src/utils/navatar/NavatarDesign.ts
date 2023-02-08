import {
  ACESFilmicToneMapping,
  Color,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SpotLight,
  Vector3,
  WebGLRenderer,
  sRGBEncoding,
  TextureLoader,
  LinearFilter,
  AnimationMixer,
  AnimationClip,
  Cache,
} from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";

let canvas: HTMLCanvasElement;
let renderer: WebGLRenderer;
let scene: Scene;
let camera: PerspectiveCamera;
let spotLight: SpotLight;
let gltfModel: Group;

const SKIN_TONE_PARTS = ["face", "skin"];
const HAIR_COLOR_PARTS = ["hair"];
const LOOKBOOK_PARTS = ["face"];
// const envSrc = "/model/photo_studio_01_1k.exr";

const sizes = {
  width: 0,
  height: 0,
};

export const initScene = async (el: HTMLCanvasElement) => {
  try {
    const container = document.getElementById("canvas-container-designer");

    Cache.enabled = true;
    if (el) {
      canvas = el;
      sizes.width = container.offsetWidth;
      sizes.height = container.offsetHeight;
    } else {
      return;
    }

    releaseUsedMemory(renderer, scene);

    renderer = new WebGLRenderer({
      antialias: true,
      canvas: canvas,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = sRGBEncoding;
    renderer.setSize(sizes.width, sizes.height);
    // renderer.physicallyCorrectLights = true;

    const background = await new TextureLoader().loadAsync(
      "/images/red-background.png"
    );
    background.minFilter = LinearFilter;
    background.magFilter = LinearFilter;

    scene = new Scene();
    scene.background = background;
    scene.background.encoding = sRGBEncoding;

    camera = new PerspectiveCamera(45, sizes.width / sizes.height, 0.25, 20);
    camera.lookAt(new Vector3(0, 0, 0));

    const spotLight = new SpotLight(0xffffff, 1.5);
    spotLight.position.set(1, 2, 7);
    scene.add(spotLight);

    // window.addEventListener("resize", resize(renderer, camera), false);

    // const exrLoader = await new EXRLoader().loadAsync(envSrc);
    // const pmremGenerator = new PMREMGenerator(renderer);
    // pmremGenerator.compileEquirectangularShader();

    // const envMap = pmremGenerator.fromEquirectangular(exrLoader);
    // scene.environment = envMap.texture;
    // exrLoader.dispose();
    // pmremGenerator.dispose();

    return {
      threeObject: {
        renderer,
        scene,
        camera,
      },
    };
  } catch (error) {
    console.log({ error });
  }
};

const render = (renderer: WebGLRenderer) => {
  renderer.render(scene, camera);
};

export const changeHeadModel = async (
  skinTone: string,
  hairColor: string,
  lookbookTexture: string,
  headURL: string,
  threeObjects: {
    renderer: WebGLRenderer;
    scene: Scene;
    camera: PerspectiveCamera;
  }
) => {
  try {
    if (gltfModel) {
      scene.remove(gltfModel);
      scene.remove(scene.getObjectByName("headGroup"));
    }

    const headModel = await getModel(headURL);
    const lookbook = await new TextureLoader().loadAsync(lookbookTexture);

    headModel.scene.traverse((obj) => {
      if (obj.type === "SkinnedMesh") {
        const material = (obj as Mesh).material as MeshStandardMaterial;
        material.needsUpdate = true;
        const isIncluded = (part: string) =>
          material.name.toLowerCase().includes(part);

        if (HAIR_COLOR_PARTS.some(isIncluded)) {
          material.map = null;
          material.color = new Color(hairColor).convertSRGBToLinear();
        }

        if (SKIN_TONE_PARTS.some(isIncluded)) {
          material.color = new Color(skinTone).convertSRGBToLinear();
          if (material.map) {
            material.map.encoding = sRGBEncoding;
          }
        }

        if (LOOKBOOK_PARTS.some(isIncluded)) {
          lookbook.flipY = false;
          material.map = lookbook;
          material.map.encoding = sRGBEncoding;
        }
      }
    });

    const group = new Group();
    group.name = "headGroup";
    group.add(headModel.scene);
    // group.position.set(0.02, -1.17, 0);
    group.position.set(0, -1.18, 0);
    group.scale.set(1.2, 1.2, 1.2);

    gltfModel = group;
    threeObjects.scene.add(gltfModel);
    threeObjects.camera.position.set(0, 0, 0.7);
    const mixer1 = new AnimationMixer(headModel.scene);
    mixer1
      .clipAction(AnimationClip.findByName(headModel.animations, "idle"))
      .play();
    mixer1.update(0);
    resize(threeObjects.renderer, threeObjects.camera);
    render(threeObjects.renderer);
  } catch (error) {
    console.log({ error });
    if (gltfModel) {
      scene.remove(gltfModel);
      scene.remove(scene.getObjectByName("headGroup"));
    }
  }
};

export const changeOutfitModel = async (
  skinTone: string,
  hairColor: string,
  lookbookTexture: string,
  headURL: string,
  bodyURL: string,
  threeObjects: {
    renderer: WebGLRenderer;
    scene: Scene;
    camera: PerspectiveCamera;
  }
) => {
  try {
    if (gltfModel) {
      scene.remove(gltfModel);
      scene.remove(scene.getObjectByName("headGroup"));
      scene.remove(scene.getObjectByName("headBodyGroup"));
    }

    // HEAD
    const headModel = await getModel(headURL);
    const lookbook = await new TextureLoader().loadAsync(lookbookTexture);

    headModel.scene.traverse((obj) => {
      if (obj.type === "SkinnedMesh") {
        const material = (obj as Mesh).material as MeshStandardMaterial;
        material.needsUpdate = true;
        const isIncluded = (part: string) =>
          material.name.toLowerCase().includes(part);

        if (HAIR_COLOR_PARTS.some(isIncluded)) {
          material.map = null;
          material.color = new Color(hairColor).convertSRGBToLinear();
        }

        if (SKIN_TONE_PARTS.some(isIncluded)) {
          material.color = new Color(skinTone).convertSRGBToLinear();
          if (material.map) {
            material.map.encoding = sRGBEncoding;
          }
        }

        if (LOOKBOOK_PARTS.some(isIncluded)) {
          lookbook.flipY = false;
          material.map = lookbook;
          material.map.encoding = sRGBEncoding;
        }
      }
    });

    // BODY
    const bodyModel = await getModel(bodyURL);
    bodyModel.scene.traverse((obj) => {
      if (obj.type === "SkinnedMesh") {
        const material = (obj as Mesh).material as MeshStandardMaterial;
        material.needsUpdate = true;
        const isIncluded = (part: string) =>
          material.name.toLowerCase().includes(part);

        if (SKIN_TONE_PARTS.some(isIncluded)) {
          material.color = new Color(skinTone).convertSRGBToLinear();
          if (material.map) {
            material.map.encoding = sRGBEncoding;
          }
        }
      }
    });

    const group = new Group();
    group.name = "headBodyGroup";
    group.add(headModel.scene);
    group.add(bodyModel.scene);
    group.position.set(0, -0.55, 0);

    threeObjects.camera.position.set(0, 0, 1.7);

    gltfModel = group;
    threeObjects.scene.add(gltfModel);

    const mixer1 = new AnimationMixer(headModel.scene);
    mixer1
      .clipAction(AnimationClip.findByName(headModel.animations, "idle"))
      .play();
    mixer1.update(0);

    const mixer2 = new AnimationMixer(bodyModel.scene);
    mixer2
      .clipAction(AnimationClip.findByName(bodyModel.animations, "idle"))
      .play();
    mixer2.update(0);

    resize(threeObjects.renderer, threeObjects.camera);
    render(threeObjects.renderer);
  } catch (error) {
    console.log({ error });
    if (gltfModel) {
      scene.remove(gltfModel);
      scene.remove(scene.getObjectByName("headGroup"));
      scene.remove(scene.getObjectByName("headBodyGroup"));
    }
  }
};

const getModel = async (url: string) => {
  return new Promise<GLTF>((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        resolve(gltf);
      },
      undefined,
      (error) => {
        reject(error);
      }
    );
  });
};

export const resize = (renderer: WebGLRenderer, camera: PerspectiveCamera) => {
  const container = document.getElementById("canvas-container-designer");
  if (!container) return;

  // Update sizes
  sizes.width = container.offsetWidth;
  sizes.height = container.offsetHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
};

export const removeListener = () => {
  // window.removeEventListener("resize", resize, false);
};

export const releaseUsedMemory = (renderer: WebGLRenderer, scene: Scene) => {
  if (scene && renderer) {
    scene.remove(spotLight);
    scene.remove(gltfModel);
    scene.remove(scene.getObjectByName("headGroup"));
    scene.remove(scene.getObjectByName("headBodyGroup"));
    renderer.dispose();
  }
};
