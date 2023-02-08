import type * as T from "three";
import * as TH from "three";
import { gsap } from "gsap";
import { DragControls } from "three/examples/jsm/controls/DragControls.js";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import * as SkeletonUtils from "../../node_modules/three/examples/jsm/utils/SkeletonUtils.js";
import { Text } from "troika-three-text";
import {
  HAIR_COLOR_PARTS,
  LOOKBOOK_PARTS,
  SKIN_TONE_PARTS,
} from "utils/navatar/NavatarDesignResult";
import { getNavatar } from "@/api/navatar";
import { INavatarAnimation, navatarAnimation } from "@/constants/hotspots";

export const createDragControls = (
  draggedObjects: T.Object3D[],
  camera: T.Camera,
  dom: HTMLElement
) => {
  const dragControls = new DragControls(draggedObjects, camera, dom);

  dragControls.addEventListener("dragstart", () => {
    console.log("dragstart");
  });

  // dragControls.addEventListener("drag", (e) => {
  //   e.object.position.y = 0.1;
  // });

  dragControls.addEventListener("dragend", (e) => {
    console.log("dragend", e.object.position);
  });
};

export const createVideoElement = (src: string) => {
  const video = document.createElement("video");
  video.src = src;
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.crossOrigin = "anonymous|use-credentials";
  video.playsInline = true;
  // video.play();
  return video;
};

export const createVideoTexture = (video: HTMLVideoElement): T.VideoTexture => {
  const videoTexture = new TH.VideoTexture(video);
  videoTexture.magFilter = TH.LinearFilter;
  videoTexture.minFilter = TH.LinearFilter;
  videoTexture.encoding = TH.sRGBEncoding;
  videoTexture.flipY = false;
  videoTexture.needsUpdate = true;

  return videoTexture;
};

export const createImageTexture = (src: string): T.Texture => {
  const texture = new TH.TextureLoader().load(src);
  texture.magFilter = TH.LinearFilter;
  texture.minFilter = TH.LinearFilter;
  texture.encoding = TH.sRGBEncoding;
  texture.flipY = false;
  texture.needsUpdate = true;

  return texture;
};

export const createVideoMaterial = (
  video: HTMLVideoElement
  // flip = false
): T.MeshStandardMaterial => {
  // if (video.paused) {
  //   video.play();
  // }
  const videoTexture = createVideoTexture(video);
  videoTexture.wrapS = TH.RepeatWrapping;

  /* if (flip) {
    videoTexture.repeat.x = -1;
  } */

  const videoMat = new TH.MeshStandardMaterial({
    map: videoTexture,
    side: TH.DoubleSide,
  });

  return videoMat;
};

export const createImageMaterial = (src: string): T.MeshStandardMaterial => {
  const texture = createImageTexture(src);
  /* texture.wrapS = TH.RepeatWrapping;
  texture.repeat.x = -1; */

  const imageMaterial = new TH.MeshStandardMaterial({
    map: texture,
    side: TH.DoubleSide,
  });

  return imageMaterial;
};

export const mod = (x, y) => ((x % y) + y) % y;

export const lookAtObjectAnimation = (
  camera: T.Camera,
  target: string | T.Vector3,
  duration: number,
  scene: T.Scene,
  callback: () => void = () => null
) => {
  let progress = 0;
  let targetPosition: T.Vector3;
  if (typeof target === "string") {
    const targetObject = scene.getObjectByName(target);
    if (!targetObject) return;
    const { x, z } = targetObject.position;
    targetPosition = new TH.Vector3(x, 4.5, z);
  } else {
    targetPosition = target;
  }
  const cameraLookAt = camera.clone();
  cameraLookAt.lookAt(targetPosition);
  gsap.to(
    {},
    {
      duration,
      ease: "Power2.easeInOut",
      onUpdate: () => {
        progress++;
        camera.quaternion
          .copy(camera.quaternion.clone())
          .slerp(
            cameraLookAt.quaternion.clone().normalize(),
            progress / (duration * 60)
          );
      },
      onComplete: () => {
        if (callback) callback();
      },
    }
  );
};

export const getDirection = (from: number, to: number, length: number) => {
  if (from === to) {
    return 0;
  }
  const forward = mod(to - from, length);
  const backward = mod(from - to, length);
  if (forward > backward) {
    return -1;
  } else {
    return 1;
  }
};

