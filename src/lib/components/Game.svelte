<script lang="ts">
	import Cannon from './game/Cannon.svelte';
	import { SCORE } from '$lib/store/game-config';
	import TargetGenerator from './game/TargetGenerator.svelte';
	import Floor from './game/Floor.svelte';
	import Timer from './game/Timer.svelte';
	import { Text } from '@threlte/extras';
</script>

<Cannon />
<Floor />
<TargetGenerator />
<Timer />

<Text
	text={`Score: ${$SCORE}`}
	fontSize={0.5}
	position={[-1.5, 1, 0]}
	rotation.y={Math.PI}
	rotation.x={Math.PI / 4}
/>
