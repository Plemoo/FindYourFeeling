declare module 'rn-wordcloud' {
    import * as React from 'react';
  
    export interface Word {
      text: string;
      value: number;
      color: string;
    }
  
    export interface WordCloudOptions {
      fontFamily?: string;
      fontOffset?:number
      maxFont?:number;
      minFont?:number;
      verticalEnabled:boolean;
      words: Word[];
      height:number;
      width:number;

      fontSizes?: [number, number];
      fontStyle?: string;
      fontWeight?: string;
      padding?: number;
      rotations?: number;
      rotationAngles?: [number, number];
      scale?: 'linear' | 'log' | 'sqrt' | 'value';
      spiral?: 'archimedean' | 'rectangular';
      transitionDuration?: number;

    }
  
    export interface WordCloudCallbacks {
      onWordPress?: (word: Word, event?: MouseEvent) => void;
      
      onWordMouseOver?: (word: Word, event?: MouseEvent) => void;
      onWordMouseOut?: (word: Word, event?: MouseEvent) => void;
    }
  
    export interface ReactWordCloudProps extends WordCloudCallbacks {
      options?: WordCloudOptions;
    }
  
    const ReactWordCloud: React.FC<ReactWordCloudProps>;
  
    export default ReactWordCloud;
  }
  