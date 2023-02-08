import {
  TextureLoader,
  sRGBEncoding,
  Scene,
  Group,
  Color,
  MeshStandardMaterial,
  AnimationMixer,
  AnimationClip,
} from "three";
import { get } from "svelte/store";
import { _ } from "svelte-i18n";

import { load3dModel, loadTexture } from "@/utils/room";

import type {
  Texture,
  CanvasTexture,
  Object3D,
  WebGLRenderer,
  PerspectiveCamera,
  Mesh,
} from "three";

import type { WishlistData } from "@/api/profile";

interface IBackgroundCanvas {
  width?: number;
  height?: number;
  gradients: {
    offset: number;
    color: string;
  }[];
}

export function getBackgroundCanvas(config: IBackgroundCanvas) {
  const {
    height = window.innerHeight,
    width = window.innerWidth,
    gradients,
  } = config;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const grd = ctx.createLinearGradient(0, 0, 0, height);

  gradients
    .sort((a, b) => {
      if (a.offset > b.offset) return 1;
      if (a.offset < b.offset) return -1;
      return 0;
    })
    .forEach(({ offset, color }) => {
      grd.addColorStop(offset, color);
    });

  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, width, height);

  return canvas;
}

function resolveImageLoad(
  width: number,
  height: number,
  url: string,
  useCORS = false
) {
  return (
    resolve: (value: HTMLImageElement | PromiseLike<HTMLImageElement>) => void,
    reject: (reason?: unknown) => void
  ) => {
    const image = new Image();

    if (useCORS) {
      image.crossOrigin = "anonymous";
      image.src = url + "?not-from-cache-please";
    } else {
      image.src = url;
    }

    image.width = width;
    image.height = height;
    image.onload = () => {
      resolve(image);
    };
    image.onerror = (error) => {
      reject(error);
    };
  };
}

const textureLoader = new TextureLoader();
const backgroundTexturePromise = new Promise<Texture>((resolve, reject) => {
  textureLoader.load(
    "/images/red-background.png",
    (texture: Texture) => resolve(texture),
    undefined,
    (error) => reject(error)
  );
});

const qrCodePromise = new Promise<HTMLImageElement>(
  resolveImageLoad(256, 256, "/images/dummy-qr-code.png")
);

interface IStaticImage {
  width: number;
  source: HTMLCanvasElement;
  scene: Scene;
  initialBackground: CanvasTexture;
  productThumbnailUrls: string[];
  navatar: Object3D;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
}

