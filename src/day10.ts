import {compose, filter, head, join, map, product, reject, sort, splitEvery, sum, tail, take} from "ramda";
import {readFile} from "./utils";

type Instruction = { type: 'noop', doneAt?: number } | { type: 'addx', doneAt?: number, value: number };

const parseInstructions = (rows: string[]): Instruction[] => {
    return rows.map(row => {
    if (row.startsWith("noop")) {
        return { type: 'noop' };
    } else {
        const [, n] = row.split(' ');
        const value = parseInt(n);
        return { type: "addx", value }
    }
    });
};

const exampleInput = [
"noop",
"addx 3",
"addx -5"
];

const largeExample = [
"addx 15",
"addx -11",
"addx 6",
"addx -3",
"addx 5",
"addx -1",
"addx -8",
"addx 13",
"addx 4",
"noop",
"addx -1",
"addx 5",
"addx -1",
"addx 5",
"addx -1",
"addx 5",
"addx -1",
"addx 5",
"addx -1",
"addx -35",
"addx 1",
"addx 24",
"addx -19",
"addx 1",
"addx 16",
"addx -11",
"noop",
"noop",
"addx 21",
"addx -15",
"noop",
"noop",
"addx -3",
"addx 9",
"addx 1",
"addx -3",
"addx 8",
"addx 1",
"addx 5",
"noop",
"noop",
"noop",
"noop",
"noop",
"addx -36",
"noop",
"addx 1",
"addx 7",
"noop",
"noop",
"noop",
"addx 2",
"addx 6",
"noop",
"noop",
"noop",
"noop",
"noop",
"addx 1",
"noop",
"noop",
"addx 7",
"addx 1",
"noop",
"addx -13",
"addx 13",
"addx 7",
"noop",
"addx 1",
"addx -33",
"noop",
"noop",
"noop",
"addx 2",
"noop",
"noop",
"noop",
"addx 8",
"noop",
"addx -1",
"addx 2",
"addx 1",
"noop",
"addx 17",
"addx -9",
"addx 1",
"addx 1",
"addx -3",
"addx 11",
"noop",
"noop",
"addx 1",
"noop",
"addx 1",
"noop",
"noop",
"addx -13",
"addx -19",
"addx 1",
"addx 3",
"addx 26",
"addx -30",
"addx 12",
"addx -1",
"addx 3",
"addx 1",
"noop",
"noop",
"noop",
"addx -9",
"addx 18",
"addx 1",
"addx 2",
"noop",
"noop",
"addx 9",
"noop",
"noop",
"noop",
"addx -1",
"addx 2",
"addx -37",
"addx 1",
"addx 3",
"noop",
"addx 15",
"addx -21",
"addx 22",
"addx -6",
"addx 1",
"noop",
"addx 2",
"addx 1",
"noop",
"addx -10",
"noop",
"noop",
"addx 20",
"addx 1",
"addx 2",
"addx 2",
"addx -6",
"addx -11",
"noop",
"noop",
"noop"
]

const exampleInstructions = parseInstructions(exampleInput);

const addInstruction = (instruction: Instruction, value: number) => {
    let total = value;
    if (instruction.type === 'addx') {
        total += instruction.value;
    }
    return total;
};

const walkInstructions = (instructions: Instruction[], value: number = 1, cycle: number = 1, acc: [number, number][] = []): [number, number][] => {
    if (instructions.length === 0) {
        return acc;
    }
    const currentInstruction = head(instructions)!;

    if (currentInstruction.doneAt === undefined) {
        if(currentInstruction.type === 'addx') {
            currentInstruction.doneAt = cycle + 1;
        } else if (currentInstruction.type === 'noop') {
            currentInstruction.doneAt = cycle;
        }
    }

    if (currentInstruction.doneAt && currentInstruction.doneAt == cycle) {
        const newValue = addInstruction(currentInstruction, value);
        return walkInstructions(tail(instructions), newValue, cycle + 1, [...acc, [cycle, newValue]]);
    }

    return walkInstructions(instructions, value, cycle + 1, [...acc, [cycle, value]])
};

const signalStrength = (entry: [number, number]): number => {
    const [cycle, value] = entry;
    return (cycle + 1) * value;
}

const solve1 = (instructions: Instruction[]): number => {
    const res = walkInstructions(instructions);
    const values = map(signalStrength, [res[18], res[58], res[98], res[138], res[178], res[218]])
    return sum(values);
}

const paintPixel = (pixelIndex: number, spritePosition: number) => {
    let index = pixelIndex;
    while(index > 40) {
        index = index - 40;
    }
    return index >= spritePosition && index <= spritePosition + 2 ? "#" : " ";
}

const paintRows = (instructions: Instruction[], value: number = 1, cycle: number = 1, acc: string = ""): string => {
    if (instructions.length === 0) {
        return acc;
    }
    const currentInstruction = head(instructions)!;

    if (currentInstruction.doneAt === undefined) {
        if(currentInstruction.type === 'addx') {
            currentInstruction.doneAt = cycle + 1;
        } else if (currentInstruction.type === 'noop') {
            currentInstruction.doneAt = cycle;
        }
    }

    if (currentInstruction.doneAt && currentInstruction.doneAt == cycle) {
        const newValue = addInstruction(currentInstruction, value);
        const newAcc = `${acc}${paintPixel(cycle, value)}`;
        return paintRows(tail(instructions), newValue, cycle + 1, newAcc);
    }

    const newAcc = `${acc}${paintPixel(cycle, value)}`;
    return paintRows(instructions, value, cycle + 1, newAcc);
};

const solve2 = (instructions: Instruction[]) => {
    const res = paintRows(instructions);
    return join(`\n`,splitEvery(40, res));
}

const main = () => {

    const contents = readFile("inputs/day10.txt");
    const rows = contents.split("\n");

    const instructions = parseInstructions(rows);

    console.table({
        part1: solve1(instructions),
    });
    console.log("part2")
    console.log(solve2(instructions))
};

main();
