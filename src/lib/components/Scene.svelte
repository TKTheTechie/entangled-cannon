<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import {
		ContactShadows,
		Float,
		Grid,
		OrbitControls,
		interactivity,
		TransformControls,
		Portal
	} from '@threlte/extras';
	import { Pane, FpsGraph, Folder, Slider, Checkbox, Text } from 'svelte-tweakpane-ui';
	import type {
		DirectionalLight,
		DirectionalLightHelper,
		BoxGeometry,
		PerspectiveCamera,
		GridHelper
	} from 'three';
	import { Debug } from '@threlte/rapier';
	import { useKeyboardControls } from 'svelte-kbc';
	import { CANNON_FORCE, CANNON_POSITION } from '$lib/store/game-config';
	import Cannon from './player-objects/Cannon.svelte';

	let box: BoxGeometry;

	let camera: PerspectiveCamera;

	let { scene } = useThrelte();

	let light: DirectionalLight;

	let showLightHelper = false;

	let helperA: DirectionalLightHelper;

	let debugColliders = false;

	type CannonBallProps = {
		position: [number, number, number];
		force: number;
	};

	let cannonBalls: CannonBallProps[] = [];

	const { w, a, s, d, space } = useKeyboardControls();

	$: {
		if ($space) {
			cannonBalls.push({
				position: [$CANNON_POSITION.x, $CANNON_POSITION.y, $CANNON_POSITION.z],
				force: 10
			});
		}
	}

	interactivity();
</script>

<!-- <Pane title="FPS" position="fixed">
	<FpsGraph />
	<Folder title="Light">
		{#if light}
			<Slider bind:value={light.position.x} label="Light Position X" />
			<Slider bind:value={light.position.y} label="Light Position Y" />
			<Slider bind:value={light.position.z} label="Light Position Z" />
			<Checkbox bind:value={showLightHelper} label="Light Helper" />
			
			
		{/if}
	</Folder>
	<Folder title="Colliders">
		<Checkbox bind:value={debugColliders} label="Collider Debug" />
	</Folder>

</Pane> -->

<T.AmbientLight intensity={0.5} />

<T.PerspectiveCamera makeDefault position={[0, 2, -2]} fov={100} bind:ref={camera}>
	<OrbitControls enableZoom={true} enableDamping target.y={1.5} />
</T.PerspectiveCamera>

<T.DirectionalLight
	scale={4}
	intensity={0.8}
	position.x={5}
	position.y={4}
	position.z={3.5}
	castShadow
	bind:ref={light}
	let:ref
>
	{#if showLightHelper}
		<TransformControls
			object={ref}
			on:objectChange={() => {
				if (!helperA) return;
				helperA.update();

				console.log(ref.position);
			}}
		/>
		<Portal object={scene}>
			<T.DirectionalLightHelper args={[ref]} bind:ref={helperA} />
		</Portal>
	{/if}
</T.DirectionalLight>
{#if debugColliders}
	<Debug />
{/if}

<ContactShadows />

<Cannon scale={[0.2, 0.2, 0.2]} />
