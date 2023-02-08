const ITEM_NAME = "opened-product-ids";

export function saveOpenedProductId(productId: string) {
  let list: string[] = [];

  try {
    list = JSON.parse(localStorage.getItem(ITEM_NAME));
    if (!Array.isArray(list)) {
      list = [];
      throw new Error("Not an array of products");
    }
  } catch (error) {
    // reset the storage item
    console.error(error.message);
  } finally {
    if (!list.includes(productId)) {
      list.push(productId);
      localStorage.setItem("opened-product-ids", JSON.stringify(list));
    }
  }
}

export function shouldSendCompleteTaskRequest() {
  try {
    const list: string[] = JSON.parse(localStorage.getItem(ITEM_NAME));
    if (!Array.isArray(list)) {
      throw new Error("Not an array of products");
    }

    return list.length === 3;
  } catch (error) {
    console.error(error.message);
    return false;
  }
}
