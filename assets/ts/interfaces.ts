interface CustomFlagDimension {
    customWidth?: number;
    customHeight?: number;
    square:boolean
}

interface INestedFeelings {
    id:number;
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
    feelingId:number;
    count:number;
}
interface IWordCloudProps {
    word:string
    weight:number
    color:string
}