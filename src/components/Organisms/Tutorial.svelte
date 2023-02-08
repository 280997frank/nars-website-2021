<script lang="ts">
  import Button from "@/components/Atoms/Button.svelte";
  import NavaGuide from "@/components/Molecules/NavaGuide.svelte";
  import { isShowTaskMonthly } from "@/stores/taskMonthly";
  import { isNewUser, isShowTutorial } from "@/stores/tutorial";
  import { getUsername } from "@/utils";
  import Carousel from "svelte-carousel";
  import { _ } from "svelte-i18n";
  import { setshowNotifIcon } from "@/utils";

  let tutorialState = 1;
  let indexSlider = 0;
  let dotShown = true;
  export let username = "";

  const dataTutorial1 = [
    {
      title: $_("tutorialModal.titles.0"),
      image: "/images/tutorial_1.png",
      chat: $_("tutorialModal.bubbleSpeeches.0", {
        values: {
          name: username ? username : getUsername(),
        },
      }),
    },
    {
      title: $_("tutorialModal.titles.1"),
      image: $_("tutorialModal.images.0"),
      chat: $_("tutorialModal.bubbleSpeeches.1", {
        values: { name: username ? username : getUsername() },
      }),
    },
    {
      title: $_("tutorialModal.titles.2"),
      image: $_("tutorialModal.images.3"),
      chat: $_("tutorialModal.bubbleSpeeches.2"),
    },
    {
      title: $_("tutorialModal.titles.3"),
      image: $_("tutorialModal.images.4"),
      chat: $_("tutorialModal.bubbleSpeeches.3"),
    },
    {
      title: $_("tutorialModal.titles.4"),
      image: $_("tutorialModal.images.1"),
      chat: $_("tutorialModal.bubbleSpeeches.4"),
    },
  ];
  const dataTutorial2 = [
    {
      title: $_("tutorialModal.titles.4"),
      image: $_("tutorialModal.images.2"),
      chat: $_("tutorialModal.bubbleSpeeches.5"),
    },
  ];

  function handleChange(index: number) {
    indexSlider = index;
    dotShown = index !== dataTutorial1.length - 1;
  }

  function handleSkip() {
    tutorialState = tutorialState + 1;
  }

  function handleRemoveIsNewUser() {
    $isShowTutorial = false;
    $isNewUser = true;
    $isShowTaskMonthly = true;
    // isShowTaskMonthly.update(() => true);
  }

  $: {
    if (dataTutorial1[indexSlider].chat || tutorialState === 2) {
      setshowNotifIcon("not");
      // $showNotifIconStore = false;
    }
  }
</script>

{#if tutorialState === 1}
  <div class="tutorial">
    <div class="skip-button">
      {#if dotShown}
        <Button className="is-text" onClick="{handleSkip}">
          {$_("tutorialModal.skip")}
        </Button>
      {/if}
    </div>
    <div class="sliderItem">
      <div class="title-container has-text-centered">
        <p class="title">{@html dataTutorial1[indexSlider].title}</p>
      </div>
      <Carousel
        swiping="{true}"
        arrows="{false}"
        dots="{dotShown}"
        infinite="{false}"
        autoplay="{false}"
        on:pageChange="{(event) => handleChange(event.detail)}"
      >
        {#each dataTutorial1 as item (item.title)}
          <div class="itemImage">
            {#if indexSlider === 4}
              <img
                class="image last-tutorial-1"
                src="{item.image}"
                alt=""
                draggable="false"
              />
            {:else}
              <img class="image" src="{item.image}" alt="" draggable="false" />
            {/if}
          </div>
        {/each}
      </Carousel>
      {#if !dotShown}
        <div class="started-button mt-3">
          <Button onClick="{handleSkip}"
            >{$_("tutorialModal.getStarted")}</Button
          >
        </div>
      {/if}
    </div>
    {#if dataTutorial1[indexSlider].chat}
      <NavaGuide
        message="{dataTutorial1[indexSlider].chat}"
        goToProfile="{false}"
        showNcoin="{false}"
      />
    {/if}
  </div>
{:else if tutorialState === 2}
  <!--    <div class="skip-button"></div>-->
  <div class="tutorial">
    <div class="sliderItem mt-3">
      <div class="title-container has-text-centered">
        <!-- <p class="title">{@html dataTutorial1[indexSlider].title}</p> -->
        <p class="title"></p>
      </div>
      <Carousel
        swiping="{false}"
        arrows="{false}"
        dots="{false}"
        infinite="{false}"
        autoplay="{false}"
        on:pageChange="{(event) => handleChange(event.detail)}"
      >
        {#each dataTutorial2 as item (item.title)}
          <div class="itemImage">
            <img
              class="image"
              src="{item.image}"
              alt=""
              width="90%"
              draggable="false"
            />
          </div>
        {/each}
      </Carousel>
      <div class="started-button">
        <Button onClick="{handleRemoveIsNewUser}">
          {$_("tutorialModal.collect")}
        </Button>
      </div>
    </div>
    <NavaGuide
      message="{dataTutorial2[0].chat}"
      goToProfile="{false}"
      showNcoin="{false}"
    />
  </div>
{:else}
  <div></div>
{/if}

<style lang="scss">
  @import "../../styles/typography";

  .tutorial {
    position: absolute;
    z-index: 12;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0 0 0 / 90%);

    .skip-button {
      margin-top: 10px;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }

    .sliderItem {
      min-height: 70%;
      height: fit-content;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      @media only screen and (max-width: 376px) {
        height: 64%;
      }

      .title-container {
        text-align: center;
        margin-bottom: 10%;
        padding: 0 20px;

        @media only screen and (max-width: 376px) {
          margin-bottom: 5%;
        }

        .title {
          @include typography;
          font-weight: 100;
          font-size: 22px;
          line-height: 2.25rem;
          margin-top: 1rem;
          @media only screen and (max-width: 375px) {
            font-size: 18px;
            line-height: 1.5rem;
          }
        }
      }

      .itemImage {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .last-tutorial-1 {
          width: 100%;
          height: auto;

          // iphone 13 pro on safari with toolbar
          @media only screen and (max-width: 390px) and (max-height: 664px) {
            height: 300px;
            width: auto;
          }
        }

        .title {
          text-align: center;
          font-size: 10px;
        }
      }
    }

    .started-button {
      width: fit-content;
    }
  }
</style>
