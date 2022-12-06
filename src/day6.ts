import {uniq} from "ramda";
import {readFile} from "./utils";

const findEndOfFirstMarker = (packet: string, length: number) => {
    for(let i = 0; i < packet.length - (length - 1); i++) {
        const potentialMarker = packet.substring(i, i + length);
        if (uniq([...potentialMarker]).length === length) {
            return i + length;
        }
    }
}

const main = () => {
    const input = readFile("inputs/day6.txt");
    console.table({
        part1: findEndOfFirstMarker(input, 4),
        part2: findEndOfFirstMarker(input, 14)
    })
};

main();
