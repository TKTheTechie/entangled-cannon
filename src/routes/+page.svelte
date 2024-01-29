<script lang="ts">
	import App from '$lib/components/GameApp.svelte';
</script>

<div>
	<App />
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

	:global(body) {
		margin: 0;
		font-family: VT323;
	}

	div {
		width: 100vw;
		height: 100vh;
		background: rgb(13, 19, 32);
		background: linear-gradient(180deg, rgba(13, 19, 32, 1) 0%, rgba(8, 12, 21, 1) 100%);
	}
</style>
