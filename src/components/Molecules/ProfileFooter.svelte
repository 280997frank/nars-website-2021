<script lang="ts">
  import { footerHeight } from "@/stores/profile";
  import { retailerName } from "@/stores/retailer";
  import { _ } from "svelte-i18n";
  import { link as svelteLink } from "svelte-routing";
  let pathname = window.location.pathname.split("/");

  interface ILink {
    url: string;
    path: string;
    icon: string;
    label: string;
  }

  let height: number;
  const links: ILink[] = [
    {
      url: "/profile/nwallet",
      path: "nwallet",
      icon: "/images/nwallet.svg",
      label: $_("profile.nwallet"),
    },
    {
      url: "/profile/navatar",
      path: "navatar",
      icon: "/images/navatar.svg",
      label: $_("profile.navatar"),
    },
    {
      url: "/profile/wishlist",
      path: "wishlist",
      icon: "/images/wishlist.svg",
      label: $_("profile.wishlist"),
    },
    {
      url: "/profile/settings",
      path: "settings",
      icon: "/images/settings.svg",
      label: $_("profile.settings"),
    },
  ];

  $: {
    if (height) {
      $footerHeight = height;
    }
  }
</script>

<footer class="profile-footer" bind:clientHeight="{height}">
  <div class="field is-grouped mb-0">
    {#each links as link (link.url)}
      <div class="control" class:is-active="{pathname[3] === link.path}">
        <a class="button" href="/{$retailerName}{link.url}" use:svelteLink>
          <img src="{link.icon}" alt="" width="32" height="32" />
          <span>{@html link.label}</span>
          <div class="bullet has-text-centered">
            <div class="border"></div>
          </div>
        </a>
      </div>
    {/each}
  </div>
</footer>

<style lang="scss">
  .profile-footer {
    width: 100%;
    background-color: black;
    padding: 0 1rem 0.75rem;
    position: absolute;
    bottom: 0;
  }

  .field.is-grouped {
    justify-content: space-between;
  }
  .control {
    &.is-active {
      .button {
        .bullet {
          padding-top: 5px;
          width: 4px;
          height: 4px;
          border-radius: 100%;
          background-color: #e6001e;
        }
      }
    }
  }
  .button {
    background-color: transparent;
    border: none;
    flex-direction: column;
    padding: 0.5rem;
    height: auto;
    text-decoration: none !important;
    img {
      height: 2rem;
      width: auto;
    }

    span:not(.icon) {
      color: white;
      font-weight: 300;
      font-size: 0.5625rem;
      letter-spacing: 1px;
    }
  }
</style>
