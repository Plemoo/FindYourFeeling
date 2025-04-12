import React from 'react';
import { Dimensions } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window'); // Bildschirmgröße

const UnionJackFlag: React.FC<CustomFlagDimension> = ({customWidth, customHeight}) => {
    const svgWidth = customWidth ? customWidth : width * 0.5; // 80% der Bildschirmbreite
    const svgHeight = customHeight ? customHeight : svgWidth * 0.5; // Höhe im Verhältnis zur Breite (z.B. 50%)
    return (
        <Svg width={svgWidth} height={svgHeight} viewBox='0 0 60 30'>
            <Rect width="60" height="30" fill="#012169" />
            <Path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFF" strokeWidth="6" />
            <Path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
            <Rect x="25" width="10" height="30" fill="#FFF" />
            <Rect y="10" width="60" height="10" fill="#FFF" />
            <Rect x="26.5" width="7" height="30" fill="#C8102E" />
            <Rect y="11.5" width="60" height="7" fill="#C8102E" />
        </Svg>
    );
};

export default UnionJackFlag;