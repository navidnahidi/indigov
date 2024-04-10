import { Constituent } from '../../models/constituents';
import { normalizeEmail } from '../../utils/normalizers';

let constituents: Constituent[] = [];

export const getAllConstituents = (): Constituent[] => {
    return constituents;
};

export const addConstituent = (newConstituent: Constituent): void => {
    const newConstituentEmail = normalizeEmail(newConstituent.email);
    const existingConstituentIndex = constituents.findIndex(
        (constituent) => constituent.email === newConstituentEmail
    );

    if (existingConstituentIndex !== -1) {
        constituents[existingConstituentIndex] = {
            ...constituents[existingConstituentIndex],
            ...newConstituent,
            email: newConstituentEmail,
        };
    } else {
        constituents.push({
            ...newConstituent,
            email: newConstituentEmail
        });
    }
};

export const getTotalConstituents = () => {
    return constituents.length;
}

export const getConstituentsChunk = (offset: number, limit: number) => {
    return constituents.slice(offset, offset + limit);
}