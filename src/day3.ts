import {compose, drop, join, map, splitAt, splitEvery, sum, take, tap, uniq} from 'ramda';
import { readFile } from './utils';

type Compartments = [string, string];

const getCompartments = (rucksack: string): Compartments => {
    const compartmentSize = rucksack.length / 2;
    return splitAt(compartmentSize, rucksack)
}

const priorityScore = (item: string) => {
    const isUpperCase = item.toLowerCase() !== item;
    if (isUpperCase) {
        return item.charCodeAt(0) - 38;
    } else {
        return item.charCodeAt(0) - 96;
    }
}

const findDupe = (compartments: Compartments): string => {
    const [c1, c2] = compartments;
    for(const a of c1) {
        if (c2.includes(a)) return a;
    }
    return '';
};

const solve1 = (input: Compartments[]): number => {
    return compose(
        sum,
        map(priorityScore),
        map(findDupe)
    )(input);
}

const solve2 = (input: Compartments[]): number => {
    return compose(
        sum,
        map(priorityScore),
        map(findGroupDupe),
        splitEvery(3)
    )(input)
}

const findGroupDupe = (compartments: Compartments[]) => {
    const rucksacks = map(join(''), compartments);

    const items: Record<string, number> = {};

    for (const rucksack of rucksacks) {
        for(const item of uniq([...rucksack])) {
            items[item] = items[item] ? items[item] + 1 : 1
        }
    }

    return Object.entries(items).sort((a, b) => b[1] - a[1])[0][0];
}

const main = () => {
    const contents = readFile("inputs/day3.txt");
    const rows = contents.split("\n");
    const compartments = map(getCompartments, rows);

    console.table({ part1: solve1(compartments), part2: solve2(compartments) });
};

main();
