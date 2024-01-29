<script lang="ts">
	import { onMount } from 'svelte';
	import TargetModel from './models/TargetModel.svelte';
	import { Euler, Matrix4, Vector3 } from 'three';

	let targetCoordinates = [];

	function calculateGroundProjectileCoordinatesFromLaunch(meshRotation, power) {
		// Assuming constant launch angle of 70 degrees
		const launchAngleInRadians = (70 * Math.PI) / 180;

		// Calculate speed based on power (assuming power ranges from 0 to 100)
		const maxSpeed = 14;
		const speed = (power / 100) * maxSpeed;

		// Calculate time of flight to reach y = 0
		const timeOfFlight = (2 * speed * Math.sin(launchAngleInRadians)) / 9.8;

		// Calculate x and z coordinates for y = 0 in local coordinates
		const localX = speed * timeOfFlight * Math.cos(launchAngleInRadians);
		const localZ = speed * timeOfFlight * Math.sin(launchAngleInRadians);

		// Apply the rotation of the mesh to the local coordinates to get rotated coordinates
		const rotatedX = localX * Math.cos(meshRotation.y) + localZ * Math.sin(meshRotation.y);
		const rotatedZ = -localX * Math.sin(meshRotation.y) + localZ * Math.cos(meshRotation.y);

		return { x: rotatedX, z: rotatedZ };
	}

	function generateRandomProjectileCoordinates(numCoordinates) {
		const coordinatesArray = [];

		const minDistance = 2;

		const isTooClose = (newCoord, existingCoords) => {
			for (const existingCoord of existingCoords) {
				const distance = Math.sqrt(
					Math.pow(newCoord.x - existingCoord.x, 2) + Math.pow(newCoord.z - existingCoord.z, 2)
				);

				if (
					distance < minDistance ||
					(newCoord.x < 0 && newCoord.z < 0) ||
					newCoord.z < 2 ||
					Math.abs(newCoord.x) < 3 ||
					(Math.atan2(newCoord.z, newCoord.x) * 180) / Math.PI < 25
				) {
					return true; // Coordinates are too close
				}
			}

			return false; // Coordinates are not too close
		};

		while (coordinatesArray.length < numCoordinates) {
			// Generate random power between 45 and 100 (whole numbers)
			const power = Math.floor(Math.random() * (100 - 45 + 1) + 45);

			// Generate random Euler rotation on the y-axis between -1.4 and 1.4
			const eulerRotationY = Math.random() * 2.8 - 14;

			// Calculate x and z coordinates based on the random power and Euler rotation
			const newCoordinates = calculateGroundProjectileCoordinatesFromLaunch(
				new Euler(0, eulerRotationY, 0),
				power
			);

			// Check if the new coordinates are too close to existing coordinates
			if (!isTooClose(newCoordinates, coordinatesArray)) {
				coordinatesArray.push(newCoordinates);
			}
		}

		return coordinatesArray;
	}

	onMount(() => {
		targetCoordinates = generateRandomProjectileCoordinates(100);
	});
</script>

{#each targetCoordinates as targetCoordinate}
	<TargetModel position={[targetCoordinate.x, 0.101, targetCoordinate.z]} />
{/each}
