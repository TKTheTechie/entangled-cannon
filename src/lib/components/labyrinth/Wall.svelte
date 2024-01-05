<script lang="ts">
	import { BOARD_DIMENSIONS, PLAYER_ROTATION } from '$lib/store/game-config';
	import type { RigidBody as RigidBodyType } from '@dimforge/rapier3d-compat';
	import { T, useTask } from '@threlte/core';
	import { AutoColliders, Debug, RigidBody, Collider } from '@threlte/rapier';
	import { useKeyboardControls } from 'svelte-kbc';
	import { Mesh, Quaternion, Vector3 } from 'three';

	export let geometry;
	export let position_x = 0;
	export let position_y = 0;
	export let position_z = 0;

	export let rotation_x = 0;
	export let rotation_y = 0;
	export let rotation_z = 0;

	export let scale_x = $BOARD_DIMENSIONS.width / (4 * 100);
	export let scale_y = $BOARD_DIMENSIONS.height / 2;
	export let scale_z = $BOARD_DIMENSIONS.length;

	let wallRigidBody: RigidBodyType;
	let wall: Mesh;

	let wallRotation = new Quaternion();
	let wallPosition = new Vector3();

	const { w, a, s, d, space } = useKeyboardControls();

	useTask(() => {
		if ($w) wall.rotateX((-1 * Math.PI) / 180);
		if ($s) wall.rotateX(Math.PI / 180);

		wall.getWorldPosition(wallPosition);
		wall.getWorldQuaternion(wallRotation);
		console.log(wallRotation);
		wallRigidBody.setRotation(wallRotation, true);
	});
</script>

<T.Group
	rotation={[rotation_x, rotation_y, rotation_z]}
	position={[position_x, position_y + $BOARD_DIMENSIONS.position_offset, position_z]}
>
	<RigidBody type="fixed" bind:rigidBody={wallRigidBody}>
		<AutoColliders shape="cuboid">
			<T.Mesh castShadow {geometry} scale={[scale_x, scale_y, scale_z]} bind:ref={wall}>
				<T.MeshStandardMaterial color="yellow" />
			</T.Mesh>
		</AutoColliders>
	</RigidBody>
</T.Group>
