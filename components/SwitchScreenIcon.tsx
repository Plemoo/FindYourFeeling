import { FONT_SIZES } from '@/assets/styles/constants'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import Icon from 'react-native-vector-icons/Ionicons';

const SwitchScreenIcon = ({currentRoute}: { currentRoute: ["FeelingsTracker" | "_sitemap"] }) => {
    const { t, i18n } = useTranslation();
    return (
        _.isEmpty(currentRoute) ? (
            <View style={{alignItems:"center"}}>
                <Icon name='cloudy-outline' size={40}/>
                <Text style={{fontSize:FONT_SIZES.tiny, textAlign:"center"}}>{t("overviewPage")}</Text>
            </View>

        ) : (
            <View style={{alignItems:"center"}}>
                <Icon name='fitness-outline' size={40}/>
                <Text style={{fontSize:FONT_SIZES.tiny, textAlign:"center"}}>{t("feelingPage")}</Text>
            </View>
        ))
}



export default SwitchScreenIcon