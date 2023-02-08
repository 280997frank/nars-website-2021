<script lang="ts">
  import { fetchProfile } from "@/api/retailer";
  import { handleWebsocket } from "@/api/webSocket";
  import NavatarHead from "@/components/Atoms/NavatarHead.svelte";
  import NotificationModal from "@/components/Organisms/NotificationModal.svelte";
  import type { INotification } from "@/interfaces/notification";
  import { navatarFace } from "@/stores/navatar";
  import { userData } from "@/stores/profile";
  import { retailerName } from "@/stores/retailer";
  import { isShowTaskMonthly } from "@/stores/taskMonthly";
  import { isShowTutorial } from "@/stores/tutorial";
  import {
    isWelcomeModalShown,
    isExploreButtonShown,
  } from "@/stores/welcomeModal";
  import { getAccessToken } from "@/utils";
  import { replaceEnVersionWithHelvetica } from "@/utils/regexHelper";
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { navigate } from "svelte-routing";
  import { scale, ScaleParams } from "svelte/transition";
  import { setshowNotifIcon, getshowNotifIcon } from "@/utils";
  // import { showNotifIconStore } from "@/stores/notifications";

  export let message = $_("opening.bubbleSpeeches.welcome");
  // export let showNotifIcon = false;
  let showIconNotip = false;
  export let showNcoin = true;
  export let goToProfile = true;
  let showNotifIcon = getshowNotifIcon();

  let isNotifModalOpen = false;
  let isBubleOpen = true;
  let bubleScaleParams: ScaleParams;
  let ncoins = 0;
  let haveNewNotif = false;
  let placeholderNavatar = "";

  // const placeholderNavatar = "/images/nava-before-login.png";

  /* const handleNava = () => {
    if ($userData) {
      if ($userData.gender === "male") {
        navatar = "/images/nava-male.png";
      } else if ($userData.gender === "female") {
        navatar = "/images/nava-female.png";
      }
    }
  }; */
  $: {
    // console.log("$showNotifIconStore", $showNotifIconStore);
    if (showNotifIcon == "show") {
      showIconNotip = true;
    } else {
      showIconNotip = false;
    }
  }
  const getProfile = async () => {
    if ($userData === null) {
      $userData = await fetchProfile();
    }
    // handleNava();
    ncoins = $userData?.ncoins || 0;
  };

  function handleNotification(notification: INotification) {
    isBubleOpen = false;
    haveNewNotif = false;
    // showNotifIcon = false;
    setshowNotifIcon("not");
    // $showNotifIconStore = false;
    showIconNotip = false;
    setTimeout(() => {
      message = notification.content;
      isBubleOpen = true;
      haveNewNotif = true;
      showIconNotip = true;
      // $showNotifIconStore = true;
      // showNotifIcon = true;
      setshowNotifIcon("show");
    }, 1000);
  }

  const handleSocket = () => {
    const socket = handleWebsocket();
    // console.log("socket", socket);
    if (socket) {
      socket.on("connect", function () {
        console.log("Connected");
      });

      socket.on(`notification_${$userData.retailer.id}`, handleNotification);
    }
  };

  function openProfile() {
    if (goToProfile) {
      if (getAccessToken()) {
        navigate(`/${$retailerName}/profile`);
      } else {
        $isExploreButtonShown = false;
        $isWelcomeModalShown = true;
      }
    }
  }

  onMount(async () => {
    await getProfile();
    handleSocket();
  });

  $: {
    ncoins = $userData?.ncoins || 0;

    if ($userData?.gender === "male") {
      placeholderNavatar = "/images/placeholder-male-navatar.png";
    } else {
      placeholderNavatar = "/images/placeholder-female-navatar.png";
    }
  }
</script>

<section>
  <NotificationModal
    isOpen="{isNotifModalOpen}"
    onClose="{() => (isNotifModalOpen = false)}"
    isFetchNewNotif="{haveNewNotif}"
    showNotifOnNava="{(haveNotif) => {
      console.log('haveNotif', haveNotif);
      if (haveNotif) {
        showIconNotip = true;
        setshowNotifIcon('show');
        // $showNotifIconStore = true;
      } else {
        showIconNotip = false;
        setshowNotifIcon('not');
        // $showNotifIconStore = false;
      }
    }}"
  />
  {#if isBubleOpen && message !== "" && $isShowTaskMonthly === false}
    <div class="bubble" transition:scale="{bubleScaleParams}">
      <img src="/images/bubble-guide.png" alt="" width="235" height="80" />
      <div class="bubble-content">
        <div>
          {@html replaceEnVersionWithHelvetica(message)}
        </div>
      </div>
    </div>
  {/if}

  <!-- special request to hide notification icon when tutorial modal is shown -->
  {#if showIconNotip && $isShowTutorial === false}
    <img
      class="nars-notif"
      src="/images/icon-exclamation.svg"
      alt=""
      on:click="{() => (isNotifModalOpen = true)}"
    />
  {/if}
  <div class="{$isShowTaskMonthly ? 'navatar-hide' : 'navatar'}">
    {#if $navatarFace}
      <NavatarHead
        width="{100}"
        height="{100}"
        onNavatarClick="{openProfile}"
      />
    {:else}
      <img
        class="avatar"
        src="{placeholderNavatar}"
        alt=""
        on:click="{openProfile}"
      />
    {/if}
    {#if showNcoin}
      <div class="ncoins">
        <img
          class="ncoins-icon"
          src="/images/ncoins.svg"
          alt=""
          width="20"
          height="20"
        />
        <p class="helvetica-neue-light">{ncoins}</p>
      </div>
    {/if}
  </div>
</section>

<style lang="scss">
  .bubble {
    position: absolute;
    bottom: 3%;
    right: 7rem;

    .bubble-content {
      position: absolute;
      width: 100%;
      font-weight: 100;
      top: 45%;
      left: 46%;
      transform: translate(-50%, -50%);
      width: 180px;
      font-size: 12.5px;
      height: 48px;
      overflow-y: auto;
      scrollbar-width: thin;

      &::-webkit-scrollbar {
        width: 0.5rem;
      }

      &::-webkit-scrollbar-thumb {
        background-color: grey;
      }
    }
  }

  .nars-notif {
    position: absolute;
    bottom: 14%;
    right: 18px;
    z-index: 1;
  }

  .nars-notif:hover {
    cursor: pointer;
  }

  .navatar {
    position: absolute;
    bottom: 3%;
    right: 1rem;

    .avatar {
      margin-bottom: -8px;
      cursor: pointer;
      width: 5rem;
    }
  }

  .navatar-hide {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    z-index: -10;
  }

  .navatar:hover {
    cursor: pointer;
  }

  .ncoins {
    display: flex;
    gap: 8px;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    p {
      color: #fff;
    }
  }
</style>
