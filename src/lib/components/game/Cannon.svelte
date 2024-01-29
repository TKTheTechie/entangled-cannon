<script lang="ts">
	import { T, extend, useTask } from '@threlte/core';
	import { useTexture } from '@threlte/extras';
	import { MeshMatcapMaterial, type Euler, type Group } from 'three';
	import { useKeyboardControls } from 'svelte-kbc';
	import { GAME_SESSION_ID, muted } from '$lib/store/game-config';
	import { Collider, RigidBody } from '@threlte/rapier';
	import CannonModel from '../../common/models/CannonModel.svelte';
	import CannonBall from './CannonBall.svelte';
	import SolaceClient, {
		type CannonFireMessage,
		type CannonRotationMessage
	} from '$lib/common/SolaceClient';
	import type solace from 'solclientjs';
	import { onMount } from 'svelte';

	extend({ MeshMatcapMaterial });

	let cannonballMaterial: MeshMatcapMaterial;

	const cannonballTexture = useTexture('./textures/cannon_ball_matcap.png');

	let fireSound: any, turnSound: any;

	let cannonVisible = true;

	type CannonBallProps = {
		power: number;
		rotation: Euler;
	};

	let cannonBalls: CannonBallProps[] = [];

	const BASE_POWER = 50;

	let cannon: Group;

	let cannonRotationEvents: Array<Euler> = [];

	const rotateCannon = () => {
		if (cannonRotationEvents.length > 0) {
			cannon.setRotationFromEuler(cannonRotationEvents.shift());
			if (!$muted) turnSound?.play();
		}
	};

	useTask((delta) => {
		rotateCannon();
		rotateCannon();
	});

	onMount(() => {
		SolaceClient.subscribeCannonRotationMessage($GAME_SESSION_ID, (msg: solace.Message) => {
			const blob = new Blob([msg.getBinaryAttachment()], { type: 'text/plain; charset=utf-8' });
			blob.text().then((text) => {
				let rotationEvent: CannonRotationMessage = JSON.parse(text);
				cannonRotationEvents.push(rotationEvent.rotation);
			});
		});

		SolaceClient.subscribeCannonFireMessage($GAME_SESSION_ID, (msg: solace.Message) => {
			const blob = new Blob([msg.getBinaryAttachment()], { type: 'text/plain; charset=utf-8' });
			blob.text().then((text) => {
				let fireEvent: CannonFireMessage = JSON.parse(text);
				fireCannon(fireEvent.power);
			});
		});
	});

	const fireCannon = (power: number) => {
		if (!$muted) fireSound?.play();
		const adjusted_power = power + BASE_POWER;
		cannonBalls = [
			...cannonBalls,
			{
				power: adjusted_power,
				rotation: cannon.rotation
			}
		];
	};
</script>

<!-- <Pane title="Cannon" position="fixed">
	<Text label="Power" bind:value={power} />
	<Checkbox label="Mute" bind:value={$muted} />
</Pane> -->

<audio src="./audio/cannon-fire.mp3" bind:this={fireSound} />
<audio src="./audio/cannon-turn.mp3" bind:this={turnSound} />

{#await cannonballTexture then texture}
	<T.Group name="Cannon" bind:ref={cannon} visible={cannonVisible}>
		<CannonModel scale={[0.2, 0.2, 0.2]} />
		<RigidBody type={'fixed'} userData={{ id: 'Launcher' }}>
			<Collider shape={'cuboid'} args={[0.5, 0.2, 0.5]} />
		</RigidBody>
	</T.Group>

	<T.MeshMatcapMaterial bind:ref={cannonballMaterial} matcap={texture} />

	{#each cannonBalls as { power, rotation }}
		<CannonBall position={[0, 1, 1]} {power} {rotation} material={cannonballMaterial} />
	{/each}
{/await}
