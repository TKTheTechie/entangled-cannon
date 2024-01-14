<script lang="ts">
	import { GAME_TIME_IN_MINUTES } from '$lib/store/game-config';
	import { Text } from '@threlte/extras';
	import { onDestroy, onMount } from 'svelte';

	let minutes = $GAME_TIME_IN_MINUTES;
	let seconds = 0;

	let GAME_TIMER = '0' + minutes + ':00';

	let timer;

	onMount(() => {
		timer = setInterval(() => {
			// Update the seconds
			seconds--;

			// If seconds have run out, decrement the minutes and set seconds to 59
			if (seconds < 0) {
				minutes--;
				seconds = 59;
			}

			// If minutes have run out, clear the interval
			if (minutes < 0) {
				clearInterval(timer);
				console.log("Time's up!");
			} else {
				// Format the minutes and seconds
				const formattedMinutes = String(minutes).padStart(2, '0');
				const formattedSeconds = String(seconds).padStart(2, '0');

				// Update the time string
				GAME_TIMER = `${formattedMinutes}:${formattedSeconds}`;
			}
		}, 1000);
	});

	onDestroy(() => timer && clearInterval(timer));
</script>

<Text
	text={`Time: ${GAME_TIMER}`}
	fontSize={0.5}
	position={[4, 1, 0]}
	rotation.y={Math.PI}
	rotation.x={Math.PI / 4}
/>