export const createFloorHotspot = (
  x: number,
  z: number,
  arrowMesh: T.Mesh,
  rotateY: number | null = null,
  params: object = {}
) => {
  const clonedMesh = arrowMesh.clone();
  if (Object.keys(params).length > 0) {
    Object.keys(params).forEach((key) => {
      clonedMesh[key] = params[key];
    });
  }
  clonedMesh.position.set(x, 0.1, z);
  if (rotateY !== null) {
    clonedMesh.rotateY(rotateY);
  }
  return clonedMesh;
};

export const getPointInBetween = (
  a: T.Vector3,
  b: T.Vector3,
  percentage: number
): T.Vector3 => {
  let direction = b.clone().sub(a);
  const length = direction.length();
  direction = direction.normalize().multiplyScalar(length * percentage);
  return a.clone().add(direction);
};

export const getCenterOfObject = (object: T.Object3D) => {
  const box = new TH.Box3().setFromObject(object);
  return box.getCenter(new TH.Vector3());
};

export const getSizeOfObject = (object: T.Object3D) => {
  const box = new TH.Box3().setFromObject(object);
  return box.getSize(new TH.Vector3());
};

export const createBoxMesh = (
  w: number,
  h: number,
  d: number,
  color: T.ColorRepresentation,
  opacity = 1
) => {
  const geometry = new TH.BoxGeometry(w, h, d);
  const material = new TH.MeshStandardMaterial({
    color: color,
    roughness: 0.5,
    metalness: 0.5,
    transparent: true,
    opacity,
  });
  return new TH.Mesh(geometry, material);
};

export const changeMaterial = (
  scene: TH.Scene,
  objectName: string,
  material: TH.Material
): TH.Material => {
  const object: TH.Mesh = scene.getObjectByName(objectName) as TH.Mesh;
  if (!object) return;
  object.material = material;

  return material;
};

