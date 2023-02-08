<script lang="ts">
  // import { navigate } from "svelte-routing";
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";

  import Layout from "@/components/Templates/Layout.svelte";
  import Model3D from "@/components/Atoms/Model3D.svelte";
  import Navbar from "@/components/Molecules/Navbar.svelte";
  import NavaGuide from "@/components/Molecules/NavaGuide.svelte";
  import Tutorial from "@/components/Organisms/Tutorial.svelte";
  import TaskMonthly from "@/components/Organisms/TaskMonthly.svelte";

  import {
    showBubbleMessage,
    // triggerBubbleSpeech,
    updateBubbleMessageToLocalStorage,
  } from "@/utils/bubbleMessage";
  import {
    getAccessToken,
    getRoomAnalyticsId,
    setRoomAnalyticsId,
    getRoomName,
    setRoomName,
    getRoomAnalyticsType,
    getGuestId,
  } from "@/utils";

  import { currentRoom, selectedProductCategory } from "@/stores/room";
  import { isShowTutorial } from "@/stores/tutorial";
  import { retailerName as retailerNameStore } from "@/stores/retailer";
  import {
    isWelcomeModalShown,
    isExploreButtonShown,
  } from "@/stores/welcomeModal";

  import {
    sendAnalytics,
    sendGuestAnalytics,
    GuestAnalyticsType,
  } from "@/api/analytics";

  import type { BubbleMessagePosition } from "@/constants/bubbleMessage";
  import { bubbleSpeechContent } from "@/stores/bubbleContent";

  // import { useMutation } from "@sveltestack/svelte-query";
  // import { fetchProfile } from "@/api/wallet";
  import { chineseCharsPattern } from "@/constants/validationSchema";
  import { userData } from "@/stores/profile";

  export let retailerName: string;
  let username = null;

  $retailerNameStore = retailerName;

  // let bubbleMessage = "";
  // const mutationGetProfile = useMutation(fetchProfile, {
  //   onError(error: Error) {
  //     console.log("GET TASK ERROR", error.message);
  //   },
  // });

  $: {
    const data: string[] = showBubbleMessage(
      $currentRoom as BubbleMessagePosition
    );
    // console.log("datas", data, $currentRoom);
    if (data.length > 0) {
      if ($currentRoom !== "entry") {
        let numberOfIndex = data.length;
        let numberOfShow = 0;
        let timer = setInterval(() => {
          bubbleSpeechContent.update(() => data[numberOfShow]);
          if (numberOfIndex === numberOfShow || numberOfShow > 10) {
            bubbleSpeechContent.update(() => "");
            return clearInterval(timer);
          }
          numberOfShow += 1;
        }, 2500);
        updateBubbleMessageToLocalStorage($currentRoom);
      }
    } else if ($currentRoom === "hall" && !getAccessToken()) {
      bubbleSpeechContent.update(() => "opening.bubbleSpeeches.welcome");
    }
  }

  $: {
    if ($userData) {
      chineseCharsPattern.test($userData.firstName)
        ? (username = $userData.lastName + $userData.firstName)
        : (username = $userData.firstName + " " + $userData.lastName);
    }
  }

  const handleBackButton = () => {
    if (
      $selectedProductCategory !== "best_seller" &&
      $selectedProductCategory !== ""
    ) {
      $selectedProductCategory = "best_seller";
    } else {
      location.replace(`/${retailerName}?room=hall`);
    }
  };

  function openWelcomeModal() {
    $isExploreButtonShown = false;
    $isWelcomeModalShown = true;
  }

  onMount(() => {
    const appHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty("--app-height", `${window.innerHeight}px`);
      doc.style.setProperty("--app-width", `${window.innerWidth}px`);
    };

    window.addEventListener("resize", appHeight, false);
    appHeight();

    const urlParams = new URLSearchParams(location.search);
    const token = getAccessToken();

    if (urlParams.get("room") === "hall") {
      $isExploreButtonShown = true;
    }

    const roomAnalyticsId = getRoomAnalyticsId();
    const prevRoomName = getRoomName();

    if (roomAnalyticsId) {
      if (token) {
        sendAnalytics({
          type: getRoomAnalyticsType(prevRoomName),
          entryType: "end",
          id: roomAnalyticsId,
        })
          .then(() => console.log("track previous room:", prevRoomName))
          .catch((error) => console.error(error));
      } else if (urlParams.get("room") === "hall") {
        sendGuestAnalytics({
          type: GuestAnalyticsType.NONSTOP_HALL,
          entryType: "end",
          id: roomAnalyticsId,
          guestId: getGuestId(),
        })
          .then(() => console.log("track previous room:", prevRoomName))
          .catch((error) => console.error(error));
      }
    }

    setRoomName(urlParams.get("room"));

    if (token) {
      sendAnalytics({
        type: getRoomAnalyticsType(urlParams.get("room")),
        entryType: "start",
      })
        .then(({ data }) => {
          setRoomAnalyticsId(data.id);
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (urlParams.get("room") === "hall") {
      sendGuestAnalytics({
        type: GuestAnalyticsType.NONSTOP_HALL,
        entryType: "start",
        guestId: getGuestId(),
      })
        .then(({ data }) => {
          setRoomAnalyticsId(data.id);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    return () => {
      window.removeEventListener("resize", appHeight, false);

      const roomAnalyticsId = getRoomAnalyticsId();
      if (roomAnalyticsId) {
        if (getAccessToken()) {
          sendAnalytics({
            type: getRoomAnalyticsType(urlParams.get("room")),
            entryType: "end",
            id: roomAnalyticsId,
          })
            .then(() =>
              console.log("track current room:", urlParams.get("room"))
            )
            .catch((error) => console.error(error));
        } else if (urlParams.get("room") === "hall") {
          sendGuestAnalytics({
            type: GuestAnalyticsType.NONSTOP_HALL,
            entryType: "end",
            id: roomAnalyticsId,
            guestId: getGuestId(),
          })
            .then(() => console.log("track previous room:", prevRoomName))
            .catch((error) => console.error(error));
        }
      }
    };
  });
</script>

<Layout>
  {#if $currentRoom !== "entry"}
    <NavaGuide message="{$_($bubbleSpeechContent)}" />
  {/if}
  <Navbar
    backTitle="{$selectedProductCategory === 'best_seller' ||
    $selectedProductCategory === ''
      ? $_('backButton.nonstopHall')
      : $_('backButton.allCategory')}"
    onBackButtonClick="{handleBackButton}"
    showBackButton="{$currentRoom !== 'hall' && $currentRoom !== 'entry'}"
  />
  <Model3D />

  {#if $isShowTutorial}
    <Tutorial username="{username}" />
  {/if}
  <TaskMonthly />
  {#if $isExploreButtonShown && !getAccessToken()}
    <button class="button explore" on:click="{openWelcomeModal}">
      {$_("opening.exploreButton")}
    </button>
  {/if}
  <!-- <ChangeLocation /> -->
</Layout>

<style lang="scss">
  .explore.button {
    position: absolute;
    border-radius: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: transparent;
    color: white;
    width: 80%;
  }
</style>
