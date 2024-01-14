<script lang="ts">
	import { T, extend, useTask } from '@threlte/core';
	import { useTexture } from '@threlte/extras';
	import { MeshMatcapMaterial, type Euler, type Group } from 'three';
	import { useKeyboardControls } from 'svelte-kbc';
	import { muted } from '$lib/store/game-config';
	import { Checkbox, Pane, Text } from 'svelte-tweakpane-ui';
	import { Collider, RigidBody } from '@threlte/rapier';
	import CannonModel from './models/CannonModel.svelte';
	import CannonBall from './CannonBall.svelte';

	extend({ MeshMatcapMaterial });

	let cannonballMaterial: MeshMatcapMaterial;

	const cannonballTexture = useTexture('/textures/cannon_ball_matcap.png');

	let fireSound: any, turnSound: any;

	let cannonVisible = true;

	type CannonBallProps = {
		power: number;
		rotation: Euler;
	};

	let cannonBalls: CannonBallProps[] = [];

	let power = '45';

	let cannon: Group;

	const { w, a, s, d, space } = useKeyboardControls();

	useTask((delta) => {
		if ($a) {
			if (!$muted) turnSound?.play();
			cannon.rotateY((-1 * Math.PI) / 180);
			console.log(cannon.rotation);
		}
		if ($d) {
			if (!$muted) turnSound?.play();
			cannon.rotateY(Math.PI / 180);
			console.log(cannon.rotation);
		}
	});

	const fireCannon = () => {
		if (!$muted) fireSound?.play();

		cannonBalls = [
			...cannonBalls,
			{
				power: +power,
				rotation: cannon.rotation
			}
		];
	};
</script>

<!-- <Pane title="Cannon" position="fixed">
	<Text label="Power" bind:value={power} />
	<Checkbox label="Mute" bind:value={$muted} />
</Pane> -->

<audio src="/audio/cannon-fire.mp3" bind:this={fireSound} />
<audio src="/audio/cannon-turn.mp3" bind:this={turnSound} />

{#await cannonballTexture then texture}
	<T.Group name="Cannon" bind:ref={cannon} visible={cannonVisible}>
		<CannonModel on:click={fireCannon} scale={[0.2, 0.2, 0.2]} />
		<RigidBody type={'fixed'} userData={{ id: 'Launcher' }}>
			<Collider shape={'cuboid'} args={[0.5, 0.2, 0.5]} />
		</RigidBody>
	</T.Group>

	<T.MeshMatcapMaterial bind:ref={cannonballMaterial} matcap={texture} />

	{#each cannonBalls as { power, rotation }}
		<CannonBall position={[0, 1, 1]} {power} {rotation} material={cannonballMaterial} />
	{/each}
{/await}