export async function generateStaticImage(config: IStaticImage) {
  const {
    width,
    source,
    scene,
    initialBackground,
    productThumbnailUrls,
    navatar,
    camera,
    renderer,
  } = config;

  const GAP_SIZE = 16 * window.devicePixelRatio;
  const CANVAS_WIDTH = width;
  const PRODUCT_ROWS = Math.ceil(productThumbnailUrls.length / 3);
  const productThumbnail = {
    width: (CANVAS_WIDTH - GAP_SIZE * 4) / 3,
    height: (CANVAS_WIDTH - GAP_SIZE * 4) / 3,
  };
  const whiteSection = {
    top: CANVAS_WIDTH,
    left: 0,
    width: CANVAS_WIDTH,
    height:
      productThumbnail.height * (1 + PRODUCT_ROWS) +
      GAP_SIZE * (2 + PRODUCT_ROWS),
  };
  const CANVAS_HEIGHT = CANVAS_WIDTH + whiteSection.height;

  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  const previousRotationY = navatar.rotation.y;
  const previousScale = {
    x: navatar.scale.x,
    y: navatar.scale.y,
    z: navatar.scale.z,
  };

  const productThumbnailsPromises = productThumbnailUrls.map((url) => {
    return new Promise<HTMLImageElement>(resolveImageLoad(600, 600, url, true));
  });

  const [backgroundTexture, qrCode] = await Promise.all([
    backgroundTexturePromise,
    qrCodePromise,
  ]);
  const productThumbnails = await Promise.all(productThumbnailsPromises);

  // Change Navatar's background color
  scene.background = backgroundTexture;
  scene.background.encoding = sRGBEncoding;

  const targetAspect = CANVAS_WIDTH / (CANVAS_HEIGHT - whiteSection.height);
  const imageAspect = 1;
  const factor = imageAspect / targetAspect;
  // When factor larger than 1, that means texture 'wilder' than target。
  // we should scale texture height to target height and then 'map' the center  of texture to target， and vice versa.
  scene.background.offset.x = factor > 1 ? (1 - 1 / factor) / 2 : 0;
  scene.background.repeat.x = factor > 1 ? 1 / factor : 1;
  scene.background.offset.y = factor > 1 ? 0 : (1 - factor) / 2;
  scene.background.repeat.y = factor > 1 ? 1 : factor;

  // Shift Navatar up a bit
  navatar.position.y = 0.5;
  navatar.scale.set(1, 1, 1);
  navatar.rotation.y = 0;

  renderer.render(scene, camera);

  const ctx = canvas.getContext("2d");
  ctx.drawImage(source, 0, 0);

  ctx.beginPath();
  ctx.rect(
    whiteSection.left,
    whiteSection.top,
    whiteSection.width,
    whiteSection.height
  );
  ctx.fillStyle = "white";
  ctx.fill();

  productThumbnails.forEach((image, index) => {
    const rowIndex = Math.floor(index / 3);
    const colIndex = index - rowIndex * 3;

    ctx.drawImage(
      image,
      whiteSection.left +
        GAP_SIZE +
        productThumbnail.width * colIndex +
        GAP_SIZE * colIndex,
      whiteSection.top +
        GAP_SIZE +
        productThumbnail.height * rowIndex +
        GAP_SIZE * rowIndex,
      productThumbnail.width,
      productThumbnail.height
    );
  });

  ctx.drawImage(
    qrCode,
    whiteSection.left + GAP_SIZE,
    whiteSection.top +
      GAP_SIZE * (1 + PRODUCT_ROWS) +
      productThumbnail.height * PRODUCT_ROWS,
    productThumbnail.width,
    productThumbnail.height
  );

  ctx.fillStyle = "black";
  // ctx.font = "32px Helvetica Neue";
  ctx.font = `${0.075 * CANVAS_WIDTH}px Noto Sans CJK SC Light`;

  ctx.fillText(
    get(_)("share.title"),
    whiteSection.left + GAP_SIZE * 2 + productThumbnail.width,
    whiteSection.top +
      GAP_SIZE * (3 + PRODUCT_ROWS) +
      productThumbnail.height * PRODUCT_ROWS,
    CANVAS_WIDTH - GAP_SIZE * 3
  );

  ctx.font = `${0.045 * CANVAS_WIDTH}px Noto Sans CJK SC Light`;
  ctx.fillText(
    get(_)("share.description.0"),
    whiteSection.left + GAP_SIZE * 2 + productThumbnail.width,
    whiteSection.top +
      GAP_SIZE * (5 + PRODUCT_ROWS) +
      productThumbnail.height * PRODUCT_ROWS,
    CANVAS_WIDTH - GAP_SIZE * 3
  );
  ctx.fillText(
    get(_)("share.description.1"),
    whiteSection.left + GAP_SIZE * 2 + productThumbnail.width,
    whiteSection.top +
      GAP_SIZE * (6.5 + PRODUCT_ROWS) +
      productThumbnail.height * PRODUCT_ROWS,
    CANVAS_WIDTH - GAP_SIZE * 3
  );

  // Reset Navatar's background color
  scene.background = initialBackground;

  // Reset Navatar's position
  navatar.position.y = 0;
  navatar.scale.set(previousScale.x, previousScale.y, previousScale.z);
  navatar.rotation.y = previousRotationY;

  renderer.render(scene, camera);

  // Destroy resources
  backgroundTexture.dispose();

  return canvas.toDataURL();
}

interface GenerateMaterialChangeParams {
  hairColor: string;
  skinTone: string;
  lookbook: Texture;
}

function generateMaterialChange({
  hairColor,
  skinTone,
  lookbook,
}: GenerateMaterialChangeParams) {
  return (obj: Object3D<Event>) => {
    if (obj.type === "SkinnedMesh") {
      const material = (obj as unknown as Mesh)
        .material as MeshStandardMaterial;
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
        // const newMaterial = new MeshStandardMaterial({ map: lookbook })
        lookbook.flipY = false;
        material.map = lookbook;
        material.map.encoding = sRGBEncoding;
      }
    }
  };
}

interface RenderNavatarParams {
  head: string;
  body: string;
  skinTone: string;
  hairColor: string;
  lookbookTexture: string;
}

const SKIN_TONE_PARTS = ["face", "skin"];
const HAIR_COLOR_PARTS = ["hair"];
const LOOKBOOK_PARTS = ["face"];

