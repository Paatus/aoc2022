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

const toMyHand = (move: Move): MyHand => {
    const map: Record<Move, MyHand> = {
        PAPER: 'Y',
        ROCK: 'X',
        SCISSORS: 'Z'
    }
    return map[move];
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

const getBestMove = (opp: OpponentHand, desiredOutcome: Outcome): Move => {
    const map: Record<Move, Record<Outcome, Move>> = {
        'ROCK': { WIN: 'PAPER', LOSE: 'SCISSORS', DRAW: 'ROCK' },
        'PAPER': { WIN: 'SCISSORS', LOSE: 'ROCK', DRAW: 'PAPER' },
        'SCISSORS': { WIN: 'ROCK', LOSE: 'PAPER', DRAW: 'SCISSORS' }
    }
    return map[toMove(opp)][desiredOutcome];
}

const getMyMove2 = (game: Game) => {
    const map: Record<MyHand, Outcome> = {
        X: "LOSE",
        Y: "DRAW",
        Z: "WIN"
    }
    const [opp, mine] = game.split(" ");

    const wantedOutcome = map[mine as MyHand];

    return getBestMove(opp as OpponentHand, wantedOutcome);
};

const getMyMove = (game: Game): Move => {
    const [_, mine] = game.split(" ");

    return toMove(mine as Hand);
};

const getScore = (game: Game): number => {
    return MoveScore(getMyMove(game)) + outcomeScore(getOutcome(game));
}

const getScore2 = (game: Game): number => {
    const myMove = getMyMove2(game);
    const [opp, ] = game.split(" ")
    const desiredGame: Game = `${opp as OpponentHand} ${toMyHand(myMove)}`
    return MoveScore(getMyMove2(game)) + outcomeScore(getOutcome(desiredGame));
}

const solve1 = (input: Game[]): number => {
    return sum(input.map(getScore))
}

const solve2 = (input: Game[]): number => {
    return sum(input.map(getScore2))
}

const main = () => {
    const contents = readFile("inputs/day2.txt");
    const games = contents.split('\n').filter(Boolean) as Game[];

    console.table({ part1: solve1(games), part2: solve2(games) });
}

main();
