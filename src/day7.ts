import { compose, drop, dropLast, head, join, last, map, reject, sort, split, startsWith, sum, tail, takeWhile } from "ramda";
import { readFile } from "./utils";

type CommandType = { type: 'CD', destination: string } | { type: 'LS' };

const exampleInput = [
  "$ cd /",
  "$ ls",
  "dir a",
  "14848514 b.txt",
  "8504156 c.dat",
  "dir d",
  "$ cd a",
  "$ ls",
  "dir e",
  "29116 f",
  "2557 g",
  "62596 h.lst",
  "$ cd e",
  "$ ls",
  "584 i",
  "$ cd ..",
  "$ cd ..",
  "$ cd d",
  "$ ls",
  "4060174 j",
  "8033020 d.log",
  "5626152 d.ext",
  "7214296 k"
];

const dirMap = new Map<string, number>();
const dirStack: string[] = [];

const commandType = (input: string): CommandType => {
  if (input.startsWith("$ cd")) {
    return { type: 'CD', destination: input.slice(5) };
  }
  return { type: 'LS' }
}

const constructNewPath = (current: string, destination: string): string => {
  switch (destination) {
    case '/':
      return '/'
    case '..':
      return join('/', dropLast(1, split('/', current)))
    default:
      return `${current === '/' ? current : `${current}/`}${destination}`
  }
};

const getDirSize = (items: string[]): number => {
  return compose(
    sum,
    map(compose(parseInt, head, split(' '))),
    reject(startsWith('dir'))
  )(items);
}

const walk = (input: string[], currentPath: string): void => {
  if (!input.length) return;
  const currentCommand = head(input)!;
  const command = commandType(currentCommand);
  if (command.type === 'CD') {
    const newPath = constructNewPath(currentPath, command.destination);
    return walk(tail(input), newPath);
  }
  // otherwise it's an LS 
  const outputs = takeWhile((s: string) => !s.startsWith('$'), tail(input));
  if (dirMap.has(currentPath)) {
    console.log("Should maybe optimize this?");
  }
  dirMap.set(currentPath, getDirSize(outputs));
  const newInput = drop<string>(outputs.length + 1)(input);
  return walk(newInput, currentPath);
}

const totalFolderSize = (folderName: string): number => {
  const entries = [...dirMap.entries()];

  const m = reject(([p, _]) => !p.startsWith(folderName))(entries);
  const v = map(([_, v]) => v, m)
  return sum(v);
}

const solve1 = (input: string[]) => {
  walk(input, '');
  const totalSizes = map(([p]) => totalFolderSize(p), [...dirMap.entries()]);
  return compose(
    sum,
    reject((v: number) => v > 100000)
  )(totalSizes);
};

const solve2 = () => {
  // Abuse the fact that we have a global variable of the sizes
  const fsSize = 70000000;
  const requiredSize = 30000000;
  const rootSize = totalFolderSize("/");
  const missingSize = fsSize - rootSize;
  const neededSize = requiredSize - missingSize;
  console.log(neededSize);

  const totalSizes = map((p) => totalFolderSize(p), [...dirMap.keys()]);
  return compose(
    head,
    sort((a: number, b: number) => a - b),
    reject((v: number) => v < neededSize)
  )(totalSizes);
}

const main = () => {
  const contents = readFile("inputs/day7.txt");
  const input = contents.split("\n");

  console.table({
    part1: solve1(input),
    part2: solve2()
  });
};

main();
