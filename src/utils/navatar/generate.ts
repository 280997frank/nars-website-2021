import { get } from "svelte/store";
import { _ } from "svelte-i18n";

import { fetchProductsByLookbookId, getNavatar } from "@/api/navatar";

import {
  productsUsedBySelectedLookbook,
  selectedNavatarModel,
} from "@/stores/navatar";

import type { IProductImage } from "@/interfaces/product";

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

const qrCodePromise = (qrCodepath: string) =>
  new Promise<HTMLImageElement>(resolveImageLoad(3544, 3544, qrCodepath));

const qrCodeProductPromise = new Promise<HTMLImageElement>(
  resolveImageLoad(3544, 3544, "/images/qr-code-product.png")
);

interface IStaticImage {
  qrCodePath: string;
  source: HTMLCanvasElement;
  productThumbnailUrls: string[];
}

export async function generateStaticImage(config: IStaticImage) {
  const { qrCodePath, source, productThumbnailUrls } = config;

  const PADDING = 16 * devicePixelRatio;
  const GAP_SIZE = 10 * window.devicePixelRatio;
  const PRODUCT_ROWS = Math.ceil(productThumbnailUrls.length / 3);
  const CANVAS_WIDTH = source.width;
  const productThumbnail = {
    width: (CANVAS_WIDTH - GAP_SIZE * 4) / 3,
    height: (CANVAS_WIDTH - GAP_SIZE * 4) / 3,
  };
  const whiteSection = {
    top: source.height,
    left: 0,
    width: CANVAS_WIDTH,
    height:
      productThumbnail.height * (1 + PRODUCT_ROWS) +
      GAP_SIZE * (2 + PRODUCT_ROWS),
  };
  const CANVAS_HEIGHT = source.height + whiteSection.height;

  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  // products and qr code section
  const productThumbnailsPromises = productThumbnailUrls.map((url) => {
    return new Promise<HTMLImageElement>(resolveImageLoad(600, 600, url, true));
  });

  const share3DPromise = new Promise<HTMLImageElement>(
    resolveImageLoad(source.width, source.height, source.toDataURL())
  );

  const [qrCode, share3D] = await Promise.all([
    qrCodePromise(qrCodePath),
    share3DPromise,
  ]);
  const productThumbnails = await Promise.all(productThumbnailsPromises);

  const ctx = canvas.getContext("2d");
  ctx.drawImage(share3D, 0, 0, source.width, source.height);

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
    whiteSection.left + GAP_SIZE * 2.5,
    whiteSection.top +
      GAP_SIZE * (1 + PRODUCT_ROWS) +
      productThumbnail.height * PRODUCT_ROWS,
    productThumbnail.width - GAP_SIZE * 1.5,
    productThumbnail.height - GAP_SIZE * 1.5
  );

  ctx.fillStyle = "black";
  // ctx.font = "32px Helvetica Neue";

  // ctx.font = `200 ${0.06 * CANVAS_WIDTH}px Noto Sans`;
  // ctx.fillText(
  //   get(_)("share.title"),
  //   whiteSection.left + GAP_SIZE * 2 + productThumbnail.width,
  //   whiteSection.top +
  //     GAP_SIZE * (3 + PRODUCT_ROWS) +
  //     productThumbnail.height * PRODUCT_ROWS +
  //     25,
  //   CANVAS_WIDTH - GAP_SIZE * 3
  // );
  //   const newTitle = get(_)("share.title")
  // ({text, leftPosition, topPosition, fontSize,  CANVAS_WIDTH, whiteSection, GAP_SIZE, productThumbnail, PRODUCT_ROWS}) => {

  replaceEnVersionCanvas({
    text: get(_)("share.title"),
    topPosition: 1,
    fontSize: 0.06,
    ctx,
    PADDING,
    CANVAS_WIDTH,
    productThumbnail,
  });

  replaceEnVersionCanvas({
    text: get(_)("share.description.0"),
    topPosition: 2.5,
    fontSize: 0.035,
    ctx,
    PADDING,
    CANVAS_WIDTH,
    productThumbnail,
  });
  replaceEnVersionCanvas({
    text: get(_)("share.description.1"),
    topPosition: 4,
    fontSize: 0.035,
    ctx,
    PADDING,
    CANVAS_WIDTH,
    productThumbnail,
  });
  replaceEnVersionCanvas({
    text: get(_)("share.description.2"),
    topPosition: 5.5,
    fontSize: 0.035,
    ctx,
    PADDING,
    CANVAS_WIDTH,
    productThumbnail,
  });
  // ctx.font = `200 ${0.035 * CANVAS_WIDTH}px Noto Sans`;
  // ctx.fillText(
  //   get(_)("share.description.0"),
  //   whiteSection.left + GAP_SIZE * 2 + productThumbnail.width,
  //   whiteSection.top +
  //     GAP_SIZE * (4 + PRODUCT_ROWS) +
  //     productThumbnail.height * PRODUCT_ROWS +
  //     60,
  //   CANVAS_WIDTH - GAP_SIZE * 3
  // );
  // ctx.fillText(
  //   get(_)("share.description.1"),
  //   whiteSection.left + GAP_SIZE * 2 + productThumbnail.width,
  //   whiteSection.top +
  //     GAP_SIZE * (5 + PRODUCT_ROWS) +
  //     productThumbnail.height * PRODUCT_ROWS +
  //     90,
  //   CANVAS_WIDTH - GAP_SIZE * 3
  // );
  // ctx.fillText(
  //   get(_)("share.description.2"),
  //   whiteSection.left + GAP_SIZE * 2 + productThumbnail.width,
  //   whiteSection.top +
  //     GAP_SIZE * (6 + PRODUCT_ROWS) +
  //     productThumbnail.height * PRODUCT_ROWS +
  //     120,
  //   CANVAS_WIDTH - GAP_SIZE * 3
  // );
  return canvas.toDataURL();
}

