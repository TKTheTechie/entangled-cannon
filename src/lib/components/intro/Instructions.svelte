<script lang="ts">
	import { T } from '@threlte/core';
	import { HTML, Text, RoundedBoxGeometry, Float, useCursor } from '@threlte/extras';
	import QRCode from './QRCode.svelte';
	import { text } from '@sveltejs/kit';
	import { MeshPhongMaterial } from 'three';
	import { muted } from '$lib/store/game-config';

	const { hovering, onPointerEnter, onPointerLeave } = useCursor();

	let showInstructions = false;
	let buttonColor = 'red';
</script>

{#if showInstructions}
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
{:else}
	<Float>
		<T.Mesh
			rotation.x={Math.PI / 3.5}
			position={[0.5, 1, 0]}
			on:click={(e) => {
				showInstructions = true;
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
			text="START"
			fontSize={0.5}
			position={[1, 1.6, -0.1]}
			rotation.y={Math.PI}
			rotation.x={Math.PI / 3.5}
			castShadow
		/>
	</Float>
{/if}
