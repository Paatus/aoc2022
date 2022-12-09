import {head, last, map, repeat, tail} from "ramda";
import {readFile, sleep} from "./utils";

type Pos = { x: number, y: number };
type StrPos = `${number} ${number}`
type Direction = 'U' | 'D' | 'L' | 'R';
type Instruction = { direction: Direction, distance: number };

const isAdjacent = (h: Pos, t: Pos) => {
    const xClose = t.x >= h.x - 1 && t.x <= h.x + 1;
    const yClose = t.y >= h.y - 1 && t.y <= h.y + 1;
    if (xClose && yClose) {
        return true;
    }
    return false;
};

const moveTail = (h: Pos, t: Pos): Pos => {
    if (isAdjacent(h, t)) {
        return t;
    }
    const isCardinal = h.x === t.x || h.y === t.y;
    // const isDiagonal = (t.x === h.x - 1 || t.x === h.x + 1) && (t.y === h.y - 1 || t.y === h.y + 1);

    if (isCardinal) {
        if (t.y < h.y) return { x: t.x, y: t.y + 1 }
        if (t.y > h.y) return { x: t.x, y: t.y - 1 }
        if (t.x < h.x) return { x: t.x + 1, y: t.y }
        if (t.x > h.x) return { x: t.x - 1, y: t.y }
    }
    // SW
    if (t.x < h.x && t.y < h.y) return { x: t.x + 1, y: t.y + 1 };
    // SE
    if (t.x > h.x && t.y < h.y) return { x: t.x - 1, y: t.y + 1 };
    // NW
    if (t.x < h.x && t.y > h.y) return { x: t.x + 1, y: t.y - 1 };
    // NE
    if (t.x > h.x && t.y > h.y) return { x: t.x - 1, y: t.y - 1 };

    console.log("That should never happen");
    return t;

}

const toStrPos = ({ x, y }: Pos): StrPos => {
    return `${x} ${y}`;
}

const walk = async (h: Pos, _tail: Pos[], instructions: Instruction[], tailAcc: Set<StrPos> = new Set<StrPos>()): Promise<Set<StrPos>> => {
    if (instructions.length === 0) return tailAcc;
    const { direction, distance } = head(instructions)!;
    const newInstructions = distance > 1 ? [{ direction, distance: distance - 1 }, ...tail(instructions)] : tail(instructions);
    if (distance === 1) {
        // Hack to let node GC
        await sleep(0);
    }
    switch(direction) {
        case 'U': {
            const newHead = { x: h.x, y: h.y + 1 };
            const newTail = [];
            for (let i = 0; i < _tail.length; i++) {
                let hh = i === 0 ? newHead : last(newTail)!;
                const t = _tail[i];
                const movedTail = moveTail(hh, t);
                newTail.push(movedTail);
            }
            tailAcc.add(toStrPos(last(_tail)!));
            tailAcc.add(toStrPos(last(newTail)!));
            return walk(newHead, newTail, newInstructions, tailAcc);
        }
        case 'D': {
            const newHead = { x: h.x, y: h.y - 1 };
            const newTail = [];
            for (let i = 0; i < _tail.length; i++) {
                let hh = i === 0 ? newHead : last(newTail)!;
                const t = _tail[i];
                const movedTail = moveTail(hh, t);
                newTail.push(movedTail);
            }
            tailAcc.add(toStrPos(last(_tail)!));
            tailAcc.add(toStrPos(last(newTail)!));
            return walk(newHead, newTail, newInstructions, tailAcc);
        }
        case 'L': {
            const newHead = { x: h.x - 1, y: h.y };
            const newTail = [];
            for (let i = 0; i < _tail.length; i++) {
                let hh = i === 0 ? newHead : last(newTail)!;
                const t = _tail[i];
                const movedTail = moveTail(hh, t);
                newTail.push(movedTail);
            }
            tailAcc.add(toStrPos(last(_tail)!));
            tailAcc.add(toStrPos(last(newTail)!));
            return walk(newHead, newTail, newInstructions, tailAcc);
        }
        case 'R': {
            const newHead = { x: h.x + 1, y: h.y };
            const newTail = [];
            for (let i = 0; i < _tail.length; i++) {
                let hh = i === 0 ? newHead : last(newTail)!;
                const t = _tail[i];
                const movedTail = moveTail(hh, t);
                newTail.push(movedTail);
            }
            tailAcc.add(toStrPos(last(_tail)!));
            tailAcc.add(toStrPos(last(newTail)!));
            return walk(newHead, newTail, newInstructions, tailAcc);
        }
    }
}

const parseInstruction = (raw: string): Instruction => {
    const [direction, distance] = raw.split(" ");
    return { direction: direction as Direction, distance: parseInt(distance) };
}

const toPos = (x: number, y: number): Pos => ({
    x, y
});

const startPos = toPos(0,0);

const solve1 = async (input: Instruction[]): Promise<number> => {
    const res = await walk(startPos, [startPos], input);
    return res.size;
}

const solve2 = async (input: Instruction[]): Promise<number> => {
    const tail = repeat(startPos, 9);
    const res = await walk(startPos, tail, input);
    return res.size;
}

const main = async () => {
    const contents = readFile("inputs/day9.txt");
    const instructions = map(parseInstruction, contents.split("\n"));

    console.table({
        part1: await solve1(instructions),
        part2: await solve2(instructions)
    })
};

main();
