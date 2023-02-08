<script lang="ts">
  import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    AmbientLight,
    ACESFilmicToneMapping,
    sRGBEncoding,
    Vector3,
    HemisphereLight,
    Euler,
    Object3D,
    Raycaster,
    MeshStandardMaterial,
    Mesh,
    PMREMGenerator,
    AnimationMixer,
    Clock,
    Group,
    Cache,
    PointLight,
    DoubleSide,
  } from "three";
  import { Text } from "troika-three-text";
  import queryString from "query-string";
  import { navigate } from "svelte-routing";
  import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
  import { onMount, onDestroy } from "svelte";
  // import Stats from "three/examples/jsm/libs/stats.module";
  import { gsap } from "gsap";
  import isNil from "lodash/isNil";
  // import { toasts } from "svelte-toasts";
  import s from "shortid";
  import { _ } from "svelte-i18n";

  import {
    rooms,
    IRoom,
    discoveryPanels,
    discoveryPanelText,
    productCategories,
    floorObjectPosition,
    photoFrame,
    plusDiscoveryHotspots,
    communityPostId,
  } from "@/constants/hotspots";

  import { navbarHeight } from "@/stores/profile";
  import {
    isWelcomeModalShown,
    isExploreButtonShown,
  } from "@/stores/welcomeModal";
  import {
    currentRoom,
    reloadNavatar,
    selectedProductCategory,
  } from "@/stores/room";
  import { retailerName, featuredProducts } from "@/stores/retailer";

  import {
    createVideoMaterial,
    createFloorHotspot,
    createVideoTexture,
    getCenterOfObject,
    getPointInBetween,
    changeMaterial,
    loadGLTF,
    showModel,
    hideModel,
    getSizeOfObject,
    setText,
    renderNavatar,
    VideoManagement,
  } from "@/utils/threedev";
  import {
    getAccessToken,
    getRoomAnalyticsId,
    setRoomAnalyticsId,
    setRoomName,
    getRoomAnalyticsType,
    getGuestId,
  } from "@/utils";
  import { renderFeaturedProducts, setSpotLight } from "@/utils/room";

  import { getNonstopHall, INonStopHall } from "@/api/nonStopHall";
  import { getProductList } from "@/api/product";
  import {
    sendAnalytics,
    sendGuestAnalytics,
    GuestAnalyticsType,
  } from "@/api/analytics";

  import type { IProductByType } from "@/interfaces/product";
  import { AnalyticsType } from "@/interfaces/analytics";

  let container: HTMLDivElement;
  // let videoPlayed = false;
  let previousTouch: Touch;
  const scene = new Scene();
  const ambientLight = new AmbientLight(0x404040);
  const hemisphereLight = new HemisphereLight(0xffffff, 0x000000, 2.5);
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  const mixers: AnimationMixer[] = [];
  const clock = new Clock();
  const modelSrc = "/model/NARS2CN.glb";
  const envSrc = "/model/HDRI.exr";
  const raycaster = new Raycaster();
  // const stats = Stats();
  let room: IRoom = rooms[0];
  let moved = false;
  let renderer: WebGLRenderer;
  const _euler = new Euler(0, 0, 0, "YXZ");
  let arrowMesh: Mesh;
  let plusMesh: Mesh;
  let circleMesh: Mesh;
  const floorHotspot: Object3D[] = [];
  const plusHotspots: Object3D[] = [];
  let nonStopHallHotspot: INonStopHall | null = null;
  // stats.showPanel(1);
  let timestamp: number;
  let removeListeners: () => void;
  // document.body.appendChild(stats.dom);
  const location = queryString.parse(window.location.search);
  const productObjectIds = [];
  let isSpinning = false;
  let selectedCategory = "";
  let hasRenderedFeaturedProducts = false;
  const videoTextures = new VideoManagement(scene);
  let requestId = 0;
  let timeoutId = 0;

  camera.zoom = 0.6;
  camera.position.set(0, 0, 0);
  // camera.lookAt(new Vector3(0, 0, 0));
  Cache.enabled = true;

  const onMouseClick = (event: MouseEvent) => {
    let interval = 350;
    let timestamp2 = Date.now();
    // prevent clicked when dragged
    if (timestamp2 - timestamp > interval) {
      return false;
    }
    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = {
      x: ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1,
      y: (-(event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1,
    };

    raycaster.setFromCamera(mouse, camera);
    const sceneGroup = scene.children.find((child) => child.name === "Scene");
    if (isNil(sceneGroup)) return;
    const intersects = raycaster.intersectObjects(sceneGroup.children);

    if (intersects.length > 0) {
      if (room.wallHotspots.indexOf(intersects[0].object.name) > -1) {
        const { name } = intersects[0].object;
        openHotspot(name);
      }
    }

    const intersectsFloorHotspots = raycaster.intersectObjects(
      floorHotspot,
      false
    );
    if (intersectsFloorHotspots.length > 0) {
      onIntersectFloorHotspot(intersectsFloorHotspots[0].object);
    }

    const intersectsPlusHotspots = raycaster.intersectObjects(
      plusHotspots,
      false
    );
    if (intersectsPlusHotspots.length > 0) {
      const productId = intersectsPlusHotspots[0].object["productId"];
      const categoryUrl =
        $selectedProductCategory !== "best_seller"
          ? `?category=${$selectedProductCategory}`
          : "";

      if (productId) {
        sendAnalytics({
          type: AnalyticsType.DR_PRODUCT,
          entryType: "start",
          productId,
        })
          .catch((error) => console.error(error))
          .finally(() =>
            navigate(`/${$retailerName}/product/${productId}${categoryUrl}`)
          );
      }
    }
  };

  const onMouseDrag = (event: MouseEvent) => {
    onDrag(event.movementX, event.movementY);
  };

  const onTouchDrag = (e: TouchEvent) => {
    const touch = e.touches[0];
    if (previousTouch) {
      const movementX = touch.pageX - previousTouch.pageX;
      const movementY = touch.pageY - previousTouch.pageY;
      onDrag(movementX, movementY);
    }

    previousTouch = touch;
    videoTextures.playVideosOnTouch();
  };

  const onDrag = (movementX: number, movementY: number) => {
    _euler.setFromQuaternion(camera.quaternion);
    _euler.y += movementX * 0.002;
    _euler.x += movementY * 0.002;

    _euler.x = Math.max(-Math.PI * 0.25, Math.min(Math.PI * 0.25, _euler.x));

    if ($currentRoom === "entry") {
      _euler.y = Math.max(-Math.PI * 0.25, Math.min(Math.PI * 0.25, _euler.y));
    }

    camera.quaternion.setFromEuler(_euler);
  };

  const openHotspot = async (hotspot: string) => {
    if (!room.wallHotspots.includes(hotspot)) return;

    switch (room.id) {
      case "hall":
        openNonStopHallHostpot(hotspot);
        break;

      case "play":
        navigate(`/${$retailerName}/game`);
        break;

      case "discovery":
        openDiscoveryHotspot(hotspot);
        break;

      case "community":
        openCommunityHotspot(hotspot);
        break;

      default:
        break;
    }
  };

  const openCommunityHotspot = async (hotspot: string) => {
    const hotspotIndex = room.wallHotspots.indexOf(hotspot);
    if (hotspotIndex === -1) return;

    if ((hotspotIndex + 1) % 2 === 1) {
      try {
        await sendAnalytics({
          type: AnalyticsType.CR_CENTRAL_ODD,
          entryType: "start",
        });
      } catch (error) {
        console.error(error);
      }
      // navigate(`/${$retailerName}/posts?type=by-the-community`);
    } else {
      try {
        await sendAnalytics({
          type: AnalyticsType.CR_CENTRAL_EVEN,
          entryType: "start",
        });
      } catch (error) {
        console.error(error);
      }
      // navigate(`/${$retailerName}/posts?type=by-nars`);
    }
    const { id, type } = communityPostId[hotspotIndex];
    navigate(`/${$retailerName}/posts?postId=${id}&type=${type}`);
  };

  const openNonStopHallHostpot = async (hotspot: string) => {
    if (!nonStopHallHotspot) return;
    const hotspotIndex = room.wallHotspots.indexOf(hotspot);
    if (hotspotIndex === -1) return;
    const hotspotKey = ["hotspot1", "hotspot2", "hotspot3", "hotspot4"][
      hotspotIndex
    ];
    const bannerAnalytics = [
      AnalyticsType.NH_BANNER1,
      AnalyticsType.NH_BANNER2,
      AnalyticsType.NH_BANNER3,
      AnalyticsType.NH_BANNER4,
    ];
    const guestBannerAnalytics = [
      GuestAnalyticsType.NH_BANNER1,
      GuestAnalyticsType.NH_BANNER2,
      GuestAnalyticsType.NH_BANNER3,
      GuestAnalyticsType.NH_BANNER4,
    ];

    try {
      if (getAccessToken()) {
        await sendAnalytics({
          type: bannerAnalytics[hotspotIndex],
          entryType: "start",
        });
      } else {
        await sendGuestAnalytics({
          type: guestBannerAnalytics[hotspotIndex],
          entryType: "start",
          guestId: getGuestId(),
        });
      }
    } catch (error) {
      console.error(error);
    }

    if (nonStopHallHotspot[hotspotKey].type === "post") {
      if (getAccessToken()) {
        navigate(
          `/${$retailerName}/posts?postId=${nonStopHallHotspot[hotspotKey].postId}&type=${nonStopHallHotspot[hotspotKey].post.type}`
        );
      } else {
        navigate(
          `/${$retailerName}/posts/${nonStopHallHotspot[hotspotKey].postId}`
        );
      }
    } else {
      sendAnalytics({
        type: AnalyticsType.DR_PRODUCT,
        entryType: "start",
        productId: nonStopHallHotspot[hotspotKey].productId,
      })
        .catch((error) => console.error(error))
        .finally(() =>
          navigate(
            `/${$retailerName}/product/${nonStopHallHotspot[hotspotKey].productId}`
          )
        );
    }
  };

  const openDiscoveryHotspot = async (hotspot: string) => {
    // console.log("cuk", $selectedProductCategory);
    if (discoveryPanelText.indexOf(hotspot) > -1) {
      if (
        ($selectedProductCategory !== "best_seller" &&
          $selectedProductCategory !== "") ||
        hotspot === "Disc_Best"
      )
        return;
      $selectedProductCategory =
        productCategories[discoveryPanelText.indexOf(hotspot)];
      return;
    }

    if (
      discoveryPanels.indexOf(hotspot) > -1 &&
      $selectedProductCategory === "best_seller"
    ) {
      $selectedProductCategory =
        productCategories[discoveryPanels.indexOf(hotspot)];
      return;
    }

    if (
      photoFrame.indexOf(hotspot) > -1 &&
      $selectedProductCategory === "best_seller"
    ) {
      $selectedProductCategory = productCategories[photoFrame.indexOf(hotspot)];
      return;
    }

    const discoveryHotspot = scene.getObjectByName(hotspot);
    if (discoveryHotspot && discoveryHotspot["productId"]) {
      const categoryUrl =
        $selectedProductCategory !== "best_seller"
          ? `?category=${$selectedProductCategory}`
          : "";
      try {
        await sendAnalytics({
          type: AnalyticsType.DR_PRODUCT,
          entryType: "start",
          productId: discoveryHotspot["productId"],
        });
      } catch (error) {
        console.error(error);
      } finally {
        navigate(
          `/${$retailerName}/product/${discoveryHotspot["productId"]}${categoryUrl}`
        );
      }
    }
  };

  function openWelcomeModal() {
    $isExploreButtonShown = false;
    $isWelcomeModalShown = true;
  }

  const checkCredential = (id: string) => {
    if (["play", "community", "discovery"].includes(id) && !getAccessToken()) {
      openWelcomeModal();
      return false;
    }

    return true;
  };

  const goToRoom = (id = "hall") => {
    room = rooms.find((r) => r.id === id);
    if (room) {
      const startPoint = room.floorHotspots.find((h) => h.type === "start");
      const startPointIndex = room.floorHotspots.findIndex(
        (h) => h.type === "start"
      );
      if (startPoint) {
        renderFloorHotspot(startPointIndex);
        camera.position.set(startPoint.x, 3.5, startPoint.z);
        camera.lookAt(room.center);
      }
    }
    onDemandRendering(id, true);
  };

  const handleChangeRoomState = async (nextRoom: IRoom) => {
    if (room.id === "discovery") {
      selectedCategory = "best_seller";
      $selectedProductCategory = "best_seller";
      removeDiscoveryProducts();
    }
    room = nextRoom;
    $currentRoom = nextRoom.id;
    setRoomName(nextRoom.id);
    window.history.pushState({}, "NARS Nonstop World", `?room=${nextRoom.id}`);
    onDemandRendering(nextRoom.id);

    if (nextRoom.id === "hall" && !getAccessToken()) {
      setTimeout(() => {
        $isExploreButtonShown = true;
      }, 600);
    }

    let prevAnalyticsType = getRoomAnalyticsType(room.id);
    let nextAnalyticsType = getRoomAnalyticsType(nextRoom.id);
    const roomAnalyticsId = getRoomAnalyticsId();

    try {
      if (roomAnalyticsId) {
        if (getAccessToken()) {
          await sendAnalytics({
            type: prevAnalyticsType,
            entryType: "end",
            id: roomAnalyticsId,
          });
        } else if (room.id === "hall") {
          await sendGuestAnalytics({
            type: GuestAnalyticsType.NONSTOP_HALL,
            entryType: "end",
            id: roomAnalyticsId,
            guestId: getGuestId(),
          });
        }
      }

      if (getAccessToken()) {
        const {
          data: { id: analyticsId },
        } = await sendAnalytics({
          type: nextAnalyticsType,
          entryType: "start",
        });

        setRoomAnalyticsId(analyticsId);
      } else if (nextRoom.id === "hall") {
        const {
          data: { id: analyticsId },
        } = await sendGuestAnalytics({
          type: GuestAnalyticsType.NONSTOP_HALL,
          entryType: "start",
          guestId: getGuestId(),
        });

        setRoomAnalyticsId(analyticsId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onIntersectFloorHotspot = (hotspot: Object3D) => {
    let { x, z } = hotspot.position;
    let targetIndex = hotspot["hotspotIndex"];

    if (hotspot["hotspotType"] === "enter") {
      if (!checkCredential(hotspot.name)) return;
      const nextRoom = rooms.find((r) => r.id === hotspot.name);
      x = nextRoom.floorHotspots[0].x;
      z = nextRoom.floorHotspots[0].z;
      targetIndex = 0;
      handleChangeRoomState(nextRoom);
      videoTextures.playAllVideos();
    }

    if (hotspot["hotspotType"] === "out") {
      const nextRoom = rooms.find((r) => r.id === hotspot.name);
      const targetBack = nextRoom.floorHotspots.find(
        (h) => h.id === hotspot["back"]
      );
      if (targetBack) {
        x = targetBack.x;
        z = targetBack.z;
        handleChangeRoomState(nextRoom);
      }
    }

    gsap.to(camera.position, {
      duration: 1,
      x,
      z,
      ease: "Sine.easeInOut",
      onComplete: async () => {
        renderFloorHotspot(targetIndex);
      },
    });
  };

  const resize = () => {
    if (renderer && container) {
      const width = container.clientWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  };

  const renderFloorHotspot = (index: number) => {
    if (floorHotspot.length > 0) {
      floorHotspot.forEach((hotspot) => {
        scene.remove(hotspot);
      });
    }
    room.floorHotspots[index].shows.forEach(({ id, rotation }) => {
      const { x, z, type, back, caption } = room.floorHotspots.find(
        (h) => h.id === id
      );
      const hotspotIndex = room.floorHotspots.findIndex((h) => h.id === id);
      const rotateY = rotation * Math.PI;
      const hotspotMesh =
        type !== "enter" && type !== "out" ? circleMesh : arrowMesh;
      const hotspot = createFloorHotspot(x, z, hotspotMesh, rotateY, {
        name: id,
        hotspotType: type,
        hotspotIndex,
        back,
      });

      if (caption) {
        const { text, position: p, rotation: r } = caption;
        const txtObj = new Text();
        txtObj.name = id;
        txtObj.text = text;
        txtObj.anchorX = "center";
        txtObj.fontSize = 0.4;
        txtObj.position.set(p.x, p.y, p.z);
        txtObj.rotation.set(r.x, r.y, r.z);
        txtObj.font = "/fonts/noto-sans/NotoSansCJKsc-Regular.otf";
        scene.add(txtObj);
        floorHotspot.push(txtObj);
      }

      scene.add(hotspot);
      floorHotspot.push(hotspot);
    });
  };

  const removeDiscoveryProducts = () => {
    if (productObjectIds.length > 0) {
      productObjectIds.map((id) => {
        const productObject = scene.getObjectByName(id);
        hideModel(productObject as Group);
        setTimeout(() => {
          scene.remove(productObject);
        }, 1000);
      });
      plusHotspots.forEach((hotspot) => {
        scene.remove(hotspot);
      });
    }
  };

  const renderDiscoveryProducts = async (
    category: string,
    freeLookAt = false
  ) => {
    if (isSpinning || category === selectedCategory) return;
    const isBestSeller = category === "best_seller";
    removeDiscoveryProducts();

    plusDiscoveryHotspots.forEach((item) => {
      const hotspot = scene.getObjectByName(item);
      if (hotspot) {
        hotspot["productId"] = null;
      }
    });

    if (isBestSeller && $currentRoom === "discovery" && !freeLookAt) {
      const { x, z } = room.floorHotspots[0];
      const lookAtObject = scene.getObjectByName("Discover_Lookat") as Mesh;
      camera.position.set(x, 4.5, z);
      camera.lookAt(lookAtObject.position.clone());
    }

    spinEffect(true);
    changeMiddleDisplay(category);
    let isStopped = false;

    const timeout = setTimeout(() => {
      onStopSpinning(isBestSeller, category);
      isStopped = true;
    }, 5000);

    const listProduct = await getProductList(category);
    await productPlacement(listProduct.data, isBestSeller);
    if (!isStopped) {
      clearTimeout(timeout);
      onStopSpinning(isBestSeller, category);
    }
  };

  const changeMiddleDisplay = (category: string) => {
    if (category === "best_seller") {
      videoTextures.changeVideoWall("Discover_Lookat", "best_seller");
      return;
    }
    const middle = scene.getObjectByName("Discover_Lookat") as Mesh;
    const video = videoTextures.getVideo(category);
    const videoTexture = createVideoTexture(video);
    videoTexture.offset.setY(0.05);
    const videoMaterial = new MeshStandardMaterial({
      map: videoTexture,
      side: DoubleSide,
    });
    middle.material = videoMaterial;
  };

  const onStopSpinning = (isBestSeller: boolean, category: string) => {
    selectedCategory = isBestSeller ? "best_seller" : category;
    if (isBestSeller) {
      showProductCategoryText();
    } else {
      const middleText = <Mesh>scene.getObjectByName("Disc_Best");
      setText(middleText, $_(`productCategory.${category}`), scene, true);
    }
    spinEffect(false);
  };

  const spinEffect = (isSpin: boolean) => {
    isSpinning = isSpin;
    if (isSpin) {
      videoTextures.playVideo("wallFast");
    } else {
      videoTextures.playVideo("redWall");
    }

    videoTextures.changeVideoWall(
      "vidwall_discovery",
      isSpin ? "wallFast" : "redWall"
    );

    const whiteMaterial = new MeshStandardMaterial({
      color: 0xffffff,
    });
    discoveryPanels.map((item) => {
      changeMaterial(
        scene,
        item,
        isSpin
          ? createVideoMaterial(videoTextures.getVideo("spinning"))
          : whiteMaterial
      );
    });
    if (isSpin) {
      discoveryPanelText.forEach((text) => {
        const panelText = <Mesh>scene.getObjectByName(text);
        if (panelText) setText(panelText, "", scene);
      });
    }
  };

  const productPlacement = async (
    productList: IProductByType[],
    isBestSeller: boolean
  ) => {
    const discoveryRoom = scene.getObjectByName("wall_discovery");
    const centerRoom = getCenterOfObject(discoveryRoom);
    for (const productData of productList) {
      const model = await loadGLTF(productData.featured3dModel);
      const positionType = isBestSeller ? "best_seller" : "regular";
      productData.productPositions
        .filter((item) => item.type === positionType)
        .forEach((item) => {
          const productObjectId = s.generate();
          productObjectIds.push(productObjectId);
          if (item.position < 5) {
            const panel = scene.getObjectByName(
              discoveryPanels[item.position - 1]
            );
            const { x, z } = getPointInBetween(panel.position, centerRoom, 0.1);
            const productObject = model.scene.clone();
            productObject.position.set(x, 3.5, z);
            productObject.lookAt(new Vector3(centerRoom.x, 3.5, centerRoom.z));
            productObject.name = productObjectId;
            if (!isBestSeller) {
              setText(
                <Mesh>(
                  scene.getObjectByName(discoveryPanelText[item.position - 1])
                ),
                productData.name,
                scene
              );
            }

            if (room.wallHotspots.length) {
              const hotspot = scene.getObjectByName(
                room.wallHotspots[item.position - 1]
              );

              hotspot["productId"] = item.productId;
            }

            const mixer = new AnimationMixer(productObject);
            model.animations.forEach((clip) => {
              mixer.clipAction(clip).play();
            });
            mixers.push(mixer);
            scene.add(productObject);
            showModel(scene.getObjectByName(productObjectId) as Group);
          } else {
            const productObject =
              model.scene.children[0].children[0].clone() as Mesh;

            const { x, y, z } = floorObjectPosition[item.position - 5];
            const size = getSizeOfObject(productObject);
            productObject.position.set(x, y + size.y / 2, z);
            const plusHotspot = plusMesh.clone();
            productObject.name = productObjectId;
            plusHotspot.position.set(x - size.x / 2, y + size.y / 2, z);
            plusHotspot["productId"] = item.productId;
            scene.add(plusHotspot);
            plusHotspots.push(plusHotspot);
            scene.add(productObject);
          }
        });
    }
  };

  const showProductCategoryText = () => {
    discoveryPanelText.forEach((text, key) => {
      const panel = scene.getObjectByName(text);
      if (panel) {
        setText(
          <Mesh>panel,
          $_(`productCategory.${productCategories[key]}`),
          scene,
          true
        );
      }
    });
  };

  const animate = () => {
    timeoutId = window.setTimeout(() => {
      requestId = requestAnimationFrame(animate);
    }, 1000 / 30);
    // stats.update();
    const delta = clock.getDelta();
    mixers.forEach((mixer) => mixer.update(delta));
    renderer.render(scene, camera);
  };

  const setEmmisiveLight = () => {
    const blinkObject: Mesh = scene.getObjectByName("Mesh025_9") as Mesh;
    const blinkMaterial = blinkObject.material as MeshStandardMaterial;
    const blinkVideoTexture = createVideoTexture(
      videoTextures.getVideo("blink")
    );
    blinkMaterial.emissiveIntensity = 5;
    blinkMaterial.emissiveMap = blinkVideoTexture;
  };

  const onDemandRendering = async (room: string, isReload = false) => {
    switch (room) {
      case "community":
        // videoTextures.setVideoWall("vidwall_com", "whiteWall");
        renderNavatar(scene, room, mixers);
        break;

      case "discovery":
        if (isReload) {
          if (location.category !== undefined) {
            $selectedProductCategory = location.category as string;
          } else {
            $selectedProductCategory = "best_seller";
          }
        } else {
          selectedCategory = "";
          await renderDiscoveryProducts("best_seller", true);
        }
        renderNavatar(scene, room, mixers);
        break;

      case "play":
        renderNavatar(scene, room, mixers);
        break;

      default:
        videoTextures.setVideoWall("vidwall_center", "redWall");
        videoTextures.setVideoWall("vidwall_center001", "redWall");
        break;
    }
  };

  function onMouseDown() {
    timestamp = Date.now();
    moved = true;
    renderer.domElement.style.cursor = "grabbing";
    // playVideoTexture();
  }

  function onMouseUp() {
    moved = false;
    renderer.domElement.style.cursor = "grab";
  }

  function onMouseMove(e: MouseEvent) {
    if (moved) onMouseDrag(e);
    videoTextures.playVideosOnTouch();
  }

  function onMouseLeave() {
    if (moved) {
      moved = false;
      renderer.domElement.style.cursor = "grab";
    }
  }

  function onTouchEnd() {
    previousTouch = null;
  }

  export const createScene = async (el: HTMLCanvasElement) => {
    try {
      // Setup renderer
      renderer = new WebGLRenderer({
        antialias: true,
        canvas: el,
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.toneMapping = ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      renderer.outputEncoding = sRGBEncoding;
      renderer.physicallyCorrectLights = true;

      /* Init start position */
      const { x, z } = rooms[0].floorHotspots.find(
        (item) => item.type === "start"
      );
      camera.position.set(x, 4.5, z);
      camera.lookAt(new Vector3(0, 3.5, 0));
      room = rooms[0];

      // Setup Environment
      const pmremGenerator = new PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();

      new EXRLoader().load(envSrc, function (texture) {
        let envMap = pmremGenerator.fromEquirectangular(texture);
        scene.environment = envMap.texture;
        texture.dispose();
        pmremGenerator.dispose();
      });

      // Listeners
      el.addEventListener("click", onMouseClick, false);
      el.addEventListener("mousedown", onMouseDown, false);
      el.addEventListener("mouseup", onMouseUp, false);
      el.addEventListener("mousemove", onMouseMove, false);
      el.addEventListener("mouseleave", onMouseLeave, false);
      el.addEventListener("touchmove", onTouchDrag, false);
      el.addEventListener("touchend", onTouchEnd, false);

      // Load GLTF
      const gltf = await loadGLTF(modelSrc);
      gltf.scene.matrixAutoUpdate = false;
      scene.add(ambientLight);
      scene.add(hemisphereLight);
      scene.add(gltf.scene);
      setSpotLight({ scene });
      arrowMesh = (<Mesh>scene.getObjectByName("nonstopevents_circle")).clone(); // Clone Arrow Mesh
      plusMesh = (<Mesh>scene.getObjectByName("CenterMini_1")).clone(); // Clone Plus Mesh
      circleMesh = (<Mesh>scene.getObjectByName("FloorCircleSpot")).clone(); // Clone Circle Mesh
      plusMesh.position.set(1, 0, 0);
      plusMesh.lookAt(new Vector3(0, 0, 0));
      plusMesh.rotateX(Math.PI / 2);
      setEmmisiveLight();
      onDemandRendering(room.id, true);

      // Load Animations
      const mixer = new AnimationMixer(gltf.scene);
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
      mixers.push(mixer);

      renderFloorHotspot(0);

      if (location.room !== undefined) {
        if (!checkCredential(location.room as string)) return;
        $currentRoom = location.room as string;
      }

      renderer.render(scene, camera);
      resize();
      animate();

      rooms.forEach((room) => {
        if (room.id !== "entry" && room.id !== "hall") {
          const light = new PointLight(0xffffff, 0.5, 100);
          const { x, z } = room.center;
          light.position.set(x, 4, z);
          scene.add(light);
        }
      });
    } catch (error) {
      // console.log("Render model failed!", error.message);
      console.error("Render model failed!", error.message);
    }
  };

  const fetchNonStopHall = async () => {
    const result = await getNonstopHall();
    if (result.success) {
      nonStopHallHotspot = result.data;
    }
  };

  let el: HTMLCanvasElement;

  currentRoom.subscribe((currentValue) => {
    if (currentValue === room.id) return;
    goToRoom(currentValue);
  });

  selectedProductCategory.subscribe(async (currentValue) => {
    if (currentValue === "") return;

    let analyticsType = AnalyticsType.SUBROOM_BEST_SELLER;

    switch (currentValue) {
      case "face":
        analyticsType = AnalyticsType.SUBROOM_FACE;
        break;
      case "eyes":
        analyticsType = AnalyticsType.SUBROOM_EYES;
        break;
      case "lips":
        analyticsType = AnalyticsType.SUBROOM_LIPS;
        break;
      case "trex":
        analyticsType = AnalyticsType.SUBROOM_TREX;
        break;
    }

    await renderDiscoveryProducts(currentValue);
    const categoryUrl =
      currentValue !== "best_seller" ? `&category=${currentValue}` : "";
    window.history.pushState(
      {},
      "NARS Nonstop World",
      `?room=${$currentRoom}${categoryUrl}`
    );

    try {
      await sendAnalytics({
        type: analyticsType,
        entryType: "start",
      });
    } catch (error) {
      console.error(error);
    }
  });

  reloadNavatar.subscribe(async (currentValue) => {
    if (currentValue) {
      await renderNavatar(scene, $currentRoom, mixers);
    }
  });

  onMount(async () => {
    createScene(el);
    await fetchNonStopHall();
  });

  onDestroy(() => {
    el.removeEventListener("click", onMouseClick, false);
    el.removeEventListener("mousedown", onMouseDown, false);
    el.removeEventListener("mouseup", onMouseUp, false);
    el.removeEventListener("mousemove", onMouseMove, false);
    el.removeEventListener("mouseleave", onMouseLeave, false);
    el.removeEventListener("touchmove", onTouchDrag, false);
    el.removeEventListener("touchend", onTouchEnd, false);
    removeListeners?.();
    cancelAnimationFrame(requestId);
    clearTimeout(timeoutId);
  });

  $: {
    if ($navbarHeight) {
      resize();
    }

    if (renderer && $featuredProducts.length && !hasRenderedFeaturedProducts) {
      hasRenderedFeaturedProducts = true;

      renderFeaturedProducts(
        $featuredProducts,
        { scene, camera, renderer, raycaster }
        // animate
      )
        .then((removeListeners_) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          removeListeners = removeListeners_;
        })
        .catch((error) =>
          // console.log("Fetch Featured Products Error", error.message)
          console.error("Fetch Featured Products Error", error.message)
        );
    }
  }
</script>

<svelte:window on:resize="{resize}" />
<div class="canvas-container" bind:this="{container}">
  <canvas bind:this="{el}"></canvas>
</div>

<style>
  canvas {
    cursor: "grab";
    overflow: hidden;
  }
  .canvas-container {
    height: 100%;
  }
</style>
