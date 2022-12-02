import { compose, drop, head, map, prop, sort, sum, take, takeWhile } from 'ramda';
import {readFile} from './utils';

interface Elf {
    totalCalories: number;
    foodCalories: number[];
}

const parseInput = (input: string[], acc: Elf[] = []): Elf[] => {
    if (input.length === 0) {
        return acc;
    }
    const foodStrings = takeWhile(s => s !== '', input);

    const foodCalories: number[] = map(Number, foodStrings);
    const elf: Elf = {
        foodCalories,
        totalCalories: sum(foodCalories),
    }

    acc.push(elf);

    return parseInput(drop(foodCalories.length + 1, input), acc);
}

const solve1 = (input: Elf[]): number => {
    const sorted = sort((a: Elf, b: Elf) => b.totalCalories - a.totalCalories, input);

    return compose(compose(Number, prop('totalCalories')), head)(sorted);
};

const solve2 = (input: Elf[]): number => {
    const sorted = sort((a: Elf, b: Elf) => b.totalCalories - a.totalCalories, input);

    return compose(
        sum,
        map(compose(Number, prop('totalCalories'))),
        take(3),
    )(sorted);
};

const main = () => {
    const contents = readFile("inputs/day1.txt");
    const calories = contents.split('\n');
    const elves = parseInput(calories);

    const answer1 = solve1(elves);
    const answer2 = solve2(elves);

    console.table({ part1: answer1, part2: answer2 })
}

main();
