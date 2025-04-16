import { Word } from "rn-wordcloud";
import { getFeelingById } from "./helper";

export const refactorFeelingIntoWord = (storedFeelingArray:ISingleStoreFeeling[],wordCloudColors:string[], allFeelings:INestedFeelings):Word[]=>{
    const feelingIntoWord = (feeling:ISingleStoreFeeling, index:number):Word => {
        let feelingName = getFeelingById(feeling.feelingId,allFeelings);
        return {
            text: feelingName != null?feelingName:"",
            value: feeling.count,
            color: wordCloudColors[index % wordCloudColors.length]
        }
    }
    return storedFeelingArray.map((feeling, index) => feelingIntoWord(feeling, index));
  }