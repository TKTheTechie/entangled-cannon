<script lang="ts">
	import { T, useFrame, useThrelte } from '@threlte/core';
	import { AutoColliders, RigidBody } from '@threlte/rapier';
	import type { RigidBody as RigidBodyType } from '@dimforge/rapier3d-compat';
	import { Clock, Euler, Group, Matrix4, Vector3 } from 'three';
	import { onDestroy, onMount } from 'svelte';
	import { clamp } from 'three/src/math/MathUtils';

	export let position: [number, number, number];
	export let power: number;
	export let rotation: Euler;

	let { scene } = useThrelte();

	let ball: Group;
	let cannonBall: RigidBodyType;
	let isFired = false;

	// The angle will always be 65 degrees
	const CANNON_ANGLE = (65 * Math.PI) / 180;

	// MIN POWER WILL BE 45 and MAX POWER WILL BE 100
	const SPEED = (clamp(power, 45, 100) / 100) * 100;

	// The rotation matrix will be used to rotate the local direction vector
	const rotationMatrix = new Matrix4().makeRotationFromEuler(rotation);

	// The local direction vector will be used to apply the impulse to the cannon ball
	const localDirection = new Vector3(0, Math.sin(CANNON_ANGLE), Math.cos(CANNON_ANGLE));

	// The global direction vector will be used to apply the impulse to the cannon ball
	const globalDirection = localDirection.applyMatrix4(rotationMatrix);

	let clock = new Clock();
	let fire = useFrame(
		(delta, ctx) => {
			if (cannonBall && !isFired) {
				cannonBall.applyImpulse(globalDirection.multiplyScalar(SPEED), true);
				isFired = true;
			}
			if (cannonBall.translation().y < 0) {
				ball.removeFromParent();
				fire.stop();
			}
		},
		{ autostart: false }
	);

	onMount(() => {
		fire.start();
	});

	onDestroy(() => {
		fire.stop();
	});
</script>

<T.Group {position} bind:ref={ball}>
	<RigidBody bind:rigidBody={cannonBall} enabled={true}>
		<AutoColliders shape={'ball'} mass={5}>
			<T.Mesh castShadow>
				<T.SphereGeometry args={[1.1]} />
				<T.MeshStandardMaterial color="red" />
			</T.Mesh>
		</AutoColliders>
	</RigidBody>
</T.Group>
