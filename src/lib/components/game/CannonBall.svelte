<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { AutoColliders, RigidBody, type ContactEvent } from '@threlte/rapier';
	import type { RigidBody as RigidBodyType } from '@dimforge/rapier3d-compat';
	import { Clock, Euler, Group, Matrix4, Mesh, MeshMatcapMaterial, Vector3 } from 'three';
	import { onDestroy, onMount } from 'svelte';
	import { clamp } from 'three/src/math/MathUtils';
	import { muted } from '$lib/store/game-config';
	import { PositionalAudio } from '@threlte/extras';

	export let position: [number, number, number];
	export let power: number;
	export let rotation: Euler;
	export let material: MeshMatcapMaterial;

	let exploded = false;

	let { scene } = useThrelte();

	let ball: Group;
	let cannonBall: RigidBodyType;
	let isFired = false;
	let ballMesh: Mesh;

	// The angle will always be 65 degrees
	const CANNON_ANGLE = (70 * Math.PI) / 180;

	// MIN POWER WILL BE 45 and MAX POWER WILL BE 100
	const SPEED = clamp(power, 45, 100);

	let blink = true;

	let clock = new Clock();
	const { start, stop } = useTask(
		(delta) => {
			if (cannonBall && !isFired) {
				// Get a copy of the mesh rotation
				const rotatedEuler = rotation.clone();

				// Calculate an additional offset based on rotatedEuler.y
				const additionalOffset = rotatedEuler.y * 0.1; // Adjust the multiplier as needed

				// Increase the offset as the rotation angle increases
				const increasedOffset = additionalOffset + rotatedEuler.y * 0.1; // Adjust the multiplier as needed

				// Add the increased offset to rotatedEuler.y
				rotatedEuler.y += increasedOffset;

				// The rotation matrix will be used to rotate the local direction vector
				const rotationMatrix = new Matrix4().makeRotationFromEuler(rotatedEuler);

				// The local direction vector will be used to apply the impulse to the cannon ball
				const localDirection = new Vector3(0, Math.sin(CANNON_ANGLE), Math.cos(CANNON_ANGLE));

				// The global direction vector will be used to apply the impulse to the cannon ball
				const globalDirection = localDirection.applyMatrix4(rotationMatrix);

				cannonBall.applyImpulse(globalDirection.multiplyScalar(SPEED), true);
				isFired = true;
			} else {
				let ballPos = ballMesh.getWorldPosition(new Vector3());
			}
		},
		{ autoStart: false }
	);

	onMount(() => {
		console.log(rotation);
		start();
	});

	onDestroy(() => {
		stop();
	});

	const bounce_audio = {
		volume: 1,
		stop: undefined as (() => any) | undefined,
		play: undefined as ((...args: any[]) => any) | undefined,
		source: 'audio/ball-bounce.mp3'
	};

	const explosion_audio = {
		volume: 1,
		stop: undefined as (() => any) | undefined,
		play: undefined as ((...args: any[]) => any) | undefined,
		source: 'audio/ball-explode.mp3'
	};

	const contact = (e: ContactEvent) => {
		if (e.targetRigidBody.userData['id'] !== 'Launcher') {
			//Hit the floor
			if (e.targetRigidBody.userData['id'] === 'Floor') {
				//ball has lost momentum... time to explode it
				if (e.totalForceMagnitude < 50) {
					explode();
					if (!$muted) explosion_audio?.play?.();
				} else if (!$muted) {
					bounce_audio.volume = clamp(e.totalForceMagnitude / 1000, 0, 1);
					bounce_audio?.stop?.();
					bounce_audio?.play?.();
				}
			} else {
				explode();
			}
		}
	};

	const explode = () => {
		let callCount = 0;
		const intervalId = setInterval(() => {
			blink = !blink;
			callCount++;
			if (callCount == 5) {
				clearInterval(intervalId);
				exploded = true;
			}
		}, 200);
	};
</script>

{#if !exploded}
	<T.Group {position} bind:ref={ball} scale={[0.2, 0.2, 0.2]}>
		<RigidBody
			bind:rigidBody={cannonBall}
			enabled={true}
			on:contact={contact}
			userData={{ id: 'CannonBall' }}
		>
			<PositionalAudio
				autoplay={false}
				bind:stop={bounce_audio.stop}
				bind:play={bounce_audio.play}
				src={bounce_audio.source}
				volume={bounce_audio.volume}
			/>
			<AutoColliders shape={'ball'} mass={5}>
				<T.Mesh castShadow visible={blink} bind:ref={ballMesh} {material}>
					<T.SphereGeometry args={[0.9]} />
				</T.Mesh>
			</AutoColliders>
		</RigidBody>
	</T.Group>
{/if}

<PositionalAudio
	autoplay={false}
	bind:stop={explosion_audio.stop}
	bind:play={explosion_audio.play}
	src={explosion_audio.source}
	volume={explosion_audio.volume}
/>
