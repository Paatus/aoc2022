import {compose} from "ramda";
import {readFile} from "./utils"

type Range = { start: number, end: number };
type Row = [Range, Range];

const toRange = (range: string): Range => {
    const [start, stop] = range.split('-');
    return { start: parseInt(start), end: parseInt(stop) };
}

const parseRanges = (row: string): Row => {
    const [a, b] = row.split(',');

    return [toRange(a), toRange(b)]
}

const contained = (a: Range, b: Range): boolean => {
    const aContainsB = b.start >= a.start && b.end <= a.end;
    const bContainsA = a.start >= b.start && a.end <= b.end;

    return aContainsB || bContainsA
}

const inRange = (num: number, range: Range) => {
    return num >= range.start && num <= range.end;
}

const overlaps = (a: Range, b: Range): boolean => {
    const aInB = inRange(a.start, b) || inRange(a.end, b);
    const bInA = inRange(b.start, a) || inRange(b.end, a);

    return aInB || bInA;
}

const solve1 = (input: Row[]): number => {
    return input.filter(([r1, r2]) => contained(r1, r2)).length;
}

const solve2 = (input: Row[]): number => {
    return input.filter(([r1, r2]) => overlaps(r1, r2)).length;
}

const main = () => {
    const contents = readFile("inputs/day4.txt");
    const rows = contents.split("\n");

    const input = rows.map(parseRanges);

    console.table({
        part1: solve1(input),
        part2: solve2(input),
    })
}

main();
