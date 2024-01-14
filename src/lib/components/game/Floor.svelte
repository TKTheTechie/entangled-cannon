<script lang="ts">
	import { FLOOR_DIMENSIONS } from '$lib/store/game-config';
	import { T } from '@threlte/core';
	import { RigidBody, Collider } from '@threlte/rapier';
</script>

<RigidBody enabled={true} type={'fixed'} userData={{ id: 'Floor' }}>
	<T.Group name="Floor" position={[0, -1, 0]}>
		<Collider
			shape={'cuboid'}
			args={[$FLOOR_DIMENSIONS.x, $FLOOR_DIMENSIONS.y, $FLOOR_DIMENSIONS.z]}
			restitution={1}
			friction={1}
		/>
	</T.Group>
</RigidBody>
