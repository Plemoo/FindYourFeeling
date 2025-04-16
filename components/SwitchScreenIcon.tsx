import { FONT_SIZES } from '@/assets/styles/constants'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'

const SwitchScreenIcon = ({currentRoute}: { currentRoute: ["FeelingsTracker" | "_sitemap"] }) => {
    const { t, i18n } = useTranslation();
    return (
        _.isEmpty(currentRoute) ? (
            <View style={{alignItems:"center"}}>
                <Svg height="30px" viewBox="0 0 24 24" width="30px" fill="#000000">
                    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </Svg>
                <Text style={{fontSize:FONT_SIZES.tiny, textAlign:"center"}}>{t("overviewPage")}</Text>
            </View>

        ) : (
            <View style={{alignItems:"center"}}>
                <Svg height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000">
                    <Path d="M680-120q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T760-280q0-33-23.5-56.5T680-360q-33 0-56.5 23.5T600-280q0 33 23.5 56.5T680-200Zm-400-40q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T360-400q0-33-23.5-56.5T280-480q-33 0-56.5 23.5T200-400q0 33 23.5 56.5T280-320Zm160-240q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T520-720q0-33-23.5-56.5T440-800q-33 0-56.5 23.5T360-720q0 33 23.5 56.5T440-640Zm240 360ZM280-400Zm160-320Z" />
                </Svg>
                <Text style={{fontSize:FONT_SIZES.tiny, textAlign:"center"}}>{t("feelingPage")}</Text>
            </View>
        ))
}



export default SwitchScreenIcon