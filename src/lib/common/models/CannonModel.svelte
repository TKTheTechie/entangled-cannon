<!--
Auto-generated by: https://github.com/threlte/threlte/tree/main/packages/gltf
Command: npx @threlte/gltf@2.0.1 -h -u -P -k -K -s cannon/scene.gltf
Author: luonro11 (https://sketchfab.com/luonro11)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/cannon-4ca9b1f52fcc4d399ee65ed7778cfe30
Title: Cannon
-->

<script context="module" lang="ts">
	import { Group } from 'three';
	import { T, forwardEventHandlers } from '@threlte/core';
	import { useGltf, useSuspense } from '@threlte/extras';

	const load = () => {
		const suspend = useSuspense();
		return suspend(useGltf('./models/cannon/scene.gltf'));
	};

	export const preload = async () => {
		await load();
	};
</script>

<script lang="ts">
	const ref = new Group();

	const gltf = load();

	const component = forwardEventHandlers();

	export let startDragFn = (e) => {};
	export let dragFn = (e) => {};
	export let stopDragFn = (e) => {};

	export let draggable = false;
</script>

<T is={ref} dispose={false} {...$$restProps} bind:this={$component}>
	{#await gltf}
		<slot name="fallback" />
	{:then gltf}
		<T.Group rotation={[-Math.PI / 2, 0, 0]}>
			{#if draggable}
				<T.Mesh
					name="Cannon_Model"
					castShadow
					receiveShadow
					geometry={gltf.nodes.Object_2.geometry}
					material={gltf.materials.initialShadingGroup}
					on:pointerdown={(e) => startDragFn(e)}
					on:pointermove={(e) => dragFn(e)}
					on:pointerup={(e) => stopDragFn(e)}
					on:pointerleave={(e) => stopDragFn(e)}
				/>
			{:else}
				<T.Mesh
					name="Cannon_Model"
					castShadow
					receiveShadow
					geometry={gltf.nodes.Object_2.geometry}
					material={gltf.materials.initialShadingGroup}
				/>
			{/if}
		</T.Group>
	{:catch error}
		<slot name="error" {error} />
	{/await}

	<slot {ref} />
</T>
