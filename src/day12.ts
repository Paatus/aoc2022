import {head} from "ramda";
import {readFile} from "./utils";

const example = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`

type Tile = { height: number, isStart: boolean, isEnd: boolean, visited: boolean, parent?: Tile }
type StrPos = `${number},${number}`;

const getHeight = (char: string): number => {
    if (char === 'S') return getHeight('a');
    if (char === 'E') return getHeight('z');

    return char.charCodeAt(0) - 97;
}

const getTile = (char: string): Tile => {
    const isEnd = char === 'E';
    const isStart = char === 'S';
    return { height: getHeight(char), isEnd, isStart, visited: false };
}

const toMap = (input: string): Map<StrPos, Tile> => {
    const lines = input.split("\n");
    const m = new Map<StrPos, Tile>();

    for (let y = 0; y < lines.length; y++) {
        for (let x = 0; x < lines[y].length; x++) {
            m.set(`${y},${x}`, getTile(lines[y][x]));
        }
    }

    return m;
}

const getPossibleMoves = (pos: StrPos, m: Map<StrPos, Tile>): [StrPos, Tile][] => {
    const currentPosition = m.get(pos)!;
    const [_y,_x] = pos.split(',');
    const x = parseInt(_x);
    const y = parseInt(_y);

    const up   : StrPos = `${y-1},${x}`
    const down : StrPos = `${y+1},${x}`
    const left : StrPos = `${y},${x-1}`
    const right: StrPos = `${y},${x+1}`

    const toTuple = (pos: StrPos): [StrPos, Tile | undefined] => [pos, m.get(pos)];
    const filterFalsy = (pos: [StrPos, Tile | undefined]): pos is [StrPos, Tile] => Boolean(pos[1]);
    const filterSteep = (pos: [StrPos, Tile]): boolean => {
        if (pos[1].visited) { return false; }
        if (pos[1].height <= currentPosition.height + 1) {
            return true;
        }
        return false;
    }
    return [up,down,left,right].map(toTuple).filter(filterFalsy).filter(filterSteep);
}

const countSteps = (tile: Tile, count: number = 0): number => {
    if (!tile.parent) return count;
    return countSteps(tile.parent!, count + 1);
}

const bfs = (map: Map<StrPos, Tile>, startPos: StrPos) => {
    const Q: StrPos[] = [];
    Q.push(startPos);
    const currentPosition = map.get(startPos)!;
    currentPosition.visited = true;
    while (Q.length > 0) {
        const v = Q.pop()!;
        const currTile = map.get(v)!;
        if (currTile.isEnd) {
            return countSteps(currTile);
        }
        const possibleMoves = getPossibleMoves(v, map);
        for (let move of possibleMoves) {
            if (!move[1].visited) {
                move[1].visited = true;
                move[1].parent = currTile;
                Q.unshift(move[0])
            }
        }
    }
    return -1;
}

const getStartPosition = (map: Map<StrPos, Tile>): StrPos => {
    const entries = map.entries();
    for (const entry of entries) {
        if (entry[1].isStart) { return entry[0] }
    }
    return `0,0`;
}

const findBestStartingPoint = (map: Map<StrPos, Tile>, input: string): number => {
    const entries = map.entries();
    const results: number[] = [];
    for (const entry of entries) {
        if (entry[1].height === 0) {
            const m = toMap(input);
            results.push(bfs(m, entry[0]))
        }
    }
    return head(results.filter(n => n !== -1).sort((b, a) => b - a))!;
};

const solve2 = (input: string): number => {
    const map = toMap(input);
    return findBestStartingPoint(map, input);
};

const solve1 = (input: string): number => {
    const map = toMap(input);
    const startPos = getStartPosition(map);
    console.log(startPos)

    const res = bfs(map, startPos);
    return res;
}

const main = () => {
    const contents = readFile("inputs/day12.txt");
    console.table({
        part1: solve1(contents),
        part2: solve2(contents),
    })
}

main();
