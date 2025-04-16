import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPathOfFeeling } from "./indexFunctions";
import _, { forEach } from "lodash";

export async function storeFeelingInAsyncStorage(storedFeelings:ISingleStoreFeeling[]){
    let storedFeelingsKey: keyof IStoredFeelings = "storedFeelings";
    let newStoredFeelings:IStoredFeelings = {[storedFeelingsKey]:storedFeelings}
    return await AsyncStorage.setItem(storedFeelingsKey, JSON.stringify(newStoredFeelings));
}

export async function getStoredFeelingsAsync():Promise<IStoredFeelings|null>{
    let storedFeelingsKey: keyof IStoredFeelings = "storedFeelings";
    let storedFeelingsString = await AsyncStorage.getItem(storedFeelingsKey);
    if(storedFeelingsString != null){
        let storedFeelings:IStoredFeelings = JSON.parse(storedFeelingsString)
        return storedFeelings;
    }else{
        return null;
    }
}

export function getFeelingById(feelingId:number, allFeelings:INestedFeelings):string|null{
    const findObjByIdRec = (id:number, obj:INestedFeelings):INestedFeelings|null => {
        if(_.isNil(obj)){
            return null;
        }if(obj.id === id){
            return obj;
        }else if(obj.children){
            for(let child of obj.children){
                let childSubtreeFinding = findObjByIdRec(id, child);
                if(childSubtreeFinding != null){
                    return childSubtreeFinding
                }
            }
        }
        return null;
    }
    const feelingObj = findObjByIdRec(feelingId,allFeelings);
    if(feelingObj != null){
        return feelingObj.name
    }else{
        return null;
    }
}
export function getIdByFeeling(feeling:string, allFeelings:INestedFeelings){
    let pathToFeeling = getPathOfFeeling(feeling,allFeelings);
    if(pathToFeeling != null){
        let feelingObject:INestedFeelings = _.get(allFeelings,_.dropRight(pathToFeeling));
        if(feelingObject){
            return feelingObject.id;
        }
    }
}
