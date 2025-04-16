import React from 'react';
import { Dimensions } from 'react-native';
import Svg, { Circle, ClipPath, Defs, G, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window'); // Bildschirmgröße

const GermanFlag: React.FC<CustomFlagDimension> = ({ customWidth, customHeight, square }) => {
    const svgWidth = customWidth ? customWidth : width * 0.5; // 80% der Bildschirmbreite
    const svgHeight = customHeight ? customHeight : svgWidth * 0.5; // Höhe im Verhältnis zur Breite (z.B. 50%)
    return (
        <>
            {square ?
                <Svg viewBox="0 0 60 30" width={svgWidth} height={svgHeight}>
                    <Rect width="60" height="10" fill="#000" />
                    <Rect y="10" width="60" height="10" fill="#D00" />
                    <Rect y="20" width="60" height="10" fill="#FFCE00" />
                </Svg>
                :
                <Svg width={svgWidth} height={svgWidth} viewBox="0 0 60 60">
                    <Defs>
                        <ClipPath id="clipCircle">
                            <Circle cx="30" cy="30" r="30" />
                        </ClipPath>
                    </Defs>

                    <G clipPath="url(#clipCircle)">
                        {/* Schwarz */}
                        <Rect y="0" width="60" height="20" fill="#000000" />
                        {/* Rot */}
                        <Rect y="20" width="60" height="20" fill="#DD0000" />
                        {/* Gold */}
                        <Rect y="40" width="60" height="20" fill="#FFCE00" />
                    </G>
                </Svg>

            }
        </>

    );
};

export default GermanFlag;