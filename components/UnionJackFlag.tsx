import React from 'react';
import { Dimensions, View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window'); // Bildschirmgröße

const UnionJackFlag: React.FC<CustomFlagDimension> = ({ customWidth, customHeight, square }) => {
    const svgWidth = customWidth ? customWidth : width * 0.5; // 80% der Bildschirmbreite
    const svgHeight = customHeight ? customHeight : svgWidth * 0.5; // Höhe im Verhältnis zur Breite (z.B. 50%)
    return (
        <>
            {square ?
                <Svg width={svgWidth} height={svgHeight} viewBox='0 0 60 30'>
                    <Rect width="60" height="30" fill="#012169" />
                    <Path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFF" strokeWidth="6" />
                    <Path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
                    <Rect x="25" width="10" height="30" fill="#FFF" />
                    <Rect y="10" width="60" height="10" fill="#FFF" />
                    <Rect x="26.5" width="7" height="30" fill="#C8102E" />
                    <Rect y="11.5" width="60" height="7" fill="#C8102E" />
                </Svg>
                :
                <Svg width={svgWidth} height={svgWidth} viewBox="0 0 60 60">
                    <Defs>
                        <ClipPath id="clipCircle1">
                            <Circle cx="30" cy="30" r="30" />
                        </ClipPath>
                    </Defs>

                    <G clipPath="url(#clipCircle1)">
                        <Rect width="60" height="60" fill="#012169" />

                        {/* Diagonale weiße Kreuze */}
                        <Path d="M0,0 L60,60 M60,0 L0,60" stroke="#FFF" strokeWidth="10" />
                        {/* Diagonale rote Kreuze */}
                        <Path d="M0,0 L60,60 M60,0 L0,60" stroke="#C8102E" strokeWidth="6" />

                        {/* Horizontales und vertikales weißes Kreuz */}
                        <Rect x="25" width="10" height="60" fill="#FFF" />
                        <Rect y="25" width="60" height="10" fill="#FFF" />

                        {/* Horizontales und vertikales rotes Kreuz */}
                        <Rect x="27" width="6" height="60" fill="#C8102E" />
                        <Rect y="27" width="60" height="6" fill="#C8102E" />
                    </G>
                </Svg>
            }
        </>
    );
};

export default UnionJackFlag;