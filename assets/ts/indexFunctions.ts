import _ from "lodash";
import allFeelingsDe from "../../assets/json/feelings_de.json";
import allFeelingsEn from "../../assets/json/feelings_en.json";
import { LANGUAGE } from "../styles/constants";

export function getPathOfFeeling(feeling: string, allFeelings: INestedFeelings): string[] | null {
    return findPathForNameInFeelings(allFeelings, (val) => val === feeling, "name"); // Beispiel: Suche den Pfad für den Wert "Berlin"
}


export const getChildFeelingsBasedOnParent = (parent: string, allFeelings: INestedFeelings): string[] => {
    let newFeelings = findNodeChildren(allFeelings, parent);
    if (newFeelings) {
        return newFeelings.map(val => val.name);
    } else {
        return [];
    }
}
export const arraysEqual = (a: any[], b: any[]): boolean => {
    if (a.length !== b.length) return false;
    return a.every((element, index) => element === b[index]);
};


// Rekursive Funktion, die die Kinder eines Knotens anhand des Namens findet
export function findNodeChildren(root: INestedFeelings, target: string): INestedFeelings[] | undefined {
    if (root.name === target) {
        if (root.children) {
            return root.children;
        }
    }
    if (root.children) {
        for (const child of root.children) {
            const result = findNodeChildren(child, target);
            if (result !== undefined) {
                return result;
            }
        }
    }
    return undefined;
}

export function getFeelingsBasedOnLanguage(language: string): INestedFeelings {
    let allFeelings: INestedFeelings = allFeelingsDe;
    if (language === LANGUAGE.english) {
        allFeelings = allFeelingsEn;
    } else if (language === LANGUAGE.german) {
        allFeelings = allFeelingsDe;
    }
    return allFeelings;
}

/**
 * 
 * @param obj is the recursive object to search in. It is either an array of INestedFeelings or a single INestedFeelings object.
 * @param predicate 
 * @param path 
 * @param searchKey The key to search for in the object;
 * @returns 
 */
function findPathForNameInFeelings (obj: INestedFeelings[]|INestedFeelings, predicate: (nameValueToSearch: string) => boolean, searchKey:keyof INestedFeelings, path: string[] = []): string[] | null  {
    for (const key in obj) {
        const nestedChildrenKey: keyof INestedFeelings = "children";
        const newPath = [...path, key]; // Aktuellen Pfad erweitern
        if(_.isArray(obj)){ // Wenn es ein Array ist, den Index als Zahl verwenden (wurde gerade in children reingegangen) (Pfad kann noch nciht gefunden worden sein)
            let arrayIndex = _.toInteger(key)
            const deepPath = findPathForNameInFeelings(obj[arrayIndex], predicate,searchKey, newPath);
            if (deepPath) return deepPath; // Falls in der Tiefe gefunden → Pfad zurückgeben
        }else if(_.isPlainObject(obj) && key === searchKey && _.isString(obj[key]) && predicate(obj[key])){ // Wenn es ein PlainObject ist, prüfen, ob mit dem Key der gesuchte wert gefunden wurde (geprüft über predicate)
            return newPath; // Wert gefunden → Pfad zurückgeben
        }else if(_.isPlainObject(obj) && key === nestedChildrenKey && _.isArray(obj[key])){ // Ist Object und key ist children und children ist ein Array und Wert wurde noch nicht gefunden
            let nestedFeelingSubtree: INestedFeelings[] = obj[key];
            const deepPath = findPathForNameInFeelings(nestedFeelingSubtree, predicate,searchKey, newPath);
            if (deepPath) return deepPath; // Falls in der Tiefe gefunden → Pfad zurückgeben    
        }
    }
    return null; // Wert nicht gefunden
};
