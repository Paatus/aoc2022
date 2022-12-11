import {indexBy, last, map, repeat, sort} from "ramda";
import {readFile} from "./utils";

type NumTransformer = (n: number) => number;
type Monkey = {
    id: number,
    items: number[];
    operation: NumTransformer;
    test: NumTransformer;
    inspections: number;
}
type Troop = { [key: number]: Monkey };

const parseId = (row: string): number => {
    const [,id] = row.split(" ");

    return parseInt(id);
}

const parseItems = (row: string): number[] => {
    const [,raw] = row.split(": ");

    return map(parseInt, raw.split(", "))
}

const parseOperation = (row: string): NumTransformer => {
    const [,raw] = row.split("new =");

    return (old: number) => {
        const expr = raw.replace("old", `${old}`);
        return eval(expr);
    };
}

const parseTest = (row: string, ifTrue: string, ifFalse: string): NumTransformer => {
    const [,raw] = row.split("divisible by ");
    const divisor = parseInt(raw)

    const t = parseInt(last(ifTrue));
    const f = parseInt(last(ifFalse));

    return (old: number) => {
        return old % divisor === 0 ? t : f;
    };
}

const parseMonkey = (raw: string): Monkey => {
    const lines = raw.split("\n");
    const id = parseId(lines[0]);
    const items = parseItems(lines[1]);
    const operation = parseOperation(lines[2]);
    const test = parseTest(lines[3], lines[4], lines[5]);

    return { id, items, operation, test, inspections: 0 };
}


const runTurn = (monkey: Monkey, troop: Troop) => {
    for (const item of monkey.items) {
        const itemVal = monkey.operation(item);
        const itemWorryLevel = Math.floor(itemVal / 3)
        const throwTo = monkey.test(itemWorryLevel)
        troop[throwTo].items.push(itemWorryLevel)
        monkey.inspections++;
    }
    monkey.items = [];
    return troop;
}


const runRound = (troop: Troop, index: number = 0): Troop => {
    if (index >= Object.keys(troop).length) {
        return troop;
    }
    const monkey = troop[index];
    const newTroop = runTurn(monkey, troop);
    return runRound(newTroop, index + 1);
};

const solve1 = (troop: Troop) => {
    const a = repeat(null, 20);
    const finalTroop = a.reduce((v, acc) => runRound(acc || v), troop);

    const activeMonkeys = sort((a: Monkey, b: Monkey) => b.inspections - a.inspections, Object.values(finalTroop));
    return activeMonkeys[0].inspections * activeMonkeys[1].inspections;
}

const main = () => {
    const contents = readFile("inputs/day11.txt");
    const monkeys = contents.split("\n\n");
    const troop: Troop = indexBy((m) => m.id, map(parseMonkey, monkeys));

    console.table({
        part1: solve1(troop)
    });
}

main();
