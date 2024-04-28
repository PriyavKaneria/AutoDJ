<script>
    import AudioTrack from '$lib/components/AudioTrack.svelte';
  
    let tracks = [
      { name: 'Track 1', id: 1 },
    ];
  
    function addTrack() {
      tracks = [...tracks, { name: `Track ${tracks.length + 1}`, id: tracks.length + 1}];
    }
  </script>
  
  <main>
    <div class="toolbar">
      <!-- Toolbar elements -->
      <button on:click={addTrack}>Add Track</button>
    </div>
  
    <div class="tracks">
      {#each tracks as track, index}
        <AudioTrack {track} index={index} />
      {/each}
    </div>
  </main>
  
  <style>
    /* Styles for the main layout */
  </style>