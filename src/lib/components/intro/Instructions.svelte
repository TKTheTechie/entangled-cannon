<script lang="ts">
	import { HTML, Text } from '@threlte/extras';
	import QRCode from './QRCode.svelte';
	import { text } from '@sveltejs/kit';
</script>

<Text
	text="Instructions"
	fontSize={0.5}
	position={[1.75, 2, 0]}
	rotation.y={Math.PI}
	rotation.x={Math.PI / 4}
/>

<Text
	text="     1. Scan the QR Code with your phone to connect your phone to begin the game session 
     2. Turn your phone to portrait mode and hold it in front of you 
     3. Tilt your phone to the left and right to control the direction of the cannon 
     4. Fire as many targets as you can to score points within the time limit"
	fontSize={0.2}
	position={[4, 1, 0]}
	rotation.y={Math.PI}
	rotation.x={Math.PI / 4}
/>

<QRCode />
