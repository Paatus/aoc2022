import {sort} from "ramda";
import {readFile} from "./utils";

type NumPos = { x: number, y: number };
type Pos = `${number},${number}`;
type MapInfo = { width: number, height: number, map: Map<Pos, number> };

const toMap = (input: string[]): MapInfo => {
    const map = new Map<Pos, number>();

    for(let y = 0; y < input.length; y++) {
        for(let x = 0; x < input[y].length; x++) {
            map.set(`${x},${y}`, parseInt(input[y].charAt(x)));
        }
    }
    return {
        width: input[0].length - 1,
        height: input.length - 1,
        map
    }
}

const getPos = (pos: Pos): NumPos => {
    const [x, y] = pos.split(',');
    return { x: parseInt(x), y: parseInt(y) };
}

const isVisibleE = (pos: Pos, mapInfo: MapInfo): [boolean, number] => {
    const height = mapInfo.map.get(pos)!;
    const {x, y} = getPos(pos);
    let count = 0;
    for (let xPos = x - 1; xPos >= 0; xPos--) {
        count++;
        if (mapInfo.map.get(`${xPos},${y}`)! >= height) {
            return [false, count];
        }
    }
    return [true, count];
}

const isVisibleW = (pos: Pos, mapInfo: MapInfo): [boolean, number] => {
    const height = mapInfo.map.get(pos)!;
    const {x, y} = getPos(pos);
    let count = 0;
    for (let xPos = x + 1; xPos <= mapInfo.width; xPos++) {
        count++;
        if (mapInfo.map.get(`${xPos},${y}`)! >= height) {
            return [false, count];
        }
    }
    return [true, count];
}

const isVisibleN = (pos: Pos, mapInfo: MapInfo): [boolean, number] => {
    const height = mapInfo.map.get(pos)!;
    const {x, y} = getPos(pos);
    let count = 0;
    for (let yPos = y - 1; yPos >= 0; yPos--) {
        count++;
        if (mapInfo.map.get(`${x},${yPos}`)! >= height) {
            return [false, count]
        }
    }
    return [true, count];
}

const isVisibleS = (pos: Pos, mapInfo: MapInfo): [boolean, number] => {
    const height = mapInfo.map.get(pos)!;
    const {x, y} = getPos(pos);
    let count = 0;
    for (let yPos = y + 1; yPos <= mapInfo.height; yPos++) {
        count++;
        if (mapInfo.map.get(`${x},${yPos}`)! >= height) {
            return [false, count];
        }
    }
    return [true, count];
}

const isVisible = (pos: Pos, mapInfo: MapInfo): boolean => {
    const poss = [...Object.values(getPos(pos))];
    const isEdge = poss.some(n => n === 0 || n === mapInfo.height || n === mapInfo.width);

    return (
        isEdge
        || isVisibleN(pos, mapInfo)[0]
        || isVisibleS(pos, mapInfo)[0]
        || isVisibleE(pos, mapInfo)[0]
        || isVisibleW(pos, mapInfo)[0]
    )
}

const scenicScore = (pos: Pos, mapInfo: MapInfo): number => {
    const n = isVisibleN(pos, mapInfo)[1];
    const s = isVisibleS(pos, mapInfo)[1];
    const e = isVisibleE(pos, mapInfo)[1];
    const w = isVisibleW(pos, mapInfo)[1];

    return n * s * e * w;
}

const solve1 = (mapInfo: MapInfo) => {
    const keys = [...mapInfo.map.keys()];

    return keys.filter(keys => isVisible(keys, mapInfo)).length;
};

const solve2 = (mapInfo: MapInfo) => {
    const keys = [...mapInfo.map.keys()];

    const pos = sort((a: Pos, b: Pos) => scenicScore(b, mapInfo) - scenicScore(a, mapInfo))(keys)[0];
    return scenicScore(pos, mapInfo);

};

const main = () => {
    const contents = readFile("inputs/day8.txt");
    const mapInfo = toMap(contents.split("\n"));

    console.table({
        part1: solve1(mapInfo),
        part2: solve2(mapInfo)
    })
}

main();
