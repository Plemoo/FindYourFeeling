import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Dimensions } from 'react-native';
import Svg, { Text } from 'react-native-svg';
import _ from 'lodash';
import { COLORS } from '@/assets/styles/constants';

const { width, height } = Dimensions.get("window");
  
  type PositionedWord = {
    x: number;
    y: number;
    rotation: 0 | 90;
    fontSize: number;
    color: string;
    word: string;
    width: number;
    height: number;
  };
  
  function generateWordCloud(wordList:IWordCloudProps[]): PositionedWord[] {
    const positions: PositionedWord[] = [];
    const cellSize = 45;
    const customWidth = Math.round(width);
    const customHeight = Math.round(height);
    // Teile die verfügbare Fläche in ein Grid auf
    const cols = Math.floor(customWidth / cellSize);
    const rows = Math.floor(customHeight / cellSize);
    // Wähle den Mittelpunkt des Grids
    const centerX = Math.floor(cols / 2);
    const centerY = Math.floor(rows / 2);
    // Array mit false Einträgen grid.length == rows;  grid[x].length == cols
    const grid: boolean[][] = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(false));

    const isFree = (x: number, y: number, w: number, h: number) => {
      if (x < 0 || y < 0 || x + w > cols || y + h > rows) return false;
      for (let dy = 0; dy < h; dy++) {
        for (let dx = 0; dx < w; dx++) {
          if (grid[y + dy]?.[x + dx]) return false;
        }
      }
      return true;
    };
  
    const markUsed = (x: number, y: number, w: number, h: number) => {
      for (let dy = 0; dy < h; dy++) {
        for (let dx = 0; dx < w; dx++) {
          grid[y + dy][x + dx] = true;
        }
      }
    };
  
    // spiralförmige Suche
    const spiralOffsets = [];
    const maxSpiral = Math.max(cols, rows);
    for (let d = 0; d < maxSpiral; d++) {
      for (let dx = -d; dx <= d; dx++) {
        for (let dy = -d; dy <= d; dy++) {
          if (Math.abs(dx) === d || Math.abs(dy) === d) {
            spiralOffsets.push([dx, dy]);
          }
        }
      }
    }
    for (let wordObj of wordList) {
      const fontSize = 12 + wordObj.weight * 4;
      const rotation: 0 | 90 = Math.random() > 0.5 ? 0 : 90;
      const length = wordObj.word.length;
  
      const wordWidth = rotation === 0 ? length : 1; // 1 oder Wortläge
      const wordHeight = rotation === 0 ? 1 : length; // 1 oder Wortlänge
      console.log("HW",wordHeight,wordWidth)
      let placed = false;
      for (let [dx, dy] of spiralOffsets) {
        const x = centerX + dx; // dx punkte von der Mitte in x-Achse (cellSize ist ein Punkt)
        const y = centerY + dy; // dy punkte von der Mitte in y-Achse (cellSize ist ein Punkt)
        if(placed){
          // console.log(wordObj.word)
          break;
        }
        // console.log("xy",x,y)
        if (isFree(x, y, wordWidth, wordHeight)) {
          // console.log("FREE",wordObj.word)
          const px = x * cellSize + cellSize / 2;
          const py = y * cellSize + cellSize / 2;
          // Begrenzung prüfen (visuell)
          const wPixels = wordWidth * cellSize;
          const hPixels = wordHeight * cellSize;
          console.log("WIDTH",x,px,wPixels, width)
          console.log("HEIGHT",y,py,hPixels, height)
          // console.log("SUM W",px - wPixels / 2)
          // console.log("SUM H",py - hPixels / 2)

          if (
            px - wPixels / 2 >= 0 &&
            px + wPixels / 2 <= width &&
            py - hPixels / 2 >= 0 &&
            py + hPixels / 2 <= height
          ) {
            console.log("FOUND",wordObj.word)

            markUsed(x, y, wordWidth, wordHeight);
            positions.push({
              x: px,
              y: py,
              rotation,
              fontSize,
              word: wordObj.word,
              color: wordObj.color,
              width: wPixels,
              height: hPixels,
            });
            placed = true;
          }
        }
      }
    }
    // console.log("Pos",grid)
    return positions;
  }

  type WordCloudProps = {
    wordCloudFeelings: ISingleStoreFeeling[];
  }



const WordCloud: React.FC<WordCloudProps> = ({wordCloudFeelings}) => {
    const [wordsPositioned, setWordsPositioned] = useState<PositionedWord[]>([]);
    useEffect(() => {
      const wordCloudColors = [COLORS.feelingCenter, COLORS.feelingOne, COLORS.feelingTwo, COLORS.feelingThree, COLORS.feelingFour];
      let wordCloudWords: IWordCloudProps[] = wordCloudFeelings.map((word) => ({
        word: word.name,
        weight: word.count,
        color: wordCloudColors[_.random(0,wordCloudColors.length-1)], // Zufällige Farbe aus dem Array
      }));
      const layout = generateWordCloud(wordCloudWords);
      setWordsPositioned(layout);
    }, []);
    return (
      <View style={{ flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" }}>
        <Svg width={width} height={height}>
          {wordsPositioned.map((w, idx) => (
            <Text
              key={idx}
              x={w.x}
              y={w.y}
              fill={w.color}
              fontSize={w.fontSize}
              textAnchor="middle"
              alignmentBaseline="middle"
              transform={`rotate(${w.rotation}, ${w.x}, ${w.y})`}
            >
              {w.word}
            </Text>
          ))}
        </Svg>
      </View>
    );
}

export default WordCloud


// const fontSize = 24; // z. B.
// const averageCharWidth = fontSize * 0.6; // grobe Faustregel für normale Fonts
// const textWidth = word.length * averageCharWidth;
// const textHeight = fontSize; // einfache Annahme