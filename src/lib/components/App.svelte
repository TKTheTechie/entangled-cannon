<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import { World } from '@threlte/rapier';

	import { KeyboardControls, wasdConfig } from 'svelte-kbc';
	import { Grid } from '@threlte/extras';
</script>

<KeyboardControls config={wasdConfig()}>
	<Canvas>
		<Grid
			cellSize={3}
			cellColor={'#cccccc'}
			cellThicknes={2}
			sectionSize={9}
			sectionColor={'#cccccc'}
			sectionThickness={1.0}
			infiniteGrid
			plane={'xz'}
			backgroundColor={'#000000'}
		>
			<World><Scene /></World>
		</Grid>
	</Canvas>
</KeyboardControls>
