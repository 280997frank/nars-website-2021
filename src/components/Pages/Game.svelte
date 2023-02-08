<script lang="ts">
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { navigate } from "svelte-routing";

  import Layout from "@/components/Templates/Layout.svelte";
  import Navbar from "@/components/Molecules/Navbar.svelte";
  import TutorialNavbar from "@/components/Molecules/TutorialNavbar.svelte";
  import Game from "@/components/Atoms/Game.svelte";

  import { getAccessToken, getUsername, goToRoom } from "@/utils";

  // import { currentRoom } from "@/stores/room";
  import { gameInstance } from "@/stores/game";
  import { retailerName as retailerNameStore } from "@/stores/retailer";
  import { isFromGamePage } from "@/stores/room";

  import { sendAnalytics } from "@/api/analytics";

  import { AnalyticsType } from "@/interfaces/analytics";

  export let retailerName: string;

  $retailerNameStore = retailerName;

  let activeNavbar = "default";
  let analyticsId = "";

  window.receiveMessageFromUnity = async (msg: string) => {
    switch (msg) {
      case "IsLoaded":
        activeNavbar = "tutorial";

        $gameInstance.SendMessage(
          "[Bridge]",
          "ReceiveMessageFromPage",
          JSON.stringify({
            Type: "user",
            Username: getUsername(),
            Token: getAccessToken(),
            Api: process.env.VITE_BACKEND_URL || "",
          })
        );

        try {
          const result = await sendAnalytics({
            type: AnalyticsType.GR_START,
            entryType: "start",
          });

          analyticsId = result.data.id;
        } catch (error) {
          console.error(error);
        }

        window.gtag("event", "click", {
          event_category: "alwayson_button_play_game",
          event_label: "start_playing_game",
        });
        break;
      case "removeSkip":
        activeNavbar = "";
        break;
      case "gameOver":
        try {
          await sendAnalytics({
            type: AnalyticsType.GR_START,
            entryType: "end",
            id: analyticsId,
          });
        } catch (error) {
          console.error(error);
        }
        break;
      case "shopNow":
        try {
          await sendAnalytics({
            type: AnalyticsType.GR_SHOP_NOW,
            entryType: "start",
          });
        } catch (error) {
          console.error(error);
        }
        $isFromGamePage = true;
        navigate(
          `/${retailerName}/product/df2ca41e-e86e-45c0-89da-ba92e5ed84ea`
        );
        break;
      case "playAgain":
        try {
          await sendAnalytics({
            type: AnalyticsType.GR_PLAY_AGAIN,
            entryType: "start",
          });
        } catch (error) {
          console.error(error);
        }
        break;
      case "backToNonStopHall":
        // navigate(`/${retailerName}`);
        goToRoom();
        break;
    }
  };

  onMount(() => {
    sendAnalytics({
      type: AnalyticsType.GR_OPEN,
      entryType: "start",
    })
      .then(() => {
        console.log("Track game open");
      })
      .catch((error) => console.error(error));
  });
</script>

<Layout isPrivate>
  {#if activeNavbar === "default"}
    <Navbar
      backTitle="{$_('backButton.nonstopPlay')}"
      onBackButtonClick="{() => goToRoom('play')}"
    />
  {/if}
  {#if activeNavbar === "tutorial"}
    <TutorialNavbar onSkip="{() => (activeNavbar = '')}" />
  {/if}
  {#if !activeNavbar}
    <div class="top-padding"></div>
  {/if}
  <Game />
</Layout>

<style>
  .top-padding {
    width: 100%;
    height: 1rem;
  }
</style>
