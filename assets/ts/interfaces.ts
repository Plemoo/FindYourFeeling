/* eslint-disable @typescript-eslint/no-unused-vars */
declare global {
  interface INestedFeelings {
    id: number;
    key: string;
    name: string;
    description?: string;
    children?: INestedFeelings[];
  }

  interface IFeelingReference {
    key: string;
    customLabel?: string;
  }

  interface IFeelingCheckIn {
    id: string;
    feeling: IFeelingReference;
    intensity: number;
    additionalFeelings: IFeelingReference[];
    needs: string[];
    createdAt: string;
    migrated?: boolean;
  }

  interface IStoredCheckIns {
    version: 2;
    checkIns: IFeelingCheckIn[];
  }

  interface ISingleStoreFeeling {
    feelingId: number;
    count: number;
  }

  interface ILegacyStoredFeelings {
    storedFeelings: ISingleStoreFeeling[];
  }
}

export {};
