interface CustomFlagDimension {
    customWidth?: number;
    customHeight?: number;
}

interface INestedFeelings {
    name: string;
    sprichwort:{text:string,author:string};
    children?: INestedFeelings[];
  }