export async function generateImageProduct(config: IProductImage) {
  const { width, source } = config;

  const GAP_SIZE = 4 * window.devicePixelRatio;
  const CANVAS_WIDTH = width;
  const productThumbnail = {
    width: (CANVAS_WIDTH - GAP_SIZE * 4) / 3,
    height: (CANVAS_WIDTH - GAP_SIZE * 4) / 3,
  };
  let additionalHeight = 25;
  let additionalHeightOfArr = [60, 80, 100, 120];
  const nameOfString = source.name.toUpperCase().split(/(\s+)/);
  let textName = "";
  let objectOfName = [{ name: "", line: 20 }];

  let lineOfText = 20;
  nameOfString.map((item) => {
    textName += item;
    if (textName.length > 18) {
      if (item !== " ") {
        textName = item;
        lineOfText += 16;
        additionalHeight += 10;
        additionalHeightOfArr = additionalHeightOfArr.map(
          (item) => (item += 9)
        );
        objectOfName = [...objectOfName, { name: textName, line: lineOfText }];
      }
    } else {
      objectOfName = objectOfName.map((item) =>
        item.line === lineOfText ? { name: textName, line: lineOfText } : item
      );
    }
  });

  const whiteSection = {
    top: CANVAS_WIDTH,
    left: 0,
    width: CANVAS_WIDTH,
    height: productThumbnail.height + GAP_SIZE * 5 + additionalHeight,
  };
  const CANVAS_HEIGHT = CANVAS_WIDTH + whiteSection.height;

  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH * 2;
  canvas.height = CANVAS_HEIGHT * 2;
  canvas.style.width = CANVAS_WIDTH.toString();
  canvas.style.height = CANVAS_HEIGHT.toString();

  const createProduct = new Promise<HTMLImageElement>(
    resolveImageLoad(100, 100, source.url, true)
  );

  const [qrCode, product] = await Promise.all([
    qrCodeProductPromise,
    createProduct,
  ]);

  const ctx = canvas.getContext("2d");
  ctx.scale(2, 2);

  ctx.drawImage(
    product,
    0,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT - whiteSection.height
  );

  ctx.beginPath();
  ctx.rect(
    whiteSection.left,
    whiteSection.top,
    whiteSection.width,
    whiteSection.height
  );

  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.fill();

  ctx.drawImage(
    qrCode,
    whiteSection.left + GAP_SIZE,
    whiteSection.top + GAP_SIZE * 4 + additionalHeight,
    productThumbnail.width - GAP_SIZE * 1.5,
    productThumbnail.height - GAP_SIZE * 1.5
  );

  ctx.fillStyle = "black";
  ctx.font = `200 ${0.065 * CANVAS_WIDTH}px Noto Sans`;

  objectOfName.map((item) => {
    ctx.fillText(
      item.name,
      whiteSection.left + GAP_SIZE,
      whiteSection.top + GAP_SIZE + item.line - 10,
      CANVAS_WIDTH - GAP_SIZE * 3
    );
  });

  ctx.font = `200 ${0.035 * CANVAS_WIDTH}px Noto Sans`;

  const labelString = source.choosedColor.label.split(/(\s+)/);
  let label = "";
  const lineOfLabel = 20;
  const fillLabel = (text: string, line: number) => {
    ctx.fillText(
      text,
      whiteSection.left + GAP_SIZE + additionalHeightColor + 15,
      whiteSection.top + GAP_SIZE * 3 + line - 5,
      CANVAS_WIDTH
    );
  };
  const additionalHeightColor = 10;
  labelString.map((item) => {
    label += item;
    fillLabel(label, lineOfLabel);
  });

  if (source.choosedColor.color !== "") {
    ctx.fillStyle = source.choosedColor.color;
    ctx.fillRect(
      whiteSection.left + GAP_SIZE,
      whiteSection.top + GAP_SIZE * 3 + additionalHeightColor - 10,
      20,
      20
    );
  }
  ctx.fillStyle = "black";
  ctx.font = `200 ${0.06 * CANVAS_WIDTH}px Noto Sans`;

  ctx.fillText(
    get(_)("share.title"),
    whiteSection.left + GAP_SIZE + productThumbnail.width + 10,
    whiteSection.top + GAP_SIZE * 3 + additionalHeightOfArr[0],
    CANVAS_WIDTH - GAP_SIZE * 3
  );

  ctx.font = `200 ${0.035 * CANVAS_WIDTH}px Noto Sans`;
  ctx.fillText(
    get(_)("share.productDescription.0"),
    whiteSection.left + GAP_SIZE + productThumbnail.width + 10,
    whiteSection.top + GAP_SIZE * 3 + additionalHeightOfArr[1],
    CANVAS_WIDTH - GAP_SIZE * 3
  );
  ctx.fillText(
    get(_)("share.productDescription.1"),
    whiteSection.left + GAP_SIZE + productThumbnail.width + 10,
    whiteSection.top + GAP_SIZE * 3 + additionalHeightOfArr[2],
    CANVAS_WIDTH - GAP_SIZE * 3
  );
  ctx.fillText(
    get(_)("share.productDescription.2"),
    whiteSection.left + GAP_SIZE + productThumbnail.width + 10,
    whiteSection.top + GAP_SIZE * 3 + additionalHeightOfArr[3],
    CANVAS_WIDTH - GAP_SIZE * 3
  );

  return canvas.toDataURL();
}

