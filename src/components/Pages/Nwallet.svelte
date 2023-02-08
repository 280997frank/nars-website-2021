<script lang="ts">
  import CoinIcon from "@/components/Atoms/Icons/CoinHistoryIcon.svelte";
  import CouponIcon from "@/components/Atoms/Icons/CouponIcon.svelte";
  import TaskIcon from "@/components/Atoms/Icons/TaskIcon.svelte";
  import WalletProfile from "@/components/Atoms/WalletProfile.svelte";
  import CouponList from "@/components/Molecules/CouponList.svelte";
  import Navbar from "@/components/Molecules/Navbar.svelte";
  import ProfileFooter from "@/components/Molecules/ProfileFooter.svelte";
  import RedeemCoupon from "@/components/Molecules/RedeemCoupon.svelte";
  import TaskList from "@/components/Molecules/TaskListsContainer.svelte";
  import CouponUse from "@/components/Molecules/UseCoupon.svelte";
  import Layout from "@/components/Templates/Layout.svelte";
  import { retailerName as retailerNameStore } from "@/stores/retailer";
  import { getAccessToken } from "@/utils";
  import { _ } from "svelte-i18n";
  import { navigate } from "svelte-routing";

  export let tabActive = 1;
  export let subTabCoupon = 1;
  export let retailerName: string;

  const setActiveTab = (tab: number) => (tabActive = tab);
  const setSubActiveTab = (tab: number) => (subTabCoupon = tab);
  const setPageType = (type: string) => (pageType = type);
  const setRedemData = (data: object) => (redemData = data);

  let pageType = "detail";
  let redemData = {};

  $retailerNameStore = retailerName;
  let containerContent: HTMLDivElement;
  $: {
    if (containerContent) {
      containerContent.style.height = `${window.innerHeight - 130}px`;
    }
  }
</script>

<Layout>
  {#if pageType === "detail"}
    <Navbar
      onBackButtonClick="{() => navigate(`/${retailerName}/profile`)}"
      backTitle="{$_('backButton.profile')}"
    />
    <div
      bind:this="{containerContent}"
      class="column content-posts is-gapless card is-flex is-flex-direction-column"
      id="contentPosts"
    >
      <WalletProfile />
      <div class="tab-selector">
        <div on:click="{() => setActiveTab(1)}" class="svg-wrapper">
          <CouponIcon
            width="{25}"
            height="{20}"
            fill="{tabActive === 1 ? `#fff` : `#4d4d4d`}"
          />
        </div>
        <div on:click="{() => setActiveTab(2)}" class="svg-wrapper">
          <TaskIcon
            width="{20}"
            height="{20}"
            fill="{tabActive === 2 ? `#fff` : `#4d4d4d`}"
          />
        </div>
        <div on:click="{() => setActiveTab(3)}" class="svg-wrapper">
          <CoinIcon
            width="{20}"
            height="{20}"
            fill="{tabActive === 3 ? `#fff` : `#4d4d4d`}"
          />
        </div>
      </div>
      {#if tabActive === 1}
        <div class="tab-selector-coupon">
          <div
            on:click="{() => setSubActiveTab(1)}"
            class="{`ready-coupon ${subTabCoupon === 1 ? 'white' : 'gray'}`}"
          >
            {$_("nwallet.availableCoupons")}
          </div>
          <!--          <div class="vertical"></div>-->
          <div
            on:click="{() => setSubActiveTab(2)}"
            class="{`history-coupon ${subTabCoupon === 2 ? 'white' : 'gray'}`}"
          >
            {$_("nwallet.history")}
          </div>
        </div>
      {/if}
      {#if tabActive === 1 && subTabCoupon === 1}
        <CouponList
          setRedemData="{setRedemData}"
          setPageType="{setPageType}"
          title="{$_('nwallet.availability')}"
          type="available"
        />
      {/if}
      {#if tabActive === 1 && subTabCoupon === 2}
        <CouponList
          setRedemData="{setRedemData}"
          setPageType="{setPageType}"
          title="{$_('nwallet.redemptionHistory')}"
          type="history"
        />
      {/if}
      {#if tabActive === 2}
        <TaskList title="{$_('tasks.task')}" />
      {/if}
      {#if tabActive === 3}
        <TaskList title="{$_('nwallet.history')}" />
      {/if}
    </div>
    {#if getAccessToken()}
      <ProfileFooter />
    {/if}
  {/if}
  {#if pageType === "redeem"}
    <RedeemCoupon setPageType="{setPageType}" data="{redemData}" />
  {/if}
  {#if pageType === "use"}
    <CouponUse
      setRedemData="{setRedemData}"
      setPageType="{setPageType}"
      data="{redemData}"
    />
  {/if}
</Layout>

<style lang="scss">
  @import "../../styles/typography";
  .content-posts {
    padding: 0%;
    background-color: black;
    // height: calc(100vh - 130px);
  }
  .tab-selector {
    display: flex;
    justify-content: space-around;
    height: 50px;
    margin: 1rem 0;
  }
  .svg-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .tab-selector-coupon {
    width: 100%;
    height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: relative;
    margin-bottom: 1rem;
  }
  .vertical {
    border-left: 1px solid #4d4d4d;
    height: 100%;
    position: absolute;
    left: 60%;
  }
  .ready-coupon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52%;
    border-right: 1px #4d4d4d solid;
  }
  .history-coupon {
    display: flex;
    align-items: center;
    justify-content: start;
    width: 29%;
  }
  .white {
    @include typography;
    color: #fff;
    font-weight: 250;
    cursor: pointer;
  }
  .gray {
    @include typography;
    font-weight: 250;
    color: #4d4d4d;
    cursor: pointer;
  }
</style>
