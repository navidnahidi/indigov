import { Constituent } from '../models/constituents';

let constituents: Constituent[] = [];

export const getAllConstituents = (): Constituent[] => {
    return constituents;
};

export const addConstituent = (newConstituent: Constituent): void => {
    const existingConstituentIndex = constituents.findIndex(
        (constituent) => constituent.email === newConstituent.email
    );

    if (existingConstituentIndex !== -1) {
        // Merge duplicate constituent
        constituents[existingConstituentIndex] = {
            ...constituents[existingConstituentIndex],
            ...newConstituent,
        };
    } else {
        // Add new constituent
        constituents.push(newConstituent);
    }
};

export const getTotalConstituents = () => {
    return constituents.length;
}

export const getConstituentsChunk = (offset: number, limit: number) => {
    return constituents.slice(offset, offset + limit);
}

export const exportConstituentsToCsv = (): any => {
    return constituents;
};