import Chapter from "./chapter.interface";

export default interface Unit {
    unitId: number;
    unitName: string;
    chapters: Chapter[];
}