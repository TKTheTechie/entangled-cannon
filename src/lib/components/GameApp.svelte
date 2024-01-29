<script lang="ts">
	import { Canvas, extend, T } from '@threlte/core';
	import Scene from './GameScene.svelte';
	import { World } from '@threlte/rapier';
	import { GridHelper } from 'three';
	import { Sky } from '@threlte/extras';
	import { v4 as uuidv4 } from 'uuid';
	import { onMount } from 'svelte';
	import { GAME_SESSION_ID } from '$lib/store/game-config';
	extend({ GridHelper });

	onMount(() => {
		GAME_SESSION_ID.set(uuidv4());
	});
</script>

<!-- <KeyboardControls config={wasdConfig()}> -->
<Canvas>
	<Sky
		turbidity={10}
		rayleigh={3}
		azimuth={0}
		elevation={0}
		mieCoefficient={0.005}
		mieDirectionalG={0.7}
	/>
	<!-- <Grid
			cellSize={1}
			cellColor={'green'}
			cellThicknes={1}
			sectionSize={1}
			sectionColor={'green'}
			sectionThickness={1.0}
			infiniteGrid
			plane={'xz'}
			backgroundColor={'#000000'}
		>
			<World><Scene /></World>
		</Grid> -->
	<T.GridHelper args={[100, 100, 0x00c895, 0x00c895]} />

	<World><Scene /></World>
</Canvas>

<!-- </KeyboardControls> -->
