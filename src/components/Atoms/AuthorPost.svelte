<script lang="ts">
  import { _ } from "svelte-i18n";
  import dayjs from "dayjs";
  import { replaceEnVersionWithHelvetica } from "@/utils/regexHelper";
  export let nameAuthor = "";
  export let authorImage = "";
  export let timeAuthor = "2021-09-18 21:00";
  export let authorLayout = "";
  export let type = "";

  type EventError = Event & {
    currentTarget: EventTarget & HTMLImageElement;
  };

  let fallback = "https://via.placeholder.com/200x200?text=Image+is+Error.";
  let whitespace = "";
  const handleError = (ev: EventError) => (ev.currentTarget.src = fallback);
  const locale = localStorage.getItem("locale");

  if (locale !== "zh-CN") {
    whitespace = " ";
  }
</script>

<div class="media">
  <figure class="media-left">
    <p class="image is-48x48">
      <img
        class="is-rounded"
        src="{authorImage}"
        alt="profil_image"
        on:error="{handleError}"
      />
    </p>
  </figure>
  <div class="media-content">
    <div class="content">
      <p class="author">
        <strong>{@html replaceEnVersionWithHelvetica(nameAuthor)}</strong>
        <span class="helvetica-neue">
          {dayjs(timeAuthor, "YYYY-MM-DD").format("YYYY/MM/DD")}

          {#if type === "by-the-community"}
            <span>
              {$_("community.from")}{whitespace}{authorLayout}
            </span>
          {/if}
        </span>
      </p>
    </div>
  </div>
</div>

<style lang="scss">
  p {
    color: white;
    display: flex;
    flex-direction: column;
  }
  span {
    font-size: 10px !important;
    color: #ffffff;
    line-height: 12px;
    font-weight: lighter;
  }
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
  strong {
    line-height: 24px;
    color: white;
    text-transform: uppercase;
    font-size: 16px;
    font-weight: normal;
  }
  .media {
    padding: 10px;
    padding-bottom: 0%;
  }
  .media-content {
    margin-top: auto;
    margin-bottom: auto;
  }
</style>
