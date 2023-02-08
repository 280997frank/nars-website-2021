<script lang="ts">
  import IoIosClose from "svelte-icons/io/IoIosClose.svelte";
  import MediaQuery from "./MediaQuery.svelte";

  export let isOpen = false;
  export let onClose = () => null;
  export let imgUrl;

  type EventError = Event & {
    currentTarget: EventTarget & HTMLImageElement;
  };

  let fallback = "https://via.placeholder.com/200x200?text=Image+is+Error.";
  const handleError = (ev: EventError) => (ev.currentTarget.src = fallback);
</script>

{#if isOpen}
  <div class="overlay">
    <MediaQuery query="(max-width: 480px)" let:matches>
      <div class="modal {matches ? '' : 'mt-desk'}">
        <div class="is-flex is-flex-direction-row	is-justify-content-flex-end	">
          <button on:click="{onClose}">
            <span class="icon">
              <IoIosClose />
            </span>
          </button>
        </div>
        <main class="main">
          <section class="content">
            <div class="imagePost-modal">
              <figure class="image">
                <img
                  class="has-ratio"
                  src="{imgUrl}"
                  alt=""
                  on:error="{handleError}"
                />
              </figure>
            </div>
          </section>
        </main>
      </div>
    </MediaQuery>
  </div>
{/if}

<style lang="scss">
  @use "../../styles/typography" as t;

  .overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 500;
    background: rgba(0, 0, 0, 0.9);
    // opacity: 0.5;
    display: grid;
    align-items: center;
    justify-items: center;
  }

  .modal {
    // padding: 1em;
    position: relative;
    border-radius: 5px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
    display: block;

    button {
      cursor: pointer;
      background-color: transparent;
      border: none;
      padding: 0px !important;
    }

    .icon {
      color: white;
      width: 35px;
      height: 35px;
      padding: 0px;
      align-self: flex-end;
    }

    .main {
      background: transparent;
      border: none;
      // padding: 16px;
      width: 95vw;
      @media (min-width: 53vh) {
        width: 49.7vh;
      }
    }
  }

  .mt-desk {
    top: -20px;
  }
  .image {
    margin: 0px !important;
    height: 100%;
    img {
      height: 100%;
      width: 100%;
    }
  }
  .imagePost-modal {
    min-height: 10vh;
    height: auto;
    max-height: 70vh;
    overflow-y: auto;
  }
</style>
