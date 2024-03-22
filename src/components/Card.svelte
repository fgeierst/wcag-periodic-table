<script lang="ts">
  export let criterion;
  export let backgroundColor: string = "#f0f0f0";
</script>

<div class="card" style:background-color={backgroundColor}>
  <div class="ref-id">{criterion.ref_id}</div>
  <h3>
    <a href={criterion.url} target="_blank">
      {criterion.title}
    </a>
  </h3>
  <!-- <div>{criterion.level}</div> -->
</div>

<style>
  .card {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    aspect-ratio: 1;
    overflow: hidden;
  }

  h3 {
    margin: 0;
    font-weight: normal;
    font-size: inherit;
  }

  a {
    text-decoration: none;
    color: inherit;

    &:hover {
      text-decoration: underline;
    }
  }

  .ref-id {
    font-size: 0.8rem;
    margin-block-end: 0.3rem;
  }
</style>
