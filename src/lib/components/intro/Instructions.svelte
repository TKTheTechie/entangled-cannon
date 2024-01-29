<script lang="ts">
	import { T } from '@threlte/core';
	import { Text, RoundedBoxGeometry, Float, useCursor } from '@threlte/extras';
	import QRCode from './QRCode.svelte';
	import { GAME_STATE, GAME_STATES, muted } from '$lib/store/game-config';

	const { hovering, onPointerEnter, onPointerLeave } = useCursor();

	let showInstructions = false;
	let buttonColor = 'red';
</script>

{#if showInstructions}
	<Text
		text="Instructions"
		fontSize={0.5}
		position={[1.75, 2.3, 0]}
		rotation.y={Math.PI}
		rotation.x={Math.PI / 4}
		font={'./fonts/VT323-Regular.ttf'}
	/>

	<Text
		text="     1. Scan the QR Code with your phone to connect your phone to begin the game session 
     2. Move the cannon left and right by swiping
     3. Hold down the FIRE button to shoot a cannnon ball
     4. Hit as many targets as you can to score points within the time limit"
		fontSize={0.2}
		font={'./fonts/VT323-Regular.ttf'}
		position={[3.9, 1.8, 0]}
		rotation.y={Math.PI}
		rotation.x={Math.PI / 4}
	/>

	<QRCode />
{:else}
	<Float>
		<T.Mesh
			rotation.x={Math.PI / 3.5}
			position={[0.5, 1, 0]}
			on:click={(e) => {
				showInstructions = true;
				GAME_STATE.set(GAME_STATES.INSTRUCTIONS);
				muted.set(false);
			}}
			on:pointerenter={(e) => {
				buttonColor = 'green';
				onPointerEnter();
			}}
			on:pointerleave={(e) => {
				buttonColor = 'red';
				onPointerLeave();
			}}
			receiveShadow
		>
			<RoundedBoxGeometry args={[4, 1, 1]} />
			<T.MeshPhongMaterial color={buttonColor} />
		</T.Mesh>
		<Text
			text="CLICK TO START"
			fontSize={0.6}
			font={'./fonts/VT323-Regular.ttf'}
			position={[2.1, 1.7, -0.2]}
			rotation.y={Math.PI}
			rotation.x={Math.PI / 3.5}
			castShadow
		/>
	</Float>
{/if}
