import { Word } from "rn-wordcloud";

export const refactorFeelingIntoWord = (storedFeelingArray:ISingleStoreFeeling[],wordCloudColors:string[]):Word[]=>{
    const textKey:keyof Word = "text";
    const valueKey:keyof Word = "value";
    const colorKey:keyof Word = "color";
    return storedFeelingArray.map((feeling, index) => { return { [textKey]: feeling.name, [valueKey]: feeling.count, [colorKey]: wordCloudColors[index % wordCloudColors.length] } });
  }