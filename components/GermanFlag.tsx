import React from 'react';
import { Dimensions } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window'); // Bildschirmgröße

const GermanFlag: React.FC<CustomFlagDimension> = ({customWidth,customHeight}) => {
    const svgWidth = customWidth ? customWidth : width * 0.5; // 80% der Bildschirmbreite
    const svgHeight = customHeight ? customHeight : svgWidth * 0.5; // Höhe im Verhältnis zur Breite (z.B. 50%)
    return (
        <Svg viewBox="0 0 60 30" width={svgWidth} height={svgHeight}>
            <Rect width="60" height="10" fill="#000" />
            <Rect y="10" width="60" height="10" fill="#D00" />
            <Rect y="20" width="60" height="10" fill="#FFCE00" />
        </Svg>
    );
};

export default GermanFlag;