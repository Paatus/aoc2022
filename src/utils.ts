import {readFileSync} from "fs";

export const readFile = (path: string) => {
    const fileContents = readFileSync(path, "utf-8");

    return fileContents.trimEnd();
}