export async function fetchNavatar() {
  const result = await getNavatar();
  if (result.data) {
    selectedNavatarModel.update(() => ({
      lookBookId: result.data.lookBookId,
      lookBookTexture: result.data.lookBookTexture,
      skintone: result.data.skinToneHex,
      hairColor: result.data.hairColorHex,
      headModel: result.data.head3dModel,
      bodyModel: result.data.outfit3dModel,
    }));

    const products = await fetchProductsByLookbookId(result.data.lookBookId);
    const temp: string[] = [];
    products.data?.lookBookProducts.forEach((product) => {
      temp.push(product.product.productThumbnail);
    });

    productsUsedBySelectedLookbook.update(() => temp);
  }
}
export const replaceEnVersionCanvas = ({
  text,
  topPosition,
  fontSize,
  ctx,
  PADDING,
  CANVAS_WIDTH,
  productThumbnail,
}) => {
  const replacedText = replaceAllTags(text);
  const word = replacedText.match(/[a-zA-Z0-9#*.,]+/g);
  const newText = replacedText.split(" ");

  if (word) {
    // exclude words with '', nbsp, and '-'
    const excludeWord = ["", "nbsp", "*"];

    // filter all word except exclude word
    const filteredWord = word.filter(
      (item) => excludeWord.indexOf(item) === -1
    );

    // making array to unique
    const uniqueArray = filteredWord.filter(function (item, pos) {
      return filteredWord.indexOf(item) === pos;
    });
    // let left = 0
    let newLeft = 0;
    newText.map((itemText: string, index: number) => {
      newLeft = index === 0 ? 0 : newLeft + newText[index - 1].length;
      // newLeft = index === 0 ? PADDING * 1.2 + productThumbnail.width : ...newLeft +  newText[index -1].length;
      // newLeft += newText[index].length - newText[0].length;

      if (uniqueArray.includes(itemText)) {
        ctx.fillStyle = "black";
        ctx.font = `200 ${fontSize * CANVAS_WIDTH}px Helvetica Neue`;
        ctx.fillText(
          itemText,
          index > 1
            ? PADDING * newLeft + productThumbnail.width
            : PADDING * (1.2 + newLeft) + productThumbnail.width,
          // PADDING * newLeft+ productThumbnail.width,
          PADDING * (31 + topPosition),
          CANVAS_WIDTH - (PADDING * 3 + productThumbnail.width + PADDING * 3)
        );
      } else {
        ctx.fillStyle = "black";
        ctx.font = `200 ${fontSize * CANVAS_WIDTH}px Noto Sans`;
        ctx.fillText(
          itemText,
          index > 1
            ? PADDING * newLeft + productThumbnail.width
            : PADDING * (1.2 + newLeft) + productThumbnail.width,
          // PADDING * newLeft+ productThumbnail.width,
          PADDING * (31 + topPosition),
          CANVAS_WIDTH - (PADDING * 3 + productThumbnail.width + PADDING * 3)
        );
      }
    });
  } else {
    // console.log("left 1", itemText)
    ctx.fillStyle = "black";
    ctx.font = `200 ${fontSize * CANVAS_WIDTH}px Noto Sans`;
    ctx.fillText(
      text,
      PADDING * 1.2 + productThumbnail.width,
      PADDING * (31 + topPosition),
      CANVAS_WIDTH - (PADDING * 3 + productThumbnail.width + PADDING * 3)
    );
  }
};

export const replaceAllTags = (text: string) => {
  return text.replace(/<\/?[^>]+(>|$)/g, "");
};
