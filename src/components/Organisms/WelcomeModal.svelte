<script lang="ts">
  import { _ } from "svelte-i18n";

  import Button from "@/components/Atoms/Button.svelte";
  import LoginForm from "@/components/Organisms/LoginForm.svelte";
  import SignupForm from "@/components/Organisms/SignupForm.svelte";

  import { isMiniProgram } from "@/stores/miniProgram";
  import { retailerName } from "@/stores/retailer";

  import {
    isLoginFormShown,
    isSignupFormShown,
    isWelcomeModalShown,
    isExploreButtonShown,
  } from "@/stores/welcomeModal";

  type AuthState = "LOGIN" | "SIGNUP";

  function openWeChatAuthenticationPage(authType: AuthState) {
    const encodedUrl = encodeURIComponent(
      `${process.env.VITE_WEBSITE_URL}/${$retailerName}`
    );

    open(
      `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${process.env.VITE_WECHAT_APP_ID}&redirect_uri=${encodedUrl}&response_type=code&scope=snsapi_userinfo&state=${authType}#wechat_redirect`,
      "_self"
    );
  }

  function showLoginForm() {
    // isSignupFormShown.update(() => false);
    // isLoginFormShown.update(() => true);
    $isSignupFormShown = false;
    $isLoginFormShown = true;
  }

  function showSignupForm() {
    if ($isMiniProgram) {
      openWeChatAuthenticationPage("SIGNUP");
    } else {
      // isLoginFormShown.update(() => false);
      // isSignupFormShown.update(() => true);
      $isLoginFormShown = false;
      $isSignupFormShown = true;
    }
  }

  function toggleWelcomeModal() {
    $isSignupFormShown = false;
    $isLoginFormShown = false;
    $isExploreButtonShown = !$isExploreButtonShown;
    $isWelcomeModalShown = !$isWelcomeModalShown;
  }
</script>

<div
  class="welcome-modal"
  class:is-hidden="{!$isWelcomeModalShown}"
  class:is-bg-black="{$isSignupFormShown}"
>
  {#if $isSignupFormShown}
    <SignupForm toggleWelcomeModal="{toggleWelcomeModal}" />
  {:else}
    <div class="has-text-right">
      <Button onClick="{toggleWelcomeModal}" className="is-text">
        {$_("welcomeModal.guest")}
      </Button>
    </div>
    <div class="middle-part has-text-centered">
      {#if $isLoginFormShown}
        <LoginForm />
      {:else}
        <h1 class="title">{@html $_("welcomeModal.title")}</h1>
        <p>
          {@html $_("welcomeModal.body")}
        </p>
        <p class="registration-benefit">
          {@html $_("welcomeModal.registrationBenefit")}
        </p>
        {#if $isMiniProgram}
          <div class="button-container">
            <Button onClick="{() => openWeChatAuthenticationPage('LOGIN')}">
              {$_("welcomeModal.wechatLogin")}
            </Button>
          </div>
          <div class="button-container mt-5">
            <Button onClick="{showLoginForm}">
              {$_("welcomeModal.mobileLogin")}
            </Button>
          </div>
        {:else}
          <div class="button-container">
            <Button onClick="{showLoginForm}">{$_("loginForm.login")}</Button>
          </div>
        {/if}
      {/if}
      <div class="mt-7 has-text-centered">
        <p>{$_("welcomeModal.newToNARS")}</p>
        <Button onClick="{showSignupForm}" className="is-text">
          {$_("welcomeModal.createAccount")}
        </Button>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @import "../../styles/typography";
  .welcome-modal {
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    padding: 1rem;
    overflow-y: auto;
    z-index: 99;
    cursor: auto;
    // font-family: "Helvetica Neue LT Std", sans-serif;

    &.is-bg-black {
      background-color: black;
    }
  }

  .title {
    @include typography;
    font-size: 40px;
    line-height: 3rem;
    // font-family: "Helvetica Neue LT Std", sans-serif;
  }

  .middle-part {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% - 2rem);
    & > p {
      margin-bottom: 4rem;
      // font-family: "Helvetica Neue LT Std", sans-serif;
      &.registration-benefit {
        margin-bottom: 1.5rem;
      }
    }
  }

  p {
    @include paragraph;
  }

  .button-container {
    width: calc(100% - 3rem);
    margin: auto;
    // .button-font {
    //   font-family: "Helvetica Neue LT Std", sans-serif;
    // }
  }

  .mt-7 {
    margin-top: 4.5rem;
    // p{
    //   font-family: "Helvetica Neue LT Std", sans-serif;
    // }
  }
</style>
