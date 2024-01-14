<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import {
		ContactShadows,
		OrbitControls,
		interactivity,
		TransformControls,
		Portal
	} from '@threlte/extras';
	import type {
		DirectionalLight,
		DirectionalLightHelper,
		BoxGeometry,
		PerspectiveCamera
	} from 'three';
	import { Debug } from '@threlte/rapier';
	import { useKeyboardControls } from 'svelte-kbc';
	import { AudioListener } from '@threlte/extras';
	import { onMount } from 'svelte';
	import { muted } from '$lib/store/game-config';
	import Intro from './Intro.svelte';
	import Game from './Game.svelte';

	let bgMusic: any;

	let box: BoxGeometry;

	let camera: PerspectiveCamera;

	const { scene, renderer } = useThrelte();

	let light: DirectionalLight;

	let showLightHelper = false;

	let helperA: DirectionalLightHelper;

	let debugColliders = false;

	const { w, a, s, d, space } = useKeyboardControls();

	interactivity();

	onMount(() => {
		bgMusic.volume = 0.3;
	});
	muted.subscribe((mute) => {
		if (mute) bgMusic?.stop?.();
		else bgMusic?.play?.();
	});

	// const composer = new EffectComposer(renderer);

	// const setupEffectComposer = (camera: Camera) => {
	// 	composer.removeAllPasses();
	// 	composer.addPass(new RenderPass(scene, camera));

	// 	// composer.addPass(new EffectPass(camera, bloomEffect));
	// 	// composer.addPass(new EffectPass(camera, new FXAAEffect()));
	// };

	// $: setupEffectComposer(camera);

	// useRender((_, delta) => {
	// 	composer.render(delta);
	// });
</script>

<T.AmbientLight intensity={0.5} />

<T.PerspectiveCamera makeDefault position={[0, 2.8, -2]} fov={100} bind:ref={camera}>
	<OrbitControls enableZoom={true} enableDamping target.y={1.5} />
	<AudioListener />
</T.PerspectiveCamera>

<T.DirectionalLight
	scale={4}
	intensity={0.8}
	position.x={-0.25}
	position.y={4.89}
	position.z={-8.52}
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

<audio src="/audio/music.mp3" bind:this={bgMusic} />
<ContactShadows />
<Intro />
<!-- <Game /> -->
