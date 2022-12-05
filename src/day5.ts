import {clone, drop, dropWhile, equals, filter, head, join, last, map, not, reject, reverse, splitEvery, take, takeLast, takeWhile} from "ramda";
import {readFile} from "./utils";

type Crate = string;
type Map = Crate[][]
type Movement = { quantity: number, start: number, end: number };
type Input = [Map, Movement[]];

const createMap = (input: string[]): Map => {
    const crates: Crate[][] = [];
    input.forEach((row) => {
        const rowContents = splitEvery(4, row);
        rowContents.forEach((crate, i) => {
            if (!crates[i]) crates[i] = []
            crates[i].unshift(crate.charAt(1));
        });
    });
    return map(reject(s => s == " "), crates)
}

const parseInsruction = (row: string): Movement => {
    const match = row.match(/move ([0-9]+) from ([0-9]+) to ([0-9]+)/);
    const [_, rawQuantity, rawStart, rawEnd] = match!;

    const quantity = parseInt(rawQuantity);
    const start = parseInt(rawStart);
    const end = parseInt(rawEnd);

    return { quantity, start: start - 1, end: end - 1 };
}

const parseInput = (input: string[]): Input => {

    const startingMap = takeWhile((s: string) => !s.startsWith(" 1"), input);
    const rawInstructions = dropWhile((s: string) => !s.startsWith("move"), input);

    const crates = createMap(startingMap)
    const instructions: Movement[] = map(parseInsruction, rawInstructions);

    return [crates, instructions];
}

const walk = (map: Map, movements: Movement[], version: 9000 | 9001): Map => {
    if (movements.length === 0) return map;
    const {quantity, start, end} = head(movements)!;

    const _crates = map[start].splice(map[start].length - quantity);
    const crates = version === 9000 ? reverse(_crates) : _crates;

    map[end] = map[end].concat(crates)
    return walk(map, drop(1, movements), version);
}

const solve1 = ([m, instructions]: Input): string => {
    const result = walk(m, instructions, 9000);

    return join('', map(last, result))
}

const solve2 = ([m, instructions]: Input): string => {
    const result = walk(m, instructions, 9001);

    return join('', map(last, result))
}

const main = () => {
    const contents = readFile("inputs/day5.txt");
    const rows = contents.split("\n");

    const input = parseInput(rows);

    console.table({
        part1: solve1(clone(input)),
        part2: solve2(clone(input)),
    })
}

main();
