<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Text } from '@threlte/extras';
	import { onMount } from 'svelte';
	import type { Group } from 'three';

	let pointsGroup: Group;

	export let points;

	const { start, stop } = useTask((delta) => {
		pointsGroup.position.y += 0.01;
		if (pointsGroup.position.y > 0.5) {
			pointsGroup.removeFromParent();
			stop();
		}
	});

	onMount(() => {
		start();
	});
</script>

<T.Group name="ScoreUpdate" bind:ref={pointsGroup}>
	<Text
		color="red"
		fontSize={0.1}
		text={'+' + points}
		position={[-0.5, 2, -1]}
		rotation={[0.25, -Math.PI, 0]}
	/>
</T.Group>