export async function renderNavatar({
  skinTone,
  hairColor,
  lookbookTexture,
  head,
  body,
}: RenderNavatarParams) {
  const group = new Group();
  const model3ds = await Promise.all(
    [head, body].map((model3dUrl) => load3dModel(model3dUrl))
  );
  const lookbook = await loadTexture(lookbookTexture);

  model3ds.forEach((model) => {
    model.scene.castShadow = true;
    model.scene.receiveShadow = false;
    // model.scale.set(2, 2, 2);
    // model.position.y = -2;
    model.scene.scale.set(2.5, 2.5, 2.5);
    model.scene.position.y = -1;
    model.scene.traverse(
      generateMaterialChange({ hairColor, skinTone, lookbook })
    );
    group.add(model.scene);

    const mixer = new AnimationMixer(model.scene);
    mixer
      .clipAction(AnimationClip.findByName(model.animations, "static"))
      .play();
    mixer.update(0);
  });

  return group;
}

type RenderNavatarHeadParams = Omit<RenderNavatarParams, "body">;

export async function renderNavatarHead({
  skinTone,
  hairColor,
  lookbookTexture,
  head,
}: RenderNavatarHeadParams) {
  const model = await load3dModel(head);
  const lookbook = await loadTexture(lookbookTexture);

  // model.scale.set(2.5, 2.5, 2.5);
  // model.position.y = -2.3;
  model.scene.traverse(
    generateMaterialChange({ hairColor, skinTone, lookbook })
  );

  return model;
}

interface IWishlistImage {
  data: WishlistData[];
  // imageBase64Urls: string[];
  width: number;
}