export function loadGLTF(url: string) {
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

export function showModel(model: TH.Group) {
  model.traverse((object) => {
    if (object.type === "Mesh") {
      object.layers.set(0);
      const material = (object as TH.Mesh).material as TH.MeshStandardMaterial;
      // material.format = TH.RGBAFormat;
      material.transparent = true;
      gsap.to(material, { duration: 0.75, opacity: 1 });
    }
  });
}

export function hideModel(model: TH.Group) {
  if (model) {
    model.traverse(async (object) => {
      if (object.type === "Mesh") {
        const material = (object as TH.Mesh)
          .material as TH.MeshStandardMaterial;
        // NOTE: `.format` will be replaced with `.alphaWrite`
        // https://github.com/mrdoob/three.js/issues/22598
        material.format = TH.RGBAFormat;
        material.transparent = true;
        gsap.to(material, {
          duration: 0.75,
          opacity: 0,
          onComplete: () => {
            object.layers.set(1);
            const material = (<TH.Mesh>object).material;
            if (material instanceof TH.Material) {
              material.dispose();
            }
            (<TH.Mesh>object).geometry.dispose();
            object.remove();
          },
        });
      }
    });
  }
}

export function removeObject3D(object3D: TH.Mesh) {
  if (!(object3D instanceof TH.Mesh)) return false;

  // for better memory management and performance
  object3D.geometry.dispose();
  if (object3D.material instanceof Array) {
    // for better memory management and performance
    object3D.material.forEach((material) => material.dispose());
  } else {
    // for better memory management and performance
    object3D.material.dispose();
  }
  object3D.removeFromParent(); // the parent might be the scene or another Object3D, but it is sure to be removed this way
  return true;
}

export const setText = (
  object: TH.Mesh,
  text: string,
  scene: TH.Scene,
  isBold = false
) => {
  const textObject = new Text();
  textObject.name = object.name;
  textObject.text = text;
  textObject.textAlign = "center";
  textObject.anchorX = "center";
  textObject.anchorY = "bottom";
  textObject.maxWidth = 5.5;
  textObject.fontSize = isBold ? 0.5 : 0.4;
  textObject.color = 0xffffff;
  if (isBold) {
    textObject.font = "/fonts/noto-sans/NotoSansCJKsc-Bold.otf";
  } else {
    textObject.font = "/fonts/noto-sans/NotoSansCJKsc-Regular.otf";
  }
  const { x, y, z } = object.position.clone();
  textObject.position.set(x, y, z);
  textObject.curveRadius = 5.5;
  const discoveryRoom = scene.getObjectByName("wall_discovery");
  const centerRoom = getCenterOfObject(discoveryRoom);
  textObject.lookAt(new TH.Vector3(centerRoom.x, y, centerRoom.z));
  const sceneGroup = scene.children.find((child) => child.name === "Scene");
  sceneGroup.remove(object);
  sceneGroup.add(textObject);
  textObject.sync();
};

export const renderNavatar = async (
  scene: TH.Scene,
  room: string,
  mixers: TH.AnimationMixer[]
) => {
  const navatarObject = scene.getObjectByName("navatar");
  const navatar = navatarAnimation.find((navatar) => navatar.room === room);

  if (navatar) {
    const { x, y, z } = navatar.position;

    if (!navatarObject) {
      try {
        const navatarData = await getNavatar();

        const headModel = await loadGLTF(navatarData.data.head3dModel);
        const lookbook = await new TH.TextureLoader().loadAsync(
          navatarData.data.lookBookTexture
        );
        const skinTone = navatarData.data.skinToneHex;

        lookbook.minFilter = TH.LinearFilter;
        lookbook.magFilter = TH.LinearFilter;

        headModel.scene.traverse((obj) => {
          if (obj.type === "SkinnedMesh") {
            const material = (obj as TH.Mesh)
              .material as TH.MeshStandardMaterial;
            material.needsUpdate = true;
            const isIncluded = (part: string) =>
              material.name.toLowerCase().includes(part);

            if (HAIR_COLOR_PARTS.some(isIncluded)) {
              material.map = null;
              material.color = new TH.Color(
                navatarData.data.hairColorHex
              ).convertSRGBToLinear();
            }

            if (SKIN_TONE_PARTS.some(isIncluded)) {
              material.color = new TH.Color(skinTone).convertSRGBToLinear();
              if (material.map) {
                material.map.encoding = TH.sRGBEncoding;
              }
            }

            if (LOOKBOOK_PARTS.some(isIncluded)) {
              lookbook.flipY = false;
              material.map = lookbook;
              material.map.encoding = TH.sRGBEncoding;
            }
          }
        });

        // BODY
        const bodyModel = await loadGLTF(navatarData.data.outfit3dModel);
        bodyModel.scene.traverse((obj) => {
          if (obj.type === "SkinnedMesh") {
            const material = (obj as TH.Mesh)
              .material as TH.MeshStandardMaterial;
            material.needsUpdate = true;
            const isIncluded = (part: string) =>
              material.name.toLowerCase().includes(part);

            if (SKIN_TONE_PARTS.some(isIncluded)) {
              material.color = new TH.Color(skinTone).convertSRGBToLinear();
              if (material.map) {
                material.map.encoding = TH.sRGBEncoding;
              }
            }
          }
        });

        const group = new TH.Group();
        group.name = "navatar";
        // bodyModel.scene.rotateX(Math.PI / 10);
        // headModel.scene.rotateX(Math.PI / 10);
        group.add(headModel.scene);
        group.add(bodyModel.scene);
        group["headAnimations"] = headModel.animations;
        group["bodyAnimations"] = bodyModel.animations;
        group.position.set(x, y, z);
        group.scale.set(3, 3, 3);
        group.lookAt(new TH.Vector3(0, 0, 0));
        scene.add(group);

        const bodymixer = new TH.AnimationMixer(bodyModel.scene);
        const headMixer = new TH.AnimationMixer(headModel.scene);
        bodymixer["name"] = "navatarBodyAnimations";
        headMixer["name"] = "navatarHeadAnimations";

        ["head", "body"].forEach((type) => {
          const mixer = type === "head" ? headMixer : bodymixer;
          mixer["type"] = type;
          mixers.push(mixer);
          loadAnimation(
            type === "head" ? headMixer : bodymixer,
            TH.AnimationClip.findByName(
              type === "body" ? bodyModel.animations : headModel.animations,
              navatar.clip[0]
            ),
            type,
            navatar.positions ? navatar.positions[0] : null
          );

          mixer.addEventListener("finished", (e) => {
            const lastAction = e.action as TH.AnimationAction;
            onFinishAnimation(lastAction, lastAction.getMixer(), navatar);
          });
        });
      } catch (error) {
        console.log("error", error.message);
      }
    } else {
      if (room === "hall" || room === "entry") {
        navatarObject.visible = false;
        console.log("not visible yeah");
        return;
      }
      const myMixer = mixers.filter(
        (mixer) => mixer["type"] === "head" || mixer["type"] === "body"
      );

      myMixer.map((mixer) => {
        if (mixer) {
          mixer.removeEventListener("finished", () => null);
          ["head", "body"].forEach((type) => {
            loadAnimation(
              mixer,
              TH.AnimationClip.findByName(
                navatarObject[`${type}Animations`],
                navatar.clip[0]
              ),
              type,
              navatar.positions ? navatar.positions[0] : null
            );
          });
          mixer.addEventListener("finished", (e) => {
            const lastAction = e.action as TH.AnimationAction;
            onFinishAnimation(lastAction, lastAction.getMixer(), navatar);
          });
        }
      });
      navatarObject.visible = true;
      navatarObject.position.set(x, y, z);
      navatarObject.lookAt(new TH.Vector3(0, 0, 0));
    }
  }
};

const loadAnimation = (
  mixer: TH.AnimationMixer,
  clip: TH.AnimationClip,
  type: string,
  position: {
    x: number;
    y: number;
    z: number;
  } = null
) => {
  const action = mixer.clipAction(clip);
  action.clampWhenFinished = true;
  action["type"] = type;
  if (position && type === "body") {
    mixer.getRoot()["parent"].position.set(position.x, position.y, position.z);
  }
  action.loop = TH.LoopOnce;
  action.fadeIn(0.5).play();
};

const onFinishAnimation = (
  lastAction: TH.AnimationAction,
  mixer: TH.AnimationMixer,
  navatar: INavatarAnimation
) => {
  const clipNames = navatar.clip;
  const lastIndex = clipNames.findIndex(
    (clip) => clip === lastAction.getClip().name
  );
  const nextClipIndex = (lastIndex + 1) % clipNames.length;
  const animations =
    mixer.getRoot()["parent"][`${lastAction["type"]}Animations`];
  lastAction.fadeOut(0.5).getMixer().stopAllAction();

  if (navatar.positions && lastAction["type"] === "body") {
    const { x, y, z } = navatar.positions[nextClipIndex];
    mixer.getRoot()["parent"].position.set(x, y, z);
  }

  loadAnimation(
    lastAction.getMixer(),
    TH.AnimationClip.findByName(animations, clipNames[nextClipIndex]),
    lastAction["type"]
  );
};

export class VideoManagement {
  src = {
    best_seller: "/videos/BestSeller.mp4",
    eyes: "/videos/Eyes.mp4",
    face: "/videos/Face.mp4",
    lips: "/videos/Lips.mp4",
    trex: "/videos/Trex.mp4",
    wallFast: "/videos/W_Black_Fast.mp4",
    redWall: "/videos/W_BLACK.mp4",
    whiteWall: "/videos/W_RED.mp4",
    blink: "/videos/Light.mp4",
    spinning: "/videos/spinning_product.mp4",
  };

  videoList: { [key: string]: null | HTMLVideoElement } = {};
  videowallList: { [key: string]: boolean } = {};
  scene: TH.Scene;
  playedAll = false;

  constructor(scene: TH.Scene) {
    this.scene = scene;
  }

  getVideo(key: string): HTMLVideoElement {
    if (!this.videoList[key]) {
      this.videoList[key] = createVideoElement(this.src[key]);
    }

    return this.videoList[key];
  }

  playVideo(key: string) {
    const video = this.getVideo(key);
    if (video.paused) {
      video.play();
    }
  }

  setVideoWall(wall: string, key: string) {
    const object = this.scene.getObjectByName(wall) as TH.Mesh;
    if (!this.videowallList[wall]) {
      object.material = createVideoMaterial(this.getVideo(key));
    }
  }

  changeVideoWall(wall: string, key: string) {
    const object = this.scene.getObjectByName(wall) as TH.Mesh;
    object.material = createVideoMaterial(this.getVideo(key));
  }

  playAllVideos() {
    Object.values(this.videoList).map((video) => {
      if (video.paused) {
        video.play();
      }
    });
  }

  playVideosOnTouch() {
    if (!this.playedAll) {
      this.playAllVideos();
      this.playedAll = true;
    }
  }
}
