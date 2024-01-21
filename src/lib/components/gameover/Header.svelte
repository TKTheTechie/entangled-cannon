<script lang="ts">
	import { T, extend, useLoader } from '@threlte/core';
	import { Float, useTexture } from '@threlte/extras';
	import { MeshMatcapMaterial } from 'three';
	import { FontLoader } from 'three-stdlib';
	import Text3D from '../game/common/Text3D.svelte';

	const matcapLoader = useTexture('/textures/cannon_ball_matcap.png');
	const fontLoader = useLoader(FontLoader).load('/fonts/Cyberway_Riders_Regular.json');
	extend({ MeshMatcapMaterial });
</script>

{#await Promise.all([matcapLoader, fontLoader]) then [texture, font]}
	<Float>
		<T.Mesh position={[6, 3, 2]} rotation.y={-Math.PI} rotation.x={Math.PI / 4}>
			<T.MeshMatcapMaterial matcap={texture} color="white" />
			<Text3D {font} text={'  L E A D E R B O A R D'} size={0.8} />
		</T.Mesh>
	</Float>
{/await}