export async function generateWishlistImage({
  data,
  // imageBase64Urls,
  width,
}: IWishlistImage) {
  const PADDING = 16 * devicePixelRatio;
  const PRODUCT_GAP = 8 * devicePixelRatio;
  const CANVAS_WIDTH = width * devicePixelRatio;
  const LOGO_WIDTH = 335 * devicePixelRatio;
  const productThumbnail = {
    width: (CANVAS_WIDTH - PADDING * 4) / 4,
    height: (CANVAS_WIDTH - PADDING * 4) / 4,
  };
  const PRODUCT_ROW_HEIGHT = productThumbnail.height + PADDING * 4;

  const headingSection = {
    top: 0,
    left: 0,
    width: CANVAS_WIDTH,
    height: 90 * devicePixelRatio + PADDING * 2,
  };

  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height =
    headingSection.height + (PRODUCT_ROW_HEIGHT + PRODUCT_GAP) * data.length;

  const narsLogo = await new Promise<HTMLImageElement>(
    resolveImageLoad(LOGO_WIDTH, 88 * devicePixelRatio, "/images/nars-logo.svg")
  );

  const ctx = canvas.getContext("2d");

  ctx.beginPath();
  ctx.rect(
    headingSection.left,
    headingSection.top,
    headingSection.width,
    headingSection.height
  );
  ctx.fillStyle = "black";
  ctx.fill();

  ctx.drawImage(
    narsLogo,
    (CANVAS_WIDTH - LOGO_WIDTH) / 2,
    PADDING,
    335 * devicePixelRatio,
    88 * devicePixelRatio
  );

  const productThumbnails = await Promise.all(
    data
      .map(({ product }) => {
        if (product.productThumbnail) {
          const url = product.productThumbnail.replace("http://", "https://");

          return `${process.env.VITE_BACKEND_URL}/download/file?url=${url}`;
        }

        return "";
      })
      .map(
        (url) =>
          new Promise<HTMLImageElement>(resolveImageLoad(600, 600, url, true))
      )
  );

  /* const productThumbnails = await Promise.all(
    imageBase64Urls.map(
      (base64Url) =>
        new Promise<HTMLImageElement>(
          resolveImageLoad(600, 600, base64Url, true)
        )
    )
  ); */

  productThumbnails.forEach((image, index, array) => {
    const productRowDistanceFromTop =
      headingSection.height + (PRODUCT_ROW_HEIGHT + PRODUCT_GAP) * index;

    // Draw white background
    ctx.beginPath();
    ctx.rect(
      headingSection.left,
      productRowDistanceFromTop,
      headingSection.width,
      PRODUCT_ROW_HEIGHT
    );
    ctx.fillStyle = "white";
    ctx.fill();

    // Draw product's thumbnail
    ctx.drawImage(
      image,
      PADDING,
      productRowDistanceFromTop + PADDING,
      productThumbnail.width * 1.5,
      productThumbnail.height * 1.5
    );

    // Draw product's name
    handleProductName({
      data,
      index,
      ctx,
      PADDING,
      productThumbnail,
      productRowDistanceFromTop,
      CANVAS_WIDTH,
    });

    // render product variant
    handleProductVariant({
      data,
      index,
      ctx,
      PADDING,
      productThumbnail,
      productRowDistanceFromTop,
      CANVAS_WIDTH,
    });

    // Render product's name

    // ctx.font = `${0.05 * CANVAS_WIDTH}px Helvetica Neue`;
    // ctx.fillStyle = "black";
    // const productNameBefore = data[index].product.name.replace(
    //   /<\/?[^>]+(>|$)/g,
    //   ""
    // );
    // const productName = productNameBefore.toUpperCase();
    // if (productName.length > 22) {
    //   const maxLength = 22;
    //   const trimmedString = productName.slice(0, maxLength);
    //   const minWord = Math.min(
    //     trimmedString.length,
    //     trimmedString.lastIndexOf(" ")
    //   );
    //   const first = trimmedString.slice(0, minWord);
    //   const second = productName.slice(minWord).trimStart();
    //   ctx.fillText(
    //     first,
    //     PADDING * 4 + productThumbnail.width,
    //     PADDING * 2.5 + productRowDistanceFromTop,
    //     CANVAS_WIDTH - (PADDING * 3 + productThumbnail.width + PADDING * 3)
    //   );
    //   ctx.fillText(
    //     second,
    //     PADDING * 4 + productThumbnail.width,
    //     PADDING * 4 + productRowDistanceFromTop,
    //     CANVAS_WIDTH - (PADDING * 3 + productThumbnail.width + PADDING * 3)
    //   );
    // } else {
    //   ctx.fillText(
    //     productName,
    //     PADDING * 4 + productThumbnail.width,
    //     PADDING * 4 + productRowDistanceFromTop,
    //     CANVAS_WIDTH - (PADDING * 3 + productThumbnail.width + PADDING * 3)
    //   );
    // }

    // // Render variant's color
    // if (data[index].productVariant) {
    //   ctx.beginPath();
    //   ctx.rect(
    //     PADDING * 4 + productThumbnail.width,
    //     PADDING * 5.2 + productRowDistanceFromTop,
    //     PADDING,
    //     PADDING
    //   );
    //   ctx.fillStyle = data[index].productVariant.hexCode;
    //   ctx.fill();

    //   // Render variant's name
    //   const productVariantName = data[index].productVariant.name.toUpperCase();
    //   if (productVariantName.length > 20) {
    //     const maxLength = 20;
    //     const trimmedString = productVariantName.slice(0, maxLength);
    //     const minWord = Math.min(
    //       trimmedString.length,
    //       trimmedString.lastIndexOf(" ")
    //     );
    //     const first = trimmedString.slice(0, minWord);
    //     const second = productVariantName.slice(minWord).trimStart();

    //     ctx.font = `${0.04 * CANVAS_WIDTH}px Helvetica Neue`;
    //     ctx.fillStyle = "black";
    //     ctx.fillText(
    //       first,
    //       PADDING * 5.5 + productThumbnail.width,
    //       PADDING * 6 + productRowDistanceFromTop,
    //       CANVAS_WIDTH - (PADDING * 3 + productThumbnail.width + PADDING * 3)
    //     );
    //     ctx.fillText(
    //       second,
    //       PADDING * 5.5 + productThumbnail.width,
    //       PADDING * 7.5 + productRowDistanceFromTop,
    //       CANVAS_WIDTH - (PADDING * 3 + productThumbnail.width + PADDING * 3)
    //     );
    //   } else {
    //     ctx.font = `${0.04 * CANVAS_WIDTH}px Helvetica Neue`;
    //     ctx.fillStyle = "black";
    //     ctx.fillText(
    //       productVariantName,
    //       PADDING * 5.5 + productThumbnail.width,
    //       PADDING * 6 + productRowDistanceFromTop,
    //       CANVAS_WIDTH - (PADDING * 3 + productThumbnail.width + PADDING * 3)
    //     );
    //   }
    // }

    if (index !== array.length - 1) {
      // Draw the black gap between product rows
      ctx.beginPath();
      ctx.rect(
        headingSection.left,
        productRowDistanceFromTop + PRODUCT_ROW_HEIGHT,
        headingSection.width,
        PRODUCT_GAP
      );
      ctx.fillStyle = "black";
      ctx.fill();
    }
  });

  return canvas.toDataURL();
}

