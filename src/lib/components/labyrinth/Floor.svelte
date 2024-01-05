<script lang="ts">
	import { BOARD_DIMENSIONS, PLAYER_ROTATION } from '$lib/store/game-config';
	import type { RigidBody as RigidBodyType } from '@dimforge/rapier3d-compat';
	import { T, useTask } from '@threlte/core';
	import { AutoColliders, Debug, RigidBody, Collider } from '@threlte/rapier';
	import { onDestroy } from 'svelte';
	import { useKeyboardControls } from 'svelte-kbc';
	import { Vector3, type Mesh, Quaternion } from 'three';

	export let geometry;

	let floorRigidBody: RigidBodyType;
	let floor: Mesh;

	let rotation_x = 0,
		rotation_y = 0,
		rotation_z = 0;

	let floorRotation = new Quaternion();
	let floorPosition = new Vector3();

	const { w, a, s, d, space } = useKeyboardControls();

	useTask(() => {
		if ($w) floor.rotateX(Math.PI / 180);
		if ($s) floor.rotateX(-Math.PI / 180);
		floor.getWorldPosition(floorPosition);
		floor.getWorldQuaternion(floorRotation);
		floorRigidBody.setRotation(floorRotation, true);
		floorRigidBody.setTranslation(floorPosition, true);
	});
</script>

<T.Group
	position={[0, $BOARD_DIMENSIONS.position_offset, 0]}
	rotation={[rotation_x, rotation_y, rotation_z]}
>
	<RigidBody type={'fixed'} bind:rigidBody={floorRigidBody}>
		<AutoColliders shape={'cuboid'}>
			<T.Mesh
				receiveShadow
				bind:ref={floor}
				{geometry}
				scale={[$BOARD_DIMENSIONS.length, $BOARD_DIMENSIONS.height, $BOARD_DIMENSIONS.width]}
			>
				<T.MeshStandardMaterial color="green" />
			</T.Mesh>
		</AutoColliders>
	</RigidBody>
</T.Group>
