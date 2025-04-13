import React, { useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Text as SvgText, Text, TextPath } from 'react-native-svg';
import Colors from 'color';
import { useTranslation } from "react-i18next";   
import { COLORS, FONT_SIZES } from '@/assets/styles/constants';
import { styles } from '@/assets/styles/styles';

// Erzeugt einen Bogenpfad (ohne den Abschluss, für Text oder Stroke)
const createArcPath = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
  const rad = (angle: number) => (angle * Math.PI) / 180;
  const x1 = cx + r * Math.cos(rad(startAngle));
  const y1 = cy + r * Math.sin(rad(startAngle));
  const x2 = cx + r * Math.cos(rad(endAngle));
  const y2 = cy + r * Math.sin(rad(endAngle));
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
};

type DonutChartProps = {
  words: string[];   // Ein Wort pro Segment
  centerText: string; // Text in der Mitte
  randomizer: number;
  clickedFeeling:(value: string) => void;
  allFeelings:INestedFeelings
};

const DonutChart: React.FC<DonutChartProps> = ({ words, centerText, randomizer, clickedFeeling, allFeelings}) => {
  // Hier definieren wir die Größe des Donut-Diagramms
  const size = 350;             // Gesamtgröße der SVG
  const cx = size / 2;          // X-Zentrum
  const cy = size / 2;          // Y-Zentrum
  const outerR = size / 2;      // Äußerer Radius
  const thickness = 80;         // Dicke des Rings
  // Wir zeichnen entlang der Mittellinie des Rings:
  const midR = outerR - thickness / 2;

  const segments = words.length;        // Anzahl der Segmente
  const angleStep = 360 / segments;       // Winkel pro Segment
  const gapAngle = 40;                     // Gap in Grad zwischen den Segmenten (klein halten für runde Enden)

  // Beispiel-Farben (kannst du anpassen)
  const [colors, setColors] = useState<string[]>([COLORS.feelingOne, COLORS.feelingTwo, COLORS.feelingThree, COLORS.feelingFour]);
  const [lastFeelingColor, setLastFeelingColor] = useState<string>(COLORS.feelingCenter);
  const { t } = useTranslation();

  const lightenColorOnClick = (i:number) =>{
    let oldColors = [...colors]
    let lighterColors = colors.map((val,index)=>i == index ? Colors(colors[index]).lighten(0.15).hex():val);
    setColors(lighterColors);
    setTimeout(()=>{
      setColors(oldColors);
      clickedFeeling(words[i])
    },300)
  }

  const lightenLastFeelingColorOnClick = () =>{
    if(centerText == allFeelings.name){ // Wenn der Text in der Mitte der Donut gedrückt wird, dann nichts tun
      return;
    }
    let oldColor = lastFeelingColor+"";
    let lighterColors = Colors(lastFeelingColor).lighten(0.15).hex()
    setLastFeelingColor(lighterColors);
    setTimeout(()=>{
      setLastFeelingColor(oldColor);
      clickedFeeling(centerText)
    },300)
  }

  return (
    <View style={styles.svgFeelingsContainer}>
      <Svg width={size} height={size}> 
      {words.map((word, i) => {
          // Berechne Start- und Endwinkel, sodass ein kleiner Gap entsteht:
          const startAngle = (i * angleStep + gapAngle / 2) + randomizer;
          const endAngle = ((i + 1) * angleStep - gapAngle / 2)+ randomizer;
          const arcPath = createArcPath(cx, cy, midR, startAngle, endAngle);
          const pathId = `arcPath-${i}`;
          
          return (
            <React.Fragment key={i}>
              {/* Zeichnet das Segment als Stroke-Bogen entlang der Mittellinie */}
              <Path
                d={arcPath}
                stroke={colors[i % colors.length]}
                strokeWidth={thickness}
                strokeLinecap="round"
                fill="none"
                onPressIn={() => lightenColorOnClick(i)}
              />
              {/* Unsichtbarer Pfad für den Text */}
              <Path id={pathId} d={arcPath} fill="none" stroke="none" onPressIn={() => lightenColorOnClick(i)}/>
              {/* Text entlang des Pfades */}
              <SvgText fontSize="16" fill="black" textAnchor='middle'  fontFamily='Raleway'>
                <TextPath href={`#${pathId}`} startOffset={'50%'} fontFamily='Raleway'>
                  {word}
                </TextPath>
              </SvgText>
            </React.Fragment>
          );
        })}
        {/* Zentrales Textelement */}
        <Circle
          cx={cx}
          cy={cy}
          r={70}
          fill={lastFeelingColor}
          onPressIn={()=>lightenLastFeelingColorOnClick()}
        />

        <Text
          x={cx}
          y={cy+5}
          fontSize={FONT_SIZES.medium}
          fill={COLORS.text}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontFamily='Raleway'
          onPressIn={()=>lightenLastFeelingColorOnClick()}
        >
          {centerText}
        </Text>
        <Text
          x={cx}
          y={cy+20}
          fontSize={FONT_SIZES.tiny}
          fill={COLORS.text}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontFamily='Raleway'
          onPressIn={()=>lightenLastFeelingColorOnClick()}
          >
            {centerText == allFeelings.name ? "": "("+t("back")+")"}
          </Text>
      </Svg>
    </View>
  );
};
export default DonutChart;