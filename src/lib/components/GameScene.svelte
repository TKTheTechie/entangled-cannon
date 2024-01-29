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
	import { AudioListener } from '@threlte/extras';
	import { onDestroy, onMount } from 'svelte';
	import {
		GAME_SESSION_ID,
		GAME_STATE,
		GAME_STATES,
		SOLACE_STATUS,
		SOLACE_STATUS_CODES,
		muted
	} from '$lib/store/game-config';
	import Intro from './Intro.svelte';
	import Game from './Game.svelte';
	import GameOver from './GameOver.svelte';
	import { Pane, Checkbox, Element } from 'svelte-tweakpane-ui';
	import SolaceClient from '$lib/common/SolaceClient';

	let bgMusic: any;

	let box: BoxGeometry;

	let camera: PerspectiveCamera;

	const { scene, renderer } = useThrelte();

	let light: DirectionalLight;

	let showLightHelper = false;

	let helperA: DirectionalLightHelper;

	let debugColliders = false;

	let solace_status = 'Connecting';

	interactivity();

	onMount(() => {
		bgMusic.volume = 0.3;
		//Instantiate the connection to Solace
		SolaceClient.connect()
			.then(() => {
				console.log('Connecting to Solace...');
				SolaceClient.subscribeGameJoinRequest($GAME_SESSION_ID, () => {
					GAME_STATE.set(GAME_STATES.PLAYING);
				});
			})
			.catch((err) => {
				console.log('Error connecting to Solace: ' + err.toString());
			});
	});

	const solace_status_unsubscribe = SOLACE_STATUS.subscribe((status) => {
		switch (status) {
			case SOLACE_STATUS_CODES.CONNECTING:
				solace_status = 'Connecting';
				break;
			case SOLACE_STATUS_CODES.CONNECTED:
				solace_status = 'Connected';
				break;
			case SOLACE_STATUS_CODES.DISCONNECTED:
				solace_status = 'Disconnected';
				break;
		}
	});

	const mute_unsubscribe = muted.subscribe((mute) => {
		if (mute) bgMusic?.pause?.();
		else bgMusic?.play?.();
	});

	onDestroy(() => {
		solace_status_unsubscribe();
		mute_unsubscribe;
	});
</script>

<Pane position="fixed" title="Game Config">
	{#if $GAME_STATE !== GAME_STATES.INTRO}
		<Checkbox bind:value={$muted} label="Mute Audio" />
	{/if}
	<Element
		><div class="solace-status solace-{solace_status}">
			{solace_status}
			{solace_status === 'Disconnected' ? 'from' : 'to'}
			<a href="https://solace.com/products/event-broker/cloud/" target="_blank">Solace Cloud</a>
		</div></Element
	>
	<Element
		><div class="solace-status">
			<a href="https://tkthetechie.io/blog/event-driven-3d-javscript" target="_blank"
				>Learn how this was built!</a
			>
		</div></Element
	>
</Pane>

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

<audio src="./audio/music.mp3" bind:this={bgMusic} loop />
<ContactShadows />
{#if $GAME_STATE === GAME_STATES.INTRO || $GAME_STATE === GAME_STATES.INSTRUCTIONS}
	<Intro />
{:else if $GAME_STATE === GAME_STATES.PLAYING}
	<Game />
{:else}
	<GameOver />
{/if}

<style>
	.solace-status {
		font-family: var(--bs-ff);
		font-size: 11px;
		font-weight: 500;
		line-height: 1;
		text-align: left;
		padding: 5px;
	}

	.solace-Connecting {
		color: yellow;
	}

	.solace-Connected {
		color: green;
	}

	.solace-Disconnected {
		color: red;
	}

	.solace-status a {
		color: white;
	}

	.solace-status a:hover {
		color: greenyellow;
	}
</style>
