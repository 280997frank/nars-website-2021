<script lang="ts">
  import type { TTaskData } from "@/api/wallet";
  import { getCoinHistory, getTasks, TCoinHistory } from "@/api/wallet";
  import CoinHistoryIcon from "@/components/Atoms/Icons/CoinHistoryIcon.svelte";
  import RedCoinIcon from "@/components/Atoms/Icons/RedCoin.svelte";
  import { userData } from "@/stores/profile";
  import { useMutation } from "@sveltestack/svelte-query";
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  // import { toasts } from "svelte-toasts";

  export let title = "TASKS";

  let dataTask: TTaskData[] = [];
  let historyData: TCoinHistory[] = [];

  const mutationGetTask = useMutation(getTasks, {
    onError(error: Error) {
      console.log("GET TASK ERROR", error.message);
    },
  });

  const mutationGetCoinHistory = useMutation(getCoinHistory, {
    onError(error: Error) {
      console.log("GET Coin History ERROR", error.message);
    },
  });

  function renderHistoryItem(name: string, taskType: string) {
    // const minifiedName = name.toLowerCase().replace(/\s/g, "");
    const key = `ncoinHistory.${name}.${taskType}`;
    const translatedName = $_(key);
    // console.log(translatedName, "translatedName");
    if (translatedName === key) {
      return name;
    }

    return translatedName;
  }

  onMount(() => {
    if (title === $_("nwallet.history")) {
      $mutationGetCoinHistory.mutate();
    } else {
      $mutationGetTask.mutate();
    }
  });

  $: {
    if ($mutationGetCoinHistory.isSuccess) {
      const newDataHistory = $mutationGetCoinHistory.data.data;
      historyData = newDataHistory;
    } else if ($mutationGetTask.isSuccess && $userData) {
      // NOTE: Only show monthly tasks starting from the 2nd month of membership
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const signupTimestamp = new Date($userData.createdAt);
      const signupMonth = signupTimestamp.getMonth() + 1;
      const showMonthlyTasks = currentMonth !== signupMonth;
      if (showMonthlyTasks) {
        dataTask = $mutationGetTask.data.data;
      } else {
        dataTask = $mutationGetTask.data.data.filter(
          (item) => item.taskType !== "monthly"
        );
      }
    }
  }
</script>

<div class="task-container">
  <h1 class="title">{title}</h1>
  <div class="list-wrapper">
    {#if $mutationGetTask.isLoading}
      <div id="loading">{$_("nwallet.loading")}</div>
    {/if}
    {#if title === $_("tasks.task") && dataTask.length !== 0}
      {#each dataTask as item (item.id)}
        <div class="{`list-item`}">
          <h5 class="right-item-title">
            {@html $_(
              `tasks.${item.name.toLowerCase().replace(/\s/g, "")}.${
                item.taskType
              }`
            )}
            <!-- {item.taskType === "qrcode" ? `- ${item.qrName}` : ``} -->
          </h5>
          <div class="{`btn-coin bg-white`}">
            <!-- <span class="{`btn-coin-plus`}">+</span> -->
            <div class="plus-sign-small"></div>
            <RedCoinIcon width="{16}" height="{16}" />
            <span class="btn-coin-coin helvetica-neue">{item.reward}</span>
          </div>
        </div>
      {/each}
    {/if}
    {#if title === $_("nwallet.history") && historyData.length !== 0}
      {#each historyData as item (item.id)}
        <div class="{`list-item`}">
          <h5 class="right-item-title">
            {@html renderHistoryItem(item.sourceName, item.taskType)}
          </h5>
          <button class="{`btn-coin bg-gray`}">
            <!-- <span class="{`btn-coin-plus`}"> -->
            <!-- {item.transactionType === "allocation" ? `+` : `-`} -->
            {#if item.transactionType === "allocation"}
              <div class="plus-sign-small"></div>
            {:else}
              <div class="minus-sign-small"></div>
            {/if}
            <!-- </span> -->
            <CoinHistoryIcon fill="#4d4d4d" width="{16}" height="{16}" />
            <span class="btn-coin-coin helvetica-neue">{item.value}</span>
          </button>
        </div>
      {/each}
    {/if}
  </div>
</div>

<style lang="scss">
  @import "../../styles/typography";

  .task-container {
    padding: 1rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  #loading {
    opacity: 0.5;
    font-weight: bold;
    color: #fff;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .title {
    @include typography;
    text-align: left;
    color: #fff;
    padding: 0;
    font-size: 14px;
    margin: 0;
    padding-bottom: 1rem;
    border-bottom: 1px solid #1f1f1f;
    font-weight: 300;
  }
  .list-item {
    min-height: 60px;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid #1f1f1f;
  }
  .list-wrapper {
    display: flex;
    flex-direction: column;
    // max-height: 43vh;
    // overflow-y: auto;
  }
  .right-item-title {
    color: #fff;
    font-size: 14px;
    font-weight: 300;
    max-width: 65%;
  }
  .btn-coin {
    color: #000;
    height: 30px;
    width: 88px;
    display: flex;
    flex-direction: row;
    align-items: center;
    // justify-content: center;
    padding-left: 12px;
  }
  .bg-white {
    background-color: #fff;
  }
  .bg-gray {
    background-color: #9f9f9f;
  }
  .btn-coin-plus {
    margin-right: 5px;
  }
  .btn-coin-coin {
    // padding-top: 5px;
    font-size: 13px;
    margin-left: 4px;

    @supports (-webkit-touch-callout: none) {
      padding-top: 4px;
    }
  }

  @mixin sign($size, $char) {
    display: inline-block;
    width: $size;
    height: $size;
    background: linear-gradient(#000 0 0), linear-gradient(#000 0 0);
    background-position: center;
    background-repeat: no-repeat;

    @if $char == "plus" {
      background-size: 50% 0.1rem, 0.1rem 50%;
    } @else {
      background-size: 50% 0.1rem;
    }
  }

  .plus-sign {
    /* display: inline-block;
    width: 1rem;
    height: 1rem;
    background: linear-gradient(#000 0 0), linear-gradient(#000 0 0);
    background-position: center;
    background-size: 50% 0.1rem, 0.1rem 50%;
    background-repeat: no-repeat; */
    &-big {
      @include sign(1rem, "plus");
    }

    &-small {
      @include sign(1em, "plus");
    }
  }

  .minus-sign {
    &-big {
      @include sign(1rem, "minus");
    }

    &-small {
      @include sign(1em, "minus");
    }
  }
</style>
