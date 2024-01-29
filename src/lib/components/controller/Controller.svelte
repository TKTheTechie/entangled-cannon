<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { Sky, Text, useInteractivity } from '@threlte/extras';
	import { onMount } from 'svelte';
	import ConnectingScreen from './ConnectingScreen.svelte';
	import { CONTROLLER_STATE, CONTROLLER_STATES, GAME_SESSION_ID } from '$lib/store/game-config';
	import CannonControl from './CannonControl.svelte';
	import SolaceClient from '$lib/common/SolaceClient';

	useInteractivity();

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.has('game_session_id')) {
			GAME_SESSION_ID.set(urlParams.get('game_session_id'));
		} else {
			CONTROLLER_STATE.set(CONTROLLER_STATES.FAILED);
			return;
		}
		SolaceClient.connect()
			.then(() => {
				console.log('Connected to Solace...');
				SolaceClient.sendGameJoinRequest($GAME_SESSION_ID)
					.then(() => {
						CONTROLLER_STATE.set(CONTROLLER_STATES.CONNECTED);
					})
					.catch((err) => {
						CONTROLLER_STATE.set(CONTROLLER_STATES.FAILED);
						console.log('Unable to send game join request: ' + err.toString());
					});

				SolaceClient.subscribeGameOver($GAME_SESSION_ID, () => {
					CONTROLLER_STATE.set(CONTROLLER_STATES.END);
				});
			})
			.catch((err) => {
				CONTROLLER_STATE.set(CONTROLLER_STATES.FAILED);
				console.log('Unable to connect to Solace: ' + err.toString());
			});
	});
</script>

<Canvas>
	<Sky
		turbidity={10}
		rayleigh={3}
		azimuth={0}
		elevation={0}
		mieCoefficient={0.005}
		mieDirectionalG={0.7}
	/>
	{#if $CONTROLLER_STATE == CONTROLLER_STATES.FAILED}
		<Text
			text={'Unable to \n Connect!'}
			fontSize={0.75}
			position={[-1.6, 1.5, 0]}
			color={'red'}
			font={'./fonts/VT323-Regular.ttf'}
		/>
	{:else if $CONTROLLER_STATE === CONTROLLER_STATES.CONNECTING}
		<ConnectingScreen />
	{:else if $CONTROLLER_STATE === CONTROLLER_STATES.CONNECTED}
		<CannonControl />
	{:else if $CONTROLLER_STATE === CONTROLLER_STATES.END}
		<Text
			text={'GAME\nOVER'}
			fontSize={1.75}
			position={[-1.6, 2.5, 0]}
			color={'red'}
			font={'./fonts/VT323-Regular.ttf'}
		/>
	{/if}
</Canvas>

<style>
	:global(body) {
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	}
</style>
