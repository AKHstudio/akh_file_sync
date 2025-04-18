import { BlockPermutation, system, world } from '@minecraft/server';
import { disableWatchdogTimingWarnings } from '@minecraft/debug-utilities';
import { MinecraftBlockTypes } from '@minecraft/vanilla-data';
import { Vector3Builder } from '@minecraft/math';
import { test } from './test.js';

system.run(() => {
    disableWatchdogTimingWarnings(true);
});

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        const location = new Vector3Builder(player.location);
        const viewDirection = new Vector3Builder(player.getViewDirection()).scale(10).add(new Vector3Builder(0, 1, 0));
        const block = player.dimension.getBlock(location.add(viewDirection));
        if (!block) continue;
        block.setPermutation(BlockPermutation.resolve(MinecraftBlockTypes.Obsidian));
    }
});

test();
