import {sum} from "ramda";
import {readFile} from "./utils";

type OpponentHand = 'A' | 'B' | 'C';
type MyHand = 'X' | 'Y' | 'Z';
type Hand = OpponentHand | MyHand;

type Move = 'ROCK' | 'PAPER' | 'SCISSORS';
type Game = `${OpponentHand} ${MyHand}`;

type Outcome = 'WIN' | 'LOSE' | 'DRAW'

const toMove = (input: Hand): Move => {
    const map: Record<Hand, Move> = {
        A: 'ROCK',
        X: 'ROCK',

        B: 'PAPER',
        Y: 'PAPER',

        C: 'SCISSORS',
        Z: 'SCISSORS'
    };

    return map[input];
};

const MoveScore = (move: Move): number => {
    const map: Record<Move, number> = {
        ROCK: 1,
        PAPER: 2,
        SCISSORS: 3
    }
    return map[move];
}

const outcomeScore = (outcome: Outcome): number => {
    const map: Record<Outcome, number> = {
        WIN: 6,
        DRAW: 3,
        LOSE: 0
    }
    return map[outcome];

}

const getOutcome = (game: Game): Outcome => {
    const [opp, mine] = game.split(" ");

    const map: Record<Move, Record<Move, Outcome>> = {
        ROCK: { ROCK: 'DRAW', SCISSORS: 'LOSE', PAPER: 'WIN' },
        PAPER: { ROCK: 'LOSE', SCISSORS: 'WIN', PAPER: 'DRAW' },
        SCISSORS: { ROCK: 'WIN', SCISSORS: 'DRAW', PAPER: 'LOSE' },
    }

    return map[toMove(opp as Hand)][toMove(mine as Hand)];
}

const getMyMove = (game: Game): Move => {
    const [_, mine] = game.split(" ");

    return toMove(mine as Hand);
};

const getScore = (game: Game): number => {
    return MoveScore(getMyMove(game)) + outcomeScore(getOutcome(game));
}

const solve1 = (input: Game[]): number => {
    return sum(input.map(getScore))
}

const main = () => {
    const contents = readFile("inputs/day2.txt");
    console.log("contents", contents);
    const games = contents.split('\n') as Game[];

    console.log(solve1(games));
}

main();
