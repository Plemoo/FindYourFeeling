import AsyncStorage from "@react-native-async-storage/async-storage";

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
