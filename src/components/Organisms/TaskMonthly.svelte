<script lang="ts">
  import { getTaskMonthly, ResponseTaskMonthly } from "@/api/tasks";
  import Button from "@/components/Atoms/Button.svelte";
  import NavaGuide from "@/components/Molecules/NavaGuide.svelte";
  import { retailerName } from "@/stores/retailer";
  import { isShowTaskMonthly } from "@/stores/taskMonthly";
  import { isNewUser } from "@/stores/tutorial";
  import { _ } from "svelte-i18n";
  import { navigate } from "svelte-routing";
  import { setshowNotifIcon } from "@/utils";
  import { replaceEnVersionWithHelvetica } from "@/utils/regexHelper";
  // import { showNotifIconStore } from "@/stores/notifications";

  let coinIcon = "/images/coin-icon.png";
  let dataTask: ResponseTaskMonthly;

  const onboardingTasks = [
    {
      name: $_("tasks.welcomeOnboard"),
      reward: 0,
    },
    {
      name: $_("tasks.createyourownavatar.onboarding"),
      reward: 100,
    },
    {
      name: $_("tasks.reacttoapost.onboarding"),
      reward: 100,
    },
  ];

  async function getTaskList() {
    try {
      dataTask = await getTaskMonthly();
      if (!dataTask?.data.length) {
        isShowTaskMonthly.update(() => false);
      }
    } catch (e) {
      console.log("Task Error", e.message);
    }
  }

  isShowTaskMonthly.subscribe((value) => {
    if (value) {
      getTaskList();
    }
  });

  function handleCloseTaskList() {
    isShowTaskMonthly.update(() => false);
    $isNewUser = false;
  }

  function handleToGame() {
    handleCloseTaskList();
    navigate(`/${$retailerName}/game`);
  }
  $: {
    if (dataTask?.data.length) {
      setshowNotifIcon("not");
      // $showNotifIconStore = false;
    }
  }
</script>

{#if $isShowTaskMonthly}
  {#if $isNewUser}
    <div class="taskMonthly">
      <div class="skip-button"></div>
      <div class="sliderItemTask">
        <div class="title-container has-text-centered">
          <p class="title">{@html $_("tutorialModal.titles.6")}</p>
        </div>
        <div class="task-list">
          {#each onboardingTasks as item (item.name)}
            <div class="task-list-data">
              <p class="list-task-label">{@html item.name}</p>
              {#if item.reward}
                <button class="button-task">
                  <!-- + -->
                  <div class="plus-sign"></div>
                  <span>
                    <img
                      class="image"
                      src="{coinIcon}"
                      alt=""
                      width="36"
                      height="36"
                    />
                  </span>
                  <span class="button-title">
                    {@html replaceEnVersionWithHelvetica(`${item.reward}`)}
                  </span>
                </button>
              {:else}
                <button class="button-task done">
                  {$_("tutorialModal.done")}
                </button>
              {/if}
            </div>
          {/each}
        </div>
      </div>
      <div class="started-button-task">
        <Button onClick="{handleCloseTaskList}">
          {$_("tutorialModal.start")}
        </Button>
      </div>
    </div>
  {:else if dataTask?.data.length}
    <div class="taskMonthly">
      <div class="skip-button"></div>
      <div class="sliderItemTask">
        <div class="title-container has-text-centered">
          <p class="title">{@html $_("tutorialModal.titles.5")}</p>
        </div>
        <div class="task-list">
          {#if dataTask}
            {#each dataTask.data as item (item.id)}
              <div class="task-list-data">
                <p class="list-task-label">
                  {$_(`tasks.${item.name.toLowerCase().replace(/\s/g, "")}`)}
                </p>
                {#if item.reward}
                  <button class="button-task">
                    <!-- + -->
                    <div class="plus-sign"></div>
                    <span>
                      <img
                        class="image"
                        src="{coinIcon}"
                        alt=""
                        width="36"
                        height="36"
                      />
                    </span>
                    <span class="button-title">
                      {item.reward}
                    </span>
                  </button>
                {:else}
                  <button class="button-task-game" on:click="{handleToGame}">
                    GO
                  </button>
                {/if}
              </div>
            {/each}
          {/if}
        </div>
      </div>
      <div class="started-button-task">
        <Button onClick="{handleCloseTaskList}">
          {$_("tutorialModal.start")}
        </Button>
      </div>
      <NavaGuide
        message="{$_('tutorialModal.bubbleSpeeches.5')}"
        goToProfile="{false}"
        showNcoin="{false}"
      />
    </div>
  {/if}
{/if}

<style lang="scss">
  @import "../../styles/typography";

  .taskMonthly {
    position: absolute;
    z-index: 12;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.9);

    .skip-button {
      margin-top: 10px;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }

    .sliderItemTask {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 1px solid white;
      width: 90%;
      margin: 40% auto 0;

      .title-container {
        text-align: center;
        margin-bottom: 1rem;
        padding: 5px;

        .title {
          @include typography;
          font-weight: lighter;
          font-size: 1.5rem;
          line-height: 2.25rem;
          margin-top: 1rem;
        }
      }

      .task-list {
        margin: 20px;
        width: 90%;

        .task-list-data {
          border-bottom: 1px solid #292929;
          // margin-bottom: 10px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 0;

          &:first-of-type {
            border-top: 1px solid #292929;
          }

          .list-task-label {
            @include typography;
            font-weight: 300;
            width: 60%;
            text-align: start;
            text-transform: uppercase;
          }

          .button-task {
            background-color: white !important;
            color: black;
            width: auto;
            height: 100%;
            min-width: 100px;
            padding-left: 10px;
            padding-right: 10px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            padding: 5px 10px 5px 10px;

            &.done {
              background-color: #9f9f9f !important;
              color: white;
            }

            .image {
              margin-left: 5px;
              margin-right: 5px;
              width: 20px;
            }
          }

          /* .button-title {
            padding-top: 4px;
          } */

          .button-task-game {
            color: black;
            width: auto;
            min-width: 100px;
            border: 1px solid;
            padding-left: 10px;
            padding-right: 10px;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            padding: 5px 10px 5px 10px;
          }
        }
      }
    }

    .started-button-task {
      width: fit-content;
      margin: 30px auto;
    }

    .plus-sign {
      display: inline-block;
      width: 1em;
      height: 1em;
      background: linear-gradient(#000 0 0), linear-gradient(#000 0 0);
      background-position: center;
      background-size: 50% 0.1rem, 0.1rem 50%; /*thickness = 2px, length = 50% (25px)*/
      background-repeat: no-repeat;
    }
  }
</style>
