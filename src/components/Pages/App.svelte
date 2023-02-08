<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import { QueryClient, QueryClientProvider } from "@sveltestack/svelte-query";
  import { ToastContainer, FlatToast } from "svelte-toasts";
  import { isLoading } from "svelte-i18n";

  import NonStopCommunity from "@/components/Pages/NonStopCommunity.svelte";
  import Posts from "@/components/Pages/Posts.svelte";
  import NonStopHall from "@/components/Pages/NonStopHall.svelte";
  import Game from "@/components/Pages/Game.svelte";
  import Profile from "@/components/Pages/Profile.svelte";
  import Wishlist from "@/components/Pages/profile/Wishlist.svelte";
  import Help from "@/components/Pages/Help.svelte";
  import ProfileInformation from "@/components/Pages/profile/ProfileInformation.svelte";
  import Settings from "@/components/Pages/Settings.svelte";
  import Term from "@/components/Pages/Term.svelte";
  import NavatarDesign from "@/components/Pages/profile/NavatarDesign.svelte";
  import NavatarDesignResult from "@/components/Pages/profile/NavatarDesignResult.svelte";
  import ProductDetail from "@/components/Pages/product/Detail.svelte";
  import Wallet from "@/components/Pages/Nwallet.svelte";
  import Qrcode from "@/components/Pages/Qrcode.svelte";
  import PrivacyPolicy from "@/components/Pages/PrivacyPolicy.svelte";
  import SinglePost from "@/components/Pages/SinglePost.svelte";

  import "bulma/css/bulma.min.css";
  import "@/styles/global.css";

  export let url = "";

  const queryClient = new QueryClient();
</script>

{#if $isLoading}
  <h1>加载中...</h1>
{:else}
  <Router url="{url}">
    <QueryClientProvider client="{queryClient}">
      <Route path="/" component="{NonStopHall}" />
      <Route path="/:retailerName" component="{NonStopHall}" />
      <Route
        path="/:retailerName/nonstop-community"
        component="{NonStopCommunity}"
      />
      <Route path="/:retailerName/posts/:postId" component="{SinglePost}" />
      <Route path="/:retailerName/posts" component="{Posts}" />
      <Route path="/:retailerName/game" component="{Game}" />
      <Route path="/:retailerName/profile/settings" component="{Settings}" />
      <Route
        path="/:retailerName/profile/information"
        component="{ProfileInformation}"
      />
      <Route
        path="/:retailerName/profile/navatar"
        component="{NavatarDesign}"
      />
      <Route
        path="/:retailerName/profile/navatar-result"
        component="{NavatarDesignResult}"
      />
      <Route path="/:retailerName/help" component="{Help}" />
      <Route path="/:retailerName/terms-and-conditions" component="{Term}" />
      <Route path="/:retailerName/product/:id" component="{ProductDetail}" />
      <Route path="/:retailerName/qrcode" component="{Qrcode}" />
      <Route path="/:retailerName/profile/nwallet" component="{Wallet}" />
      <Route path="/:retailerName/profile" component="{Profile}" />
      <Route path="/:retailerName/profile/wishlist" component="{Wishlist}" />
      <Route path="/:retailerName/privacy-policy" component="{PrivacyPolicy}" />
    </QueryClientProvider>
  </Router>
  <ToastContainer placement="bottom-center" let:data>
    <FlatToast data="{data}" />
    <!-- Provider template for your toasts -->
  </ToastContainer>
{/if}
