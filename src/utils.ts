import {readFileSync} from "fs";

export const sleep = async (ms: number): Promise<void> => {
    await new Promise((res) => setTimeout(res, ms));
}

export const readFile = (path: string) => {
    const fileContents = readFileSync(path, "utf-8");

    return fileContents.trimEnd();
}

