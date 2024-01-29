<script lang="ts">
	import CannonModel from '$lib/common/models/CannonModel.svelte';
	import { useTask } from '@threlte/core';
	import { Text } from '@threlte/extras';
	import type { Group } from 'three';
	import { T } from '@threlte/core';

	let loadingCannon: Group;

	useTask((delta) => {
		loadingCannon?.rotateY(delta);
	});
</script>

<Text
	text={'Connecting \nto the Game \nSession...'}
	fontSize={0.75}
	position={[-1.6, 1.5, 0]}
	color={'red'}
	font={'fonts/VT323-Regular.ttf'}
/>
<T.Group bind:ref={loadingCannon}>
	<CannonModel scale={0.1} position={[0, -2, 0]} />
</T.Group>
