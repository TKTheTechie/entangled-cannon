<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import CannonModel from '$lib/common/models/CannonModel.svelte';
	import { HTML, Text, interactivity } from '@threlte/extras';
	import { Clock, type Group } from 'three';
	import SolaceClient from '$lib/common/SolaceClient';
	import { GAME_SESSION_ID } from '$lib/store/game-config';

	interactivity();

	let touchIcon: Group,
		showTouchIcon = true;

	enum FIRE_STATE {
		RELOADING,
		READY,
		POWERING
	}

	export const FIRE_STATE_TEXT: { [key in FIRE_STATE]: string } = {
		[FIRE_STATE.RELOADING]: 'RELOADING.....',
		[FIRE_STATE.READY]: 'HOLD DOWN TO FIRE!',
		[FIRE_STATE.POWERING]: 'POWERING UP!'
	};

	export const FIRE_STATE_COLORS: { [key in FIRE_STATE]: string } = {
		[FIRE_STATE.RELOADING]: 'hsl(25, 100%, 47%)',
		[FIRE_STATE.READY]: 'hsl(345deg 100% 47%)',
		[FIRE_STATE.POWERING]: 'hsl(119, 100%, 47%)'
	};

	let fireState = FIRE_STATE.READY;

	let cannon: Group;

	let enableDrag = false;

	let currentPointerX = 0;
	let dragDiff = 0;

	let cannonChargeAudio: any;
	let cannonReloadAudio: any;

	let buttonBgColor = 'hsl(345deg 100% 47%)';

	const startDragFn = ({ pointer }) => {
		showTouchIcon = false;
		currentPointerX = pointer.x;
		enableDrag = true;
	};

	const stopDragFn = () => {
		enableDrag = false;
	};

	const dragFn = ({ pointer }) => {
		if (enableDrag) {
			dragDiff = pointer.x - currentPointerX;
		}
	};

	let cannonPower = 0;
	let clock = new Clock();

	useTask((delta) => {
		if (enableDrag) {
			if (
				(cannon.rotation.y < 0.9 && dragDiff > 0) ||
				(cannon.rotation.y > 0.9 && dragDiff < 0) ||
				Math.abs(cannon.rotation.y) < 0.9
			) {
				SolaceClient.publishCannonRotationMessage($GAME_SESSION_ID, cannon.rotation);
				cannon.rotateY(dragDiff / 100);
			}
		}
		if (fireState == FIRE_STATE.POWERING) {
			if (cannonPower < 100) cannonPower = cannonPower + 0.25;
		}

		if (showTouchIcon) {
			touchIcon.position.setX(Math.sin(clock.getElapsedTime()));
		}
	});

	const powerCannon = () => {
		if (cannonPower == 0 && fireState == FIRE_STATE.READY) {
			cannonChargeAudio?.play?.();
			fireState = FIRE_STATE.POWERING;
		}
	};

	const fireCannon = () => {
		SolaceClient.publishCannonFireMessage($GAME_SESSION_ID, cannonPower);
		cannonChargeAudio?.pause?.();
		cannonChargeAudio.currentTime = 0;
		fireState = FIRE_STATE.RELOADING;
		cannonPower = 0;
		cannonReloadAudio.volume = 1;
		setTimeout(() => {
			fireState = FIRE_STATE.READY;
			cannonReloadAudio?.play?.();
		}, 1000);
	};
</script>

<audio src="/audio/cannon-charge.mp3" bind:this={cannonChargeAudio} />
<audio src="/audio/cannon-reload.mp3" bind:this={cannonReloadAudio} />
<HTML position={[-1.75, 5, 0]}>
	<div class="power">
		{#key cannonPower}
			<div class="bar" style="height: {cannonPower}%" />
		{/key}
	</div>
</HTML>
<Text
	color="red"
	fontSize={0.2}
	text={'POWER'}
	position={[-1.25, 2.9, 1]}
	font={'fonts/bangers.regular.ttf'}
/>

{#if showTouchIcon}
	<T.Group bind:ref={touchIcon}>
		<HTML position={[-1, -0.75, 0]}>
			<img
				alt="swipe icon"
				src="/swipe.png"
				height="125px"
				width="125px"
				on:touchstart={() => {
					showTouchIcon = false;
				}}
			/>
		</HTML>
	</T.Group>
{/if}
<T.Group bind:ref={cannon}>
	<CannonModel
		scale={0.5}
		position={[0, -1, 0]}
		rotation.y={Math.PI}
		{startDragFn}
		{dragFn}
		{stopDragFn}
		draggable={true}
	/>
</T.Group>
<HTML position={[-1.6, -1.75, 0]}>
	<button class="pushable" on:touchstart={powerCannon} on:touchend={fireCannon}>
		<span class="shadow" />
		<span class="edge" />
		<span class="front" style="background: {FIRE_STATE_COLORS[fireState]}">
			{FIRE_STATE_TEXT[fireState]}</span
		>
	</button>
</HTML>

<style>
	.pushable {
		position: absolute;
		border: none;
		background: transparent;
		padding: 0;
		cursor: pointer;
		outline-offset: 4px;
		transition: filter 250ms;
		width: 335px;
	}
	.shadow {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 12px;
		background: hsl(0deg 0% 0% / 0.25);
		will-change: transform;
		transform: translateY(2px);
		transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
	}
	.edge {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 12px;
		background: linear-gradient(
			to left,
			hsl(340deg 100% 16%) 0%,
			hsl(340deg 100% 32%) 8%,
			hsl(340deg 100% 32%) 92%,
			hsl(340deg 100% 16%) 100%
		);
	}
	.front {
		display: block;
		position: relative;
		padding: 12px 42px;
		border-radius: 12px;
		font-size: 1.25rem;
		color: white;
		will-change: transform;
		transform: translateY(-4px);
		transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
	}
	.pushable:hover {
		filter: brightness(110%);
	}
	.pushable:hover .front {
		transform: translateY(-6px);
		transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
	}
	.pushable:active .front {
		transform: translateY(-2px);
		transition: transform 34ms;
	}
	.pushable:hover .shadow {
		transform: translateY(4px);
		transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
	}
	.pushable:active .shadow {
		transform: translateY(1px);
		transition: transform 34ms;
	}
	.pushable:focus:not(:focus-visible) {
		outline: none;
	}

	.power {
		--progress: 10%;
		width: 10px;
		height: 250px;
		margin: 9em auto;
		border: 1px solid #fff;
		padding: 3px 2px;
		box-shadow: 0 0 10px #aaa;
		transform: rotate(180deg);
	}

	.power .bar {
		height: 0%;
		width: 100%;
		background: linear-gradient(rgb(0, 255, 94), rgb(77, 185, 117), rgb(0, 255, 94));
		background-repeat: repeat;
		box-shadow: 0 0 10px 0px orange;
		animation: shine 1s ease-in infinite, end 1s ease-out 1 3s;
		transition: height 1s ease 1s;
	}

	@property --progress {
		syntax: '<height>';
		initial-value: 0%;
		inherits: true;
	}

	@keyframes shine {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: 0 50px;
		}
	}

	@keyframes end {
		0%,
		100% {
			box-shadow: 0 0 10px 0px orange;
		}
		50% {
			box-shadow: 0 0 15px 5px orange;
		}
	}
</style>
