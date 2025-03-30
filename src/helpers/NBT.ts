import * as nbt from 'prismarine-nbt';
import { Buffer } from 'buffer';
import * as fs from 'fs';

/**
 * Add extra 8 bytes as header
 * @param {Buffer} dat
 */
function fixLevelDat(dat: Buffer): Buffer {
    // file type
    const fileType = 10;
    const fileTypeData = Buffer.alloc(4, 0);
    fileTypeData.writeInt32LE(fileType);

    // size of level.dat
    const sizeData = Buffer.alloc(4, 0);
    sizeData.writeInt32LE(dat.byteLength);

    // merge it
    return Buffer.concat([fileTypeData, sizeData, dat]);
}

async function readNbt(file: string): Promise<nbt.NBT> {
    const buffer = fs.readFileSync(file);

    // backupt level.dat
    fs.rmSync('world/level.dat_old', { force: true });
    fs.writeFileSync('world/level.dat_old', buffer);

    const { parsed } = await nbt.parse(buffer);

    // // console.debug('metadata:', metadata);
    // // console.debug('type:', type);

    return parsed;
}

async function writeNbt(file: string, nbtData: nbt.NBT): Promise<void> {
    const buffer = nbt.writeUncompressed(nbtData, 'little');

    // save new level.dat
    fs.writeFileSync(file, fixLevelDat(buffer));
}

export default async function geneleteNbt(datPath: string, worldName: string): Promise<void> {
    // read old level.dat
    const oldNbt = await readNbt(datPath);

    // update pack version
    const newNbt: nbt.NBT = {
        type: nbt.TagType.Compound,
        name: '',
        value: {
            ...oldNbt.value,
            LevelName: { type: 'string', value: worldName },
        },
    };

    // write new level.dat
    await writeNbt(datPath, newNbt);
}
