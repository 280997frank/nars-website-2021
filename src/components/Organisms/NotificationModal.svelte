<script lang="ts">
  import { fetchNotifications } from "@/api/notification";
  import InfiniteScroll from "@/components/Atoms/InfiniteScroll.svelte";
  import Modal from "@/components/Atoms/Modal.svelte";
  import { handleDate } from "@/constants/dates";
  import type { INotification } from "@/interfaces/notification";
  import { getAccessToken } from "@/utils";
  import {
    replaceAllTags,
    replaceEnVersionWithHelvetica,
  } from "@/utils/regexHelper";
  import dayjs from "dayjs";
  import customParseFormat from "dayjs/plugin/customParseFormat";
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";

  interface EnrichedNotificationItem extends INotification {
    date: string;
    content: string;
  }

  dayjs.extend(customParseFormat);
  export let isOpen = false;
  export let isFetchNewNotif = false;
  export let onClose = () => null;
  export let showNotifOnNava = (haveNotif: boolean) => {
    haveNotif;
  };

  let page = 1;
  let totalPage = 1;
  let data: EnrichedNotificationItem[] = [];
  let newBatch: EnrichedNotificationItem[] = [];
  let elementScroll: number;
  let isNotFirstTime = false;

  async function fetchData() {
    const response = await fetchNotifications(page);
    if (response.data.length > 0) {
      newBatch = response.data.map((item: INotification) => {
        return {
          ...item,
          date: handleDate(item.updatedAt),
          content: replaceAllTags(item.content),
        };
      });
      // showNotifOnNava(true);
      totalPage = response.totalPage;
    } else {
      newBatch = response.data;
      showNotifOnNava(false);
      totalPage = response.totalPage;
    }
  }

  onMount(() => {
    const token = getAccessToken();
    if (token) {
      fetchData();
    }
  });

  $: {
    data = [...data, ...newBatch];
  }
  $: {
    if (isOpen) {
      isNotFirstTime = true;
    }
  }

  $: {
    if (page == totalPage && isNotFirstTime == true) {
      showNotifOnNava(false);
    }
  }

  $: {
    if (isFetchNewNotif) {
      data = [];
      page = 1;
      fetchData();
      totalPage = 1;
    }
  }

  $: {
    // console.log("isFetchNewNotif", isFetchNewNotif)
    // console.log("isOpen", isOpen)
    if (isOpen && isFetchNewNotif) {
      showNotifOnNava(false);
    }
  }
</script>

<Modal isOpen="{isOpen}" onClose="{onClose}" title="{$_('notification.title')}">
  <div class="notification-data">
    {#if data.length > 0}
      {#each data as item (item.id)}
        <div>
          <h6 class="helvetica-neue-light">
            {dayjs(item.date, "DD.MM.YYYY").format("YYYY/MM/DD")}
          </h6>
          <p class="content">
            {@html replaceEnVersionWithHelvetica(item.content)}
          </p>
          <hr />
        </div>
      {/each}
      <InfiniteScroll
        elementScroll="{elementScroll}"
        hasMore="{newBatch.length > 0 && page < totalPage}"
        threshold="{100}"
        on:loadMore="{() => {
          page++;
          fetchData();
        }}"
      />
    {:else}
      <div class="empty-notification">
        <p>{$_("notification.noNotifications")}</p>
      </div>
    {/if}
  </div>
</Modal>
<svelte:window bind:scrollY="{elementScroll}" />

<style lang="scss">
  @use "../../styles/typography" as t;

  .notification-data {
    height: 42vh;
    overflow-y: auto;
  }
  h6 {
    margin: 2px 0;
    font-weight: 250;
    color: white;
  }
  .content {
    font-weight: 300 !important;
    color: white !important;
  }

  hr {
    background-color: #292929;
    height: 1px;
  }

  .empty-notification {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 18px;
    font-weight: 250;
    color: white;
  }
</style>
