<script lang="ts">
  import { onMount } from "svelte";
  import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    SpotLight,
    ACESFilmicToneMapping,
    sRGBEncoding,
    Box3,
    Vector3,
    Raycaster,
    SpriteMaterial,
    Sprite,
    AnimationMixer,
    AnimationClip,
    // CameraHelper,
  } from "three";
  // import { toasts } from "svelte-toasts";

  import { renderNavatarHead } from "@/utils/canvas";
  import { loadTexture } from "@/utils/room";
  import { isMyNavatarReady } from "@/utils";

  import { navatarFace, selectedNavatarModel } from "@/stores/navatar";

  import type { Event } from "three";

  export let width: number;
  export let height: number;
  export let onNavatarClick: () => void;
  export let isHidden = false;
  export let useWhiteBackground = false;

  let renderer: WebGLRenderer;
  let canvas: HTMLCanvasElement;

  const scene = new Scene();
  const spotLight = new SpotLight(0xffffff, 1.5);
  const camera = new PerspectiveCamera(45, width / height, 0.25, 20);
  const raycaster = new Raycaster();

  spotLight.position.z = 6;

  camera.position.set(0, 0, 0.58);
  camera.lookAt(new Vector3(0, 0, 0));

  function resize() {
    renderer?.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function onClick(event: Event) {
    event.preventDefault();
    const rect = renderer.domElement.getBoundingClientRect();
    const pointer = {
      x: ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1,
      y: (-(event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1,
    };
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
      onNavatarClick();
    }
  }

  async function getWhiteBackground() {
    /* const geometry = new CircleGeometry(0.5, 32);
    const material = new MeshBasicMaterial({ color: 0xffffff });
    const circle = new Mesh(geometry, material);
    return circle; */

    const map = await loadTexture("/images/white-pin.png");
    const material = new SpriteMaterial({ map, color: 0xffffff });
    const sprite = new Sprite(material);
    sprite.scale.set(0.4, 0.4, 0.4);
    return sprite;
  }

  function createScene(canv: HTMLCanvasElement) {
    renderer = new WebGLRenderer({
      antialias: true,
      canvas: canv,
      // powerPreference: "high-performance",
      preserveDrawingBuffer: true,
      alpha: true,
    });
    renderer.setClearColor(0xffffff, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = sRGBEncoding;

    scene.add(spotLight);
    // const helper = new CameraHelper(spotLight.shadow.camera);
    // scene.add(helper);
    if (useWhiteBackground) {
      // scene.add(getWhiteBackground());
      getWhiteBackground()
        .then((pin) => {
          // pin.scale.set(0.4, 0.4, 0.4);
          // pin.position.y = -vector.y; // + 0.01;
          scene.add(pin);
        })
        .catch((error) => console.error(error, error.stack));
    }

    resize();
  }

  onMount(() => {
    createScene(canvas);

    return () => {
      URL.revokeObjectURL($navatarFace);
    };
  });

  $: {
    if (isMyNavatarReady($selectedNavatarModel) /* && !$navatarFace */) {
      // console.log(123, $navatarFace);
      renderNavatarHead({
        skinTone: $selectedNavatarModel.skintone,
        head: $selectedNavatarModel.headModel,
        hairColor: $selectedNavatarModel.hairColor,
        lookbookTexture: $selectedNavatarModel.lookBookTexture,
      })
        .then((group) => {
          if (useWhiteBackground) {
            group.scene.scale.set(0.8, 0.8, 0.8);
            // group.position.y = -vector.y; // + 0.01;
          } else {
            group.scene.scale.set(1.1, 1.1, 1.1);
          }

          const box3 = new Box3().setFromObject(group.scene);
          const vector = new Vector3();
          box3.getCenter(vector);
          group.scene.position.set(-vector.x, -vector.y, -vector.z);

          if (useWhiteBackground) {
            group.scene.position.y = -vector.y + 0.03;
          }

          const mixer = new AnimationMixer(group.scene);
          mixer
            .clipAction(AnimationClip.findByName(group.animations, "static"))
            .play();
          mixer.update(0);

          scene.add(group.scene);
          // animate();
          renderer.render(scene, camera);

          if (useWhiteBackground) {
            // $navatarFace = renderer.domElement.toDataURL();
            renderer.domElement.toBlob((blob) => {
              // console.log(234, $navatarFace);
              $navatarFace = URL.createObjectURL(blob);
            });
          }
        })
        .catch((error: Error) => {
          // console.log("Navatar Error", error.message);
          console.error("Navatar Error", error.message);
        });
    }
  }
</script>

<svelte:window on:resize="{resize}" />
<canvas
  id="navatarHead"
  class:is-hidden="{isHidden}"
  bind:this="{canvas}"
  on:click="{onClick}"></canvas>

<style>
  #navatarHead {
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    -ms-user-select: none;
  }
</style>
