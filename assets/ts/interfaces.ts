interface CustomFlagDimension {
    customWidth?: number;
    customHeight?: number;
    square:boolean
}

interface INestedFeelings {
    name: string;
    sprichwort:ISprichwort
    children?: INestedFeelings[];
  }
interface ISprichwort {
    text: string;
    author: string;
}

interface IStoredFeelings{
    storedFeelings:ISingleStoreFeeling[]
}
interface ISingleStoreFeeling{
    name:string;
    count:number;
}
interface IWordCloudProps {
    word:string
    weight:number
    color:string
}