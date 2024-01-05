<script lang="ts">
	import { BoxGeometry } from 'three';
	import Floor from './Floor.svelte';
	import Wall from './Wall.svelte';
	import { BOARD_DIMENSIONS, PLAYER_ROTATION } from '$lib/store/game-config';
	import Ball from './Ball.svelte';
	import { T } from '@threlte/core';
	import { useKeyboardControls } from 'svelte-kbc';
	import Level1 from './Level1.svelte';
	import { AutoColliders, RigidBody } from '@threlte/rapier';
	import { GLTF, useGltf } from '@threlte/extras';

	const { w, a, s, d, space } = useKeyboardControls();
	const gltf = useGltf('models/level1.glb');

	let box = new BoxGeometry(1, 1, 1);

	let rotation_z = 0.0,
		rotation_x = 0.0,
		rotation_y = 0.0;

	$: {
		if ($w) {
			$PLAYER_ROTATION.z += 0.01;
		}
		if ($s) {
			$PLAYER_ROTATION.z -= 0.01;
		}
	}
</script>

<!-- 
{#if $gltf}
	<RigidBody type="fixed">
		<AutoColliders shape={'convexHull'}>
			<T is={$gltf.nodes['Cube']} />
		</AutoColliders>
	</RigidBody>
{/if} -->

<Level1 />
<Ball />
