<script lang="ts">
  import { sendAnalytics } from "@/api/analytics";
  import { fetchProductsByLookbookId } from "@/api/navatar";
  // import { uploadWeChatImage } from "@/api/wechat";
  import { chineseCharsPattern } from "@/constants/validationSchema";
  import { AnalyticsType } from "@/interfaces/analytics";
  // import { isMiniProgram } from "@/stores/miniProgram";
  import {
    lookbookProductsStore,
    // productsUsedBySelectedLookbook,
    selectedNavatarModel,
  } from "@/stores/navatar";
  import { footerHeight, navbarHeight, userData } from "@/stores/profile";
  // import { uploadWeChatImage } from "@/api/wechat";
  import { isMyNavatarReady } from "@/utils";
  import {
    // generateStaticImage,
    getBackgroundCanvas,
    renderNavatar,
  } from "@/utils/canvas";
  import { replaceEnVersionWithHelvetica100 } from "@/utils/regexHelper";
  import { onMount } from "svelte";
  // import { toasts } from "svelte-toasts";
  import { _ } from "svelte-i18n";
  import type { Object3D } from "three";
  import {
    ACESFilmicToneMapping,
    CanvasTexture,
    Group,
    PerspectiveCamera,
    Scene,
    SpotLight,
    sRGBEncoding,
    Vector3,
    WebGLRenderer,
  } from "three";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
  import {
    createScene as createSceneForShare,
    share as shareFromNavatarDesignerResult,
  } from "@/utils/navatar/NavatarDesignResult";

  // let isWeChatApiReady = false;
  let requestId = 0;
  let isLoading = false;
  let hasStartedLoadingNavatar = false;
  let imageUrl = "";
  let isImageOpen = false;
  let navatar: Object3D;
  let renderer: WebGLRenderer;
  let canvas: HTMLCanvasElement;
  let isDragging = false;
  let previousMousePosition = {
    x: 0,
    y: 0,
  };
  let lastName = "";
  let firstName = "";
  let chineseFormatName = "";
  let elForShare: HTMLCanvasElement;

  const parentContainer = document.getElementById(
    "parent-container"
  ) as HTMLDivElement;

  const ROTATION_SPEED = 0.05;

  /* const productThumbnailUrls = [
    "/images/product1.png",
    "/images/product2.png",
    "/images/product3.png",
    "/images/product4.png",
    "/images/product5.png",
    "/images/product6.png",
    "/images/product7.png",
  ]; */

  let sourceCanvasHeight = parentContainer.clientHeight;
  // const destinationCanvasWidth =
  //   parentContainer.clientWidth * window.devicePixelRatio;

  const loader = new GLTFLoader();
  const scene = new Scene();
  const spotLight = new SpotLight(0xffffff);
  const canvasBackground = new CanvasTexture(
    getBackgroundCanvas({
      width: parentContainer.clientWidth * window.devicePixelRatio,
      height: parentContainer.clientHeight * window.devicePixelRatio,
      gradients: [
        { offset: 0, color: "#770006" },
        { offset: 1, color: "#C3111A" },
      ],
    })
  );

  spotLight.position.set(1, 2, 7);
  // spotLight.position.set(1, 10, 1);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width =
    parentContainer.clientWidth * window.devicePixelRatio;
  spotLight.shadow.mapSize.height =
    parentContainer.clientHeight * window.devicePixelRatio;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;

  const camera = new PerspectiveCamera(
    45,
    parentContainer.clientWidth / sourceCanvasHeight,
    0.25,
    20
  );

  camera.position.set(0, 0, 6);
  // camera.position.z = 6;
  camera.lookAt(new Vector3(0, 0, 0));

  const resize = () => {
    renderer?.setSize(parentContainer.clientWidth, sourceCanvasHeight);
    if (camera) {
      camera.aspect = parentContainer.clientWidth / sourceCanvasHeight;
      camera.updateProjectionMatrix();
    }
  };

  const animate = () => {
    renderer.render(scene, camera);
    requestId = requestAnimationFrame(animate);
  };

  export const createScene = (el: HTMLCanvasElement) => {
    renderer = new WebGLRenderer({
      antialias: true,
      canvas: el,
      preserveDrawingBuffer: true,
      // powerPreference: "high-performance",
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = sRGBEncoding;
    renderer.shadowMap.enabled = true;

    scene.add(spotLight);
    scene.background = canvasBackground;
    scene.background.encoding = sRGBEncoding;
    // const helper = new CameraHelper(spotLight.shadow.camera);
    // scene.add(helper);

    loader.load(
      "/model/Red-Podium.glb",
      function (gltf) {
        const podium = new Group();
        podium.add(gltf.scene);
        podium.position.y = -1.3;
        podium.receiveShadow = true;
        podium.scale.set(0.7, 0.7, 0.7);
        podium.name = "Podium";
        scene.add(podium);
        animate();
      },
      undefined,
      function (error) {
        // console.log("3D Error", error.message);
        console.error("3D Error", error.message);
      }
    );

    resize();
  };

  onMount(() => {
    createScene(canvas);

    /* window.wx.ready(() => {
      isWeChatApiReady = true;
      isLoading = false;
    });

    window.wx.error(() => {
      isLoading = false;
    }); */

    return () => {
      canvasBackground.dispose();
      cancelAnimationFrame(requestId);
    };
  });

  async function shareToWeChat() {
    try {
      isLoading = true;
      fetchProductsByLookbookId($selectedNavatarModel.lookBookId)
        .then((result) => {
          let products = [];
          $lookbookProductsStore = result;
          const temp: {
            productId: string;
            image: string;
          }[] = [];
          $lookbookProductsStore.data.lookBookProducts.map((product) => {
            const tempData = {
              productId: product.product.id,
              image: product.product.productThumbnail,
            };
            temp.push(tempData);
          });
          products = temp;
          // loadingShare = false;
          createSceneForShare(
            elForShare,
            "navatar-container-profile",
            $selectedNavatarModel.skintone,
            $selectedNavatarModel.hairColor,
            $selectedNavatarModel.lookBookTexture,
            $selectedNavatarModel.headModel,
            $selectedNavatarModel.bodyModel
          ).then(() => {
            const qrCodePath = "/images/qr-code-navatar.png";

            shareFromNavatarDesignerResult(qrCodePath, products)
              .then((imageUrlResult) => {
                isLoading = false;
                isImageOpen = true;
                imageUrl = imageUrlResult;

                const link = document.createElement("a");
                link.download = "share.png";
                link.href = imageUrl;
                link.click();
              })
              .catch((error) => {
                isLoading = false;
                console.log({ error });
                // toasts.error("Share Error", error.message || error.errmsg);
                console.error("Share Error", error.message || error.errmsg);
              });
          });
        })
        .catch((error) => {
          isLoading = false;
          // toasts.error("get product Error", error.message || error.errmsg);
          console.error("get product Error", error.message || error.errmsg);
        });

      // isLoading = true;
      // const podium = scene.getObjectByName("Podium");
      // podium.visible = false;
      // imageUrl = await generateStaticImage({
      //   width: destinationCanvasWidth,
      //   scene,
      //   source: canvas,
      //   initialBackground: canvasBackground,
      //   productThumbnailUrls: $productsUsedBySelectedLookbook,
      //   navatar,
      //   camera,
      //   renderer,
      // });
      // podium.visible = true;

      await sendAnalytics({
        type: AnalyticsType.SHARE_NAVATAR,
        entryType: "start",
      });

      // if ($isMiniProgram) {
      /* const file = dataURItoBlob(pngBase64);
        const { media_id: serverId } = await uploadWeChatImage(file);

        window.wx.downloadImage({
          serverId,
          isShowProgressTips: 1,
          success: (res) => {
            toasts.info("Image Downloaded", res.localId);
          },
          fail: (res) => {
            console.log("Download Error", res.errMsg);
          },
          complete: () => {
            isLoading = false;
          },
        }); */
      // } else {
      // const link = document.createElement("a");
      // link.download = "share.png";
      // link.href = imageUrl;
      // link.click();
      // }

      // isImageOpen = true;
      // isLoading = false;
    } catch (error) {
      isLoading = false;
      // console.log("Share Error", error.message || error.errmsg);
      console.error("Share Error", error.message || error.errmsg);
    }
  }

  function onMouseDown() {
    isDragging = true;
  }

  function onMouseUp() {
    isDragging = false;
  }

  function onMouseMove(e: MouseEvent) {
    if (isDragging && navatar) {
      const deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y,
      };

      previousMousePosition = { x: e.offsetX, y: e.offsetY };
      navatar.rotation.y += Math.sign(deltaMove.x) * ROTATION_SPEED;
    }
  }

  function onTouchMove(
    e: TouchEvent & {
      currentTarget: EventTarget & HTMLCanvasElement;
    }
  ) {
    const bcr = e.currentTarget.getBoundingClientRect();
    const offsetX = e.targetTouches[0].clientX - bcr.x;
    const offsetY = e.targetTouches[0].clientY - bcr.y;

    const deltaMove = {
      x: offsetX - previousMousePosition.x,
      y: offsetY - previousMousePosition.y,
    };

    previousMousePosition = { x: offsetX, y: offsetY };

    if (navatar) {
      navatar.rotation.y += Math.sign(deltaMove.x) * ROTATION_SPEED * 1.25;
    }
  }

  function closeModal() {
    isImageOpen = false;
  }

  $: {
    if ($userData) {
      firstName = $userData.firstName;
      lastName = $userData.lastName;
      chineseFormatName = lastName + firstName;
    }
  }

  $: {
    setTimeout(() => {
      sourceCanvasHeight =
        parentContainer.clientHeight - $navbarHeight - $footerHeight;
      resize();
    });
  }

  $: {
    if (isMyNavatarReady($selectedNavatarModel) && !hasStartedLoadingNavatar) {
      hasStartedLoadingNavatar = true;
      renderNavatar({
        skinTone: $selectedNavatarModel.skintone,
        head: $selectedNavatarModel.headModel,
        hairColor: $selectedNavatarModel.hairColor,
        lookbookTexture: $selectedNavatarModel.lookBookTexture,
        body: $selectedNavatarModel.bodyModel,
      })
        .then((group) => {
          scene.add(group);
          navatar = group;
        })
        .catch((error) => {
          // console.log("Navatar Error", error.message);
          console.error("Navatar Error", error.message);
        });
    }
  }
</script>

<svelte:window on:resize="{resize}" />
<canvas
  class="navatar"
  class:is-dragging="{isDragging}"
  bind:this="{canvas}"
  on:mousedown="{onMouseDown}"
  on:mouseup="{onMouseUp}"
  on:mouseout="{onMouseUp}"
  on:blur="{onMouseUp}"
  on:mousemove="{onMouseMove}"
  on:touchmove="{onTouchMove}"></canvas>
{#if $userData}
  <h1 class="title" style="{`top: calc(${$navbarHeight}px + 2rem)`}">
    {@html replaceEnVersionWithHelvetica100(
      $_("profile.title", {
        values: {
          name: chineseCharsPattern.test(firstName)
            ? chineseFormatName
            : firstName,
        },
      })
    )}
  </h1>
{/if}
<button
  class="button share"
  class:is-loading="{isLoading}"
  on:click="{shareToWeChat}"
  disabled="{!navatar}"
  style="{`bottom: calc(${$footerHeight}px + 1rem)`}"
>
  <!-- || ($isMiniProgram ? !isWeChatApiReady : false) -->
  <img src="/images/invite.svg" alt="" width="24" height="24" />
  <span>
    {$_("profile.inviteYourFriends")}
  </span>
</button>
<div class="modal" class:is-active="{isImageOpen}">
  <div class="modal-background" on:click="{closeModal}"></div>
  <div class="modal-content has-text-centered">
    <img src="{imageUrl}" alt="" />
  </div>
  <button
    class="modal-close is-large"
    aria-label="close"
    on:click="{closeModal}"></button>
</div>
<div class="canvas-container" id="navatar-container-profile">
  <canvas class="navatar-container" bind:this="{elForShare}"></canvas>
</div>

<style lang="scss">
  .navatar {
    cursor: grab;

    &.is-dragging {
      cursor: grabbing;
    }
  }

  .canvas-container {
    position: absolute;
    height: 22rem;
    width: 100%;
    top: 0;
    left: 0;
    z-index: -9999;
    opacity: 0;
  }

  .navatar-container {
    position: relative;
    width: 100% !important;
    height: 100% !important;
  }

  .title {
    text-transform: uppercase;
    position: absolute;
    left: 1rem;
    color: white;
    font-weight: 250;
    font-size: 1.5rem;
    letter-spacing: 1px;
  }

  .share {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background-color: transparent;
    color: white;
    border-radius: 0;
    height: 47px;
    padding: 12px 0;
    width: 88%;

    img {
      width: 1rem;
      margin-right: 1rem;
    }

    span {
      font-size: 0.9rem;
    }
  }
</style>
