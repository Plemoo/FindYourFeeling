import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { getFeelingCheckInsAsync } from "@/assets/ts/helper";
import { COLORS } from "@/assets/styles/constants";
import FeelingWordCloud from "@/components/FeelingWordCloud";

export default function FeelingsTracker() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [checkIns, setCheckIns] = useState<IFeelingCheckIn[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setIsLoaded(false);
      getFeelingCheckInsAsync()
        .then((value) => {
          if (active) setCheckIns(value);
        })
        .finally(() => {
          if (active) setIsLoaded(true);
        });
      return () => {
        active = false;
      };
    }, [])
  );

  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return <FeelingWordCloud checkIns={checkIns} />;
}
