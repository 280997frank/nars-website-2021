import {
  ACESFilmicToneMapping,
  AmbientLight,
  Color,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SpotLight,
  Vector3,
  WebGLRenderer,
  TextureLoader,
  sRGBEncoding,
  LinearFilter,
  AnimationMixer,
  AnimationClip,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { generateImageProduct, generateStaticImage } from "./generate";
import type { IProduct } from "@/interfaces/product";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";

let canvas: HTMLCanvasElement;
let renderer: WebGLRenderer;
let controls: OrbitControls;
let scene: Scene;
let camera: PerspectiveCamera;
let loader: GLTFLoader;
let light: AmbientLight;
let spotLight: SpotLight;
let gltfModel: Group;

const envSrc = "/model/photo_studio_01_1k.exr";
export const SKIN_TONE_PARTS = ["face", "skin"];
export const HAIR_COLOR_PARTS = ["hair"];
export const LOOKBOOK_PARTS = ["face"];

const sizes = {
  width: 0,
  height: 0,
};

const init = async (el: HTMLCanvasElement, id: string) => {
  try {
    const container = document.getElementById(id) as HTMLDivElement;

    if (el) {
      canvas = el;
      sizes.width = container.offsetWidth;
      sizes.height = container.offsetHeight;
    } else {
      return;
    }

    const background = await new TextureLoader().loadAsync(
      "/images/red-background.png"
    );
    scene = new Scene();
    scene.background = background;
    scene.background.encoding = sRGBEncoding;

    camera = new PerspectiveCamera(45, sizes.width / sizes.height, 0.25, 20);

    loader = new GLTFLoader();

    light = new AmbientLight(0x404040); // soft white light
    scene.add(light);

    const spotLight = new SpotLight(0xfff, 1.5);
    spotLight.position.set(1, 2, 7);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = sizes.width;
    spotLight.shadow.mapSize.height = sizes.height;
    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;
    scene.add(spotLight);

    camera.position.set(0, 0, 1.7);
    camera.lookAt(new Vector3(0, 0, 0));

    renderer = new WebGLRenderer({
      antialias: true,
      canvas: el,
      alpha: true,
      preserveDrawingBuffer: true,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = sRGBEncoding;
    renderer.physicallyCorrectLights = true;
    renderer.setSize(sizes.width, sizes.height);

    // Setup Environment
    const pmremGenerator = new PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const exrLoader = await new EXRLoader().loadAsync(envSrc);
    const envMap = pmremGenerator.fromEquirectangular(exrLoader);
    scene.environment = envMap.texture;
    exrLoader.dispose();
    pmremGenerator.dispose();

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enableZoom = false;

    window.addEventListener("resize", resize, false);
  } catch (error) {
    console.log({ error });
  }
};

const animate = () => {
  const requestId = requestAnimationFrame(animate);
  resize();
  renderer.outputEncoding = sRGBEncoding;
  renderer.render(scene, camera);
  controls.update();

  return requestId;
};

export const createScene = async (
  el: HTMLCanvasElement,
  id: string,
  skinTone: string,
  hairColor: string,
  lookbookTexture: string,
  headURL: string,
  bodyURL: string
) => {
  try {
    await init(el, id);

    // HEAD
    const headModel = await getModel(headURL);
    const lookbook = await new TextureLoader().loadAsync(lookbookTexture);
    lookbook.minFilter = LinearFilter;
    lookbook.magFilter = LinearFilter;

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
    group.add(headModel.scene);
    group.add(bodyModel.scene);
    group.position.set(0, -0.6, 0);

    gltfModel = group;
    scene.add(group);

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

    return animate();
  } catch (error) {
    console.log({ error });
    return 0;
  }
};

const getModel = async (url: string) => {
  return new Promise<GLTF>((resolve, reject) => {
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

export const share = async (qrCodePath, products) => {
  const productThumbnailUrls = [];

  products.map((x) => {
    productThumbnailUrls.push(x.image);
  });

  return await generateStaticImage({
    qrCodePath,
    source: canvas,
    productThumbnailUrls: productThumbnailUrls,
  });
};

export const shareProduct = async (
  source: IProduct,
  canvas: HTMLDivElement
) => {
  return await generateImageProduct({
    width: canvas.clientWidth,
    source,
  });
};

export const resize = () => {
  // Update sizes
  sizes.width = canvas.offsetWidth;
  sizes.height = canvas.offsetHeight;

  // // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
};

export const removeListener = () => {
  window.removeEventListener("resize", resize, false);
};

export const releaseUsedMemory = () => {
  if (scene) {
    scene.remove(light);
    scene.remove(spotLight);
    scene.remove(gltfModel);
    scene.remove(scene.getObjectByName("headGroup"));
    scene.remove(scene.getObjectByName("headBodyGroup"));
    renderer.dispose();
  }
};