const handleProductName = ({
  data,
  index,
  ctx,
  PADDING,
  productThumbnail,
  productRowDistanceFromTop,
  CANVAS_WIDTH,
}) => {
  ctx.font = `100 ${0.045 * CANVAS_WIDTH}px Helvetica Neue`;
  ctx.fillStyle = "black";
  const productNameWithoutTags = data[index].product.name.replace(
    /<\/?[^>]+(>|$)/g,
    ""
  );
  const productName = productNameWithoutTags.toUpperCase();
  if (productName.length > 17) {
    const maxLength = 17;
    const trimmedString = productName.slice(0, maxLength);
    const minWord = Math.min(
      trimmedString.length,
      trimmedString.lastIndexOf(" ")
    );
    const first = trimmedString.slice(0, minWord);
    const second = productName.slice(minWord).trimStart();

    ctx.fillText(
      "NARS ",
      PADDING * 4 + productThumbnail.width,
      PADDING * 2.5 + productRowDistanceFromTop,
      CANVAS_WIDTH - (PADDING * 3 + productThumbnail.width + PADDING * 3)
    );

    ctx.font = `250 ${0.045 * CANVAS_WIDTH}px Noto Sans CJK SC Light`;
    ctx.fillText(
      first.replace("NARS", ""),
      PADDING * 7.3 + productThumbnail.width,
      PADDING * 2.5 + productRowDistanceFromTop,
      CANVAS_WIDTH - (PADDING * 3 + productThumbnail.width + PADDING * 3)
    );

    ctx.fillText(
      second,
      PADDING * 4 + productThumbnail.width,
      PADDING * 4 + productRowDistanceFromTop,
      CANVAS_WIDTH - (PADDING * 3 + productThumbnail.width + PADDING * 3)
    );
  } else {
    ctx.fillText(
      "NARS ",
      PADDING * 4 + productThumbnail.width,
      PADDING * 4 + productRowDistanceFromTop,
      CANVAS_WIDTH - (PADDING * 3 + productThumbnail.width + PADDING * 3)
    );

    ctx.font = `250 ${0.045 * CANVAS_WIDTH}px Noto Sans CJK SC Light`;
    ctx.fillText(
      productName.replace("NARS", ""),
      PADDING * 7.3 + productThumbnail.width,
      PADDING * 4 + productRowDistanceFromTop,
      CANVAS_WIDTH - (PADDING * 3 + productThumbnail.width + PADDING * 3)
    );
  }
};

const handleProductVariant = ({
  data,
  index,
  ctx,
  PADDING,
  productThumbnail,
  productRowDistanceFromTop,
  CANVAS_WIDTH,
}) => {
  // Render variant's color
  if (data[index].productVariant) {
    ctx.beginPath();
    ctx.rect(
      PADDING * 4 + productThumbnail.width,
      PADDING * 5.2 + productRowDistanceFromTop,
      PADDING,
      PADDING
    );
    if (
      data[index].productVariant.hexCode &&
      data[index].productVariant.hexCode.toLowerCase() === "#ffffff"
    ) {
      ctx.stroke();
    }
    ctx.fillStyle = data[index].productVariant.hexCode;
    ctx.fill();

    // Render variant's name
    const productVariantName = data[index].productVariant.name.toUpperCase();
    if (productVariantName.includes("-")) {
      const sliceProductVariantName = productVariantName.split("-");
      const first = sliceProductVariantName[0] + " - ";
      const second = sliceProductVariantName[1];

      ctx.font = `100 ${0.04 * CANVAS_WIDTH}px Helvetica Neue`;
      ctx.fillStyle = "black";

      ctx.fillText(
        first,
        PADDING * 5.5 + productThumbnail.width,
        PADDING * 6 + productRowDistanceFromTop,
        CANVAS_WIDTH - (PADDING * 3 + productThumbnail.width + PADDING * 3)
      );

      if (productVariantName.length > 18) {
        ctx.fillText(
          second,
          PADDING * 5.5 + productThumbnail.width,
          PADDING * 7.5 + productRowDistanceFromTop,
          CANVAS_WIDTH - (PADDING * 3 + productThumbnail.width + PADDING * 3)
        );
      } else {
        ctx.font = `250 ${0.04 * CANVAS_WIDTH}px Noto Sans CJK SC Light`;
        ctx.fillStyle = "black";
        ctx.fillText(
          second,
          PADDING * (5.5 + first.length * 0.5) + productThumbnail.width,
          PADDING * 6 + productRowDistanceFromTop,
          CANVAS_WIDTH - (PADDING * 3 + productThumbnail.width + PADDING * 3)
        );
      }
    } else {
      ctx.font = `100 ${0.04 * CANVAS_WIDTH}px Helvetica Neue`;
      ctx.fillStyle = "black";
      ctx.fillText(
        productVariantName,
        PADDING * 5.5 + productThumbnail.width,
        PADDING * 6 + productRowDistanceFromTop,
        CANVAS_WIDTH - (PADDING * 3 + productThumbnail.width + PADDING * 3)
      );
    }
  }
};
