<script lang="ts">
	import { T } from '@threlte/core';
	import { AutoColliders, RigidBody } from '@threlte/rapier';
</script>

<RigidBody>
	<AutoColliders shape="ball">
		<T.Mesh position={[0, 4, 3]} scale={0.05} castShadow>
			<T.SphereGeometry args={[2]} />
			<T.MeshStandardMaterial color="red" />
		</T.Mesh>
	</AutoColliders>
</RigidBody>
