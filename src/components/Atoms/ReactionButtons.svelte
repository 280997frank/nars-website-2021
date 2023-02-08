<script lang="ts">
  import { postReaction, postRemoveReaction, TPostReaction } from "@/api/post";
  import { completeTask, EAvailableTasks } from "@/api/tasks";
  // import { toasts } from "svelte-toasts";
  import { isWelcomeModalShown } from "@/stores/welcomeModal";
  import { getAccessToken } from "@/utils";
  import { useMutation } from "@sveltestack/svelte-query";

  let LikeFalse = "/icons/LikeIconFalse.png";
  let LikeTrue = "/icons/LikeIconTrue.png";
  let ClapFalse = "/icons/clapIconFalse.png";
  let ClapTrue = "/icons/clapIconTrue.png";
  let LoveFalse = "/icons/loveIconFalse.png";
  let LoveTrue = "/icons/loveIconTrue.png";

  export let id = "";
  export let isLike = false;
  export let totalLike = 0;
  export let isLove = false;
  export let totalLove = 0;
  export let isClap = false;
  export let totalClap = 0;
  // let isType = "";

  const mutationPostReaction = useMutation(postReaction, {
    onSuccess(_, variables) {
      // console.log("Success");
      switch (variables.type) {
        case "like":
          totalLike += 1;
          isLike = true;
          break;

        case "love":
          totalLove += 1;
          isLove = true;
          break;

        case "clap":
          totalClap += 1;
          isClap = true;
          break;

        default:
          break;
      }
    },
    onError(error: Error) {
      // console.log("Error", error.message);
      console.error("Error", error.message);
    },
  });

  const mutationPostRemoveReaction = useMutation(postRemoveReaction, {
    onSuccess(_, variables) {
      // console.log("Success");
      switch (variables.type) {
        case "like":
          totalLike -= 1;
          isLike = false;
          break;

        case "love":
          totalLove -= 1;
          isLove = false;
          break;

        case "clap":
          totalClap -= 1;
          isClap = false;
          break;

        default:
          break;
      }
    },
    onError(error: Error) {
      // console.log("Error", error.message);
      console.error("Error", error.message);
    },
  });

  const handlePostreaction = async (type: TPostReaction, postId: string) => {
    // console.log(type, postId);
    // alert("hello");
    try {
      $mutationPostReaction.mutate({
        postId,
        type,
      });
    } catch (err) {
      console.log("error", err);
    }
  };

  const handlePostRemovereaction = async (
    type: TPostReaction,
    postId: string
  ) => {
    // alert("hello");
    try {
      $mutationPostRemoveReaction.mutate({
        postId,
        type,
      });
    } catch (err) {
      console.log("error", err);
    }
    console.log(type, postId);
  };

  const onReactionClick = (reactionType: TPostReaction) => {
    let hasBeenReactedTo: boolean;

    switch (reactionType) {
      case TPostReaction.clap:
        hasBeenReactedTo = isClap;
        break;
      case TPostReaction.like:
        hasBeenReactedTo = isLike;
        break;
      case TPostReaction.love:
        hasBeenReactedTo = isLove;
        break;
    }

    if (getAccessToken()) {
      hasBeenReactedTo
        ? handlePostRemovereaction(reactionType, id)
        : handlePostreaction(reactionType, id);
    } else {
      const container = document.getElementById("parent-container");
      container.scrollTop = 0;
      $isWelcomeModalShown = true;
    }
  };

  $: {
    if ($mutationPostReaction.isSuccess) {
      completeTask(EAvailableTasks.ReactToAPost)
        .then(() => {
          console.log("NCOINS earned from reacting to a post");
        })
        .catch((error) => {
          console.error(error, error.stack);
        });

      completeTask(EAvailableTasks.ReactToAPostOneTime)
        .then(() => {
          console.log("NCOINS earned from reacting to a post");
        })
        .catch((error) => {
          console.error(error, error.stack);
        });

      window.gtag("event", "click", {
        event_category: "onboarding_button_engagement",
        event_label: "react_to_a_post_or_product",
      });
    }
  }
</script>

<div class="expression-content columns is-mobile">
  <div class="column is-one-third icon-column">
    <button
      class="button btn-React"
      class:is-loading="{$mutationPostRemoveReaction.isLoading ||
        $mutationPostReaction.isLoading}"
      on:click="{() => {
        onReactionClick(TPostReaction.like);
      }}"
    >
      <img
        class="img-icon"
        src="{isLike ? LikeTrue : LikeFalse}"
        alt="Like Icon"
      />
    </button>
    <p class="helvetica-neue-light">{totalLike}</p>
  </div>
  <div class="column is-one-third icon-column-Like">
    <button
      class="button btn-React"
      class:is-loading="{$mutationPostRemoveReaction.isLoading ||
        $mutationPostReaction.isLoading}"
      on:click="{() => {
        onReactionClick(TPostReaction.love);
      }}"
    >
      <img
        class="img-icon"
        src="{isLove ? LoveTrue : LoveFalse}"
        alt="love Icon"
      />
    </button>
    <p class="helvetica-neue-light">{" "}{totalLove}</p>
  </div>
  <div class="column is-one-third icon-column">
    <button
      class="button btn-React"
      class:is-loading="{$mutationPostRemoveReaction.isLoading ||
        $mutationPostReaction.isLoading}"
      on:click="{() => {
        onReactionClick(TPostReaction.clap);
      }}"
    >
      <img
        class="img-icon"
        src="{isClap ? ClapTrue : ClapFalse}"
        alt="Like Icon"
      />
    </button>
    <p class="helvetica-neue-light">{" "}{totalClap}</p>
  </div>
</div>

<style lang="scss">
  .btn-React {
    background: transparent;
    padding: 0% !important;
    outline: none;
    border: none;
  }
  .expression-content {
    padding: 10px;
    margin-top: 10px;
  }
  .icon-column {
    color: white;
    padding: 0%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .icon-column-Like {
    color: white;
    text-align: center;
    border-left: white 1px solid;
    border-right: white 1px solid;
    padding: 0%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .img-icon {
    vertical-align: middle;
    cursor: pointer;
    width: 25px;
    margin-bottom: 5px;
  }
</style>
