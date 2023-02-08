import {
  TextureLoader,
  Vector3,
  Box3,
  // AnimationMixer,
  RGBAFormat,
  RGBFormat,
  // Clock,
  SpotLight,
  SpriteMaterial,
  Sprite,
  LinearFilter,
  // CameraHelper,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { toasts } from "svelte-toasts";
import { navigate } from "svelte-routing";
import { gsap } from "gsap";

import {
  sendAnalytics,
  sendGuestAnalytics,
  GuestAnalyticsType,
} from "@/api/analytics";

import { getAccessToken, getGuestId } from "@/utils";

import { AnalyticsType } from "@/interfaces/analytics";

import type {
  Scene,
  Group,
  Event,
  WebGLRenderer,
  Camera,
  Raycaster,
  Texture,
  Mesh,
  MeshStandardMaterial,
} from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

import type { ProductDetail } from "@/interfaces/retailer";

const retailerName = location.pathname.split("/")[1];
const PRODUCT_NAME = "PRODUCT_";
const PRODUCT_POSITION = new Vector3(0, 4.5, 0);
const PRODUCT_SCALE = 5;
const ORBIT_RADIUS = 3;

export function load3dModel(url: string) {
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
}

export function loadTexture(url: string) {
  return new Promise<Texture>((resolve, reject) => {
    const textureLoader = new TextureLoader();
    textureLoader.load(
      url,
      (texture: Texture) => resolve(texture),
      undefined,
      (error) => reject(error)
    );
  });
}

async function loadHotspotSprite() {
  const map = await loadTexture("/images/hotspot.png");
  map.minFilter = LinearFilter;
  map.magFilter = LinearFilter;
  const material = new SpriteMaterial({ map, color: 0xffffff });
  const sprite = new Sprite(material);
  sprite.scale.set(0.5, 0.5, 0.5);
  sprite.position.set(0, PRODUCT_POSITION.y, ORBIT_RADIUS);
  return sprite;
}

interface RenderOptions {
  scene: Scene;
  renderer: WebGLRenderer;
  camera: Camera;
  raycaster: Raycaster;
}

export async function renderFeaturedProducts(
  featuredProducts3dModels: ProductDetail[],
  { scene, camera, renderer, raycaster }: RenderOptions
) {
  // const clock = new Clock();
  // const mixers: AnimationMixer[] = [];
  let sprite: Sprite;
  let model3ds: GLTF[] = [];
  let requestId = 0;
  let intervalId = 0;

  function showModel(model: Group) {
    model.traverse((object) => {
      if (object.type === "Mesh") {
        object.layers.set(0);
        const material = (object as Mesh).material as MeshStandardMaterial;
        material.format = RGBFormat;
        material.transparent = false;
        gsap.to(material, { duration: 0.75, opacity: 1 });
      }
    });
  }

  function hideModel(model: Group) {
    model.traverse((object) => {
      if (object.type === "Mesh") {
        const material = (object as Mesh).material as MeshStandardMaterial;
        // NOTE: `.format` will be replaced with `.alphaWrite`
        // https://github.com/mrdoob/three.js/issues/22598
        material.format = RGBAFormat;
        material.transparent = true;
        gsap.to(material, {
          duration: 0.75,
          opacity: 0,
          onComplete: () => {
            object.layers.set(1);
          },
        });
      }
    });
  }

  async function onClick(event: Event) {
    event.preventDefault();
    // const raycaster = new Raycaster();
    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = {
      x: ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1,
      y: (-(event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1,
    };
    raycaster.setFromCamera(mouse, camera);

    const sceneGroup = scene.children.filter((child) => {
      return child.name.substring(0, PRODUCT_NAME.length) === PRODUCT_NAME;
    });
    const intersects = raycaster.intersectObjects(sceneGroup, true);

    /* scene.add(
      new ArrowHelper(
        raycaster.ray.direction,
        raycaster.ray.origin,
        30000,
        0xff0000
      )
    ); */
    // animate();

    if (intersects.length > 0) {
      event.stopPropagation();

      try {
        if (getAccessToken()) {
          await sendAnalytics({
            type: AnalyticsType.NH_FEATURED_PRODUCT,
            entryType: "start",
            productId: intersects[0].object.parent.name.replace(
              PRODUCT_NAME,
              ""
            ),
          });
        } else {
          await sendGuestAnalytics({
            type: GuestAnalyticsType.NH_FEATURED_PRODUCT,
            entryType: "start",
            productId: intersects[0].object.parent.name.replace(
              PRODUCT_NAME,
              ""
            ),
            guestId: getGuestId(),
          });
        }
      } catch (error) {
        console.error(error);
      }

      navigate(
        `/${retailerName}/product/${intersects[0].object.parent.name.replace(
          PRODUCT_NAME,
          ""
        )}`
      );
      /* console.log(
        123,
        // This should be the product's name
        `/product/${intersects[0].object.parent.name.replace(PRODUCT_NAME, "")}`
      ); */
    }
  }

  function animate() {
    // `getDelta()` value must be saved in variable first.
    // Otherwise, subsequent `getDelta()` calls in this loop will return same value
    /* const delta = clock.getDelta();
    mixers.forEach((mixer) => {
      mixer.update(delta);
    }); */

    // const date = Date.now() * 0.001;
    if (sprite) {
      // sprite.position.x = Math.cos(camera.position.x) * orbitRadius;
      // sprite.position.z = Math.sin(date) * orbitRadius;
      const distance = PRODUCT_POSITION.distanceTo(camera.position);
      sprite.position
        .subVectors(PRODUCT_POSITION, camera.position)
        .setLength(distance - ORBIT_RADIUS)
        .add(camera.position);
    }

    model3ds.forEach((model) => {
      // model.scene.rotateY((2 * Math.PI) / 360);
      // model.scene.rotation.y += (2 * Math.PI) / 360;
      model.scene.rotateOnWorldAxis(new Vector3(1, 0, 0), Math.PI / 360);
    });

    return requestAnimationFrame(animate);
  }

  function unsubscribe() {
    clearInterval(intervalId);
    renderer.domElement.removeEventListener("click", onClick, false);
    cancelAnimationFrame(requestId);
  }

  renderer.domElement.addEventListener("click", onClick, false);

  try {
    let currentIndex = 0;
    model3ds = await Promise.all(
      featuredProducts3dModels.map(({ model3dUrl }) => load3dModel(model3dUrl))
    );

    model3ds.forEach((model, index) => {
      /* const mixer = new AnimationMixer(model.scene);
      model.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
      mixers.push(mixer); */

      const size = new Vector3();
      const box = new Box3().setFromObject(model.scene);
      box.getSize(size);
      const scaleVec = new Vector3(
        PRODUCT_SCALE,
        PRODUCT_SCALE,
        PRODUCT_SCALE
      ).divide(size);
      const scale = Math.min(scaleVec.x, Math.min(scaleVec.y, scaleVec.z));
      model.scene.scale.setScalar(scale);
      model.scene.position.y = PRODUCT_POSITION.y;
      model.scene.rotation.y = Math.PI / 2;
      model.scene.rotation.x = Math.PI / 2;
      // model.name = PRODUCT_NAME + featuredProducts3dModels[index].id;
      model.scene.traverse((object) => {
        object.name = PRODUCT_NAME + featuredProducts3dModels[index].id;
      });

      if (model3ds.length > 1) {
        hideModel(model.scene);
      }

      scene.add(model.scene);
    });

    if (model3ds[currentIndex]) {
      showModel(model3ds[currentIndex++].scene);
    }

    intervalId = window.setInterval(() => {
      if (model3ds.length > 1) {
        // Hide previous model
        const previous3dModel = model3ds[currentIndex - 1];
        hideModel(previous3dModel.scene);
        // console.log(123, previous3dModel.children[0]?.material)

        if (!model3ds[currentIndex]) {
          currentIndex = 0;
        }

        showModel(model3ds[currentIndex++].scene);
      }
    }, 10000);

    try {
      if (featuredProducts3dModels.length) {
        sprite = await loadHotspotSprite();
        scene.add(sprite);
      }
    } catch (error) {
      console.error("Error rendering hotspot");
    }

    requestId = animate();

    return unsubscribe;
  } catch (error) {
    // toasts.error("Featured Products Error", error.message);
    console.error("Featured Products Error", error.message);
    return unsubscribe;
  }
}

interface SpotLightOptions {
  scene: Scene;
}

export function setSpotLight({ scene }: SpotLightOptions) {
  const parentContainer = document.getElementById(
    "parent-container"
  ) as HTMLDivElement;

  const spotLight = new SpotLight(0xffffff, 3);
  spotLight.position.set(0, PRODUCT_POSITION.y, 7);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width =
    parentContainer.clientWidth * window.devicePixelRatio;
  spotLight.shadow.mapSize.height =
    parentContainer.clientHeight * window.devicePixelRatio;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;

  scene.add(spotLight);
  // const helper = new CameraHelper(spotLight.shadow.camera);
  // scene.add(helper);
}
