import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "storedFeelings";

const LEGACY_ID_TO_KEY: Record<number, string> = {
  2: "family.joy",
  3: "joy.happy",
  4: "calm.content",
  5: "calm.free",
  6: "joy.cheerful",
  11: "joy.proud",
  13: "connection.appreciated",
  22: "interest.interested",
  23: "interest.curious",
  24: "interest.inspired",
  25: "interest.hopeful",
  26: "interest.surprised",
  27: "interest.excited",
  29: "family.connection",
  31: "interest.optimistic",
  34: "connection.grateful",
  38: "calm.content",
  41: "family.anger",
  42: "anger.angry",
  45: "anger.jealous",
  53: "anger.frustrated",
  57: "anger.hurt",
  62: "anger.offended",
  68: "sadness.sad",
  72: "sadness.disappointed",
  73: "sadness.hopeless",
  76: "sadness.exhausted",
  79: "unclear.empty",
  81: "sadness.lonely",
  83: "sadness.abandoned",
  93: "sadness.exhausted",
  97: "fear.tense",
  103: "fear.worried",
  104: "fear.afraid",
  108: "fear.threatened",
  109: "fear.nervous",
  112: "fear.insecure",
  116: "aversion.disgusted",
  122: "sadness.disappointed",
};

function createCheckInId(prefix = "checkin") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function isCurrentStore(value: unknown): value is IStoredCheckIns {
  const candidate = value as IStoredCheckIns;
  return candidate?.version === 2 && Array.isArray(candidate.checkIns);
}

function migrateLegacyStore(value: ILegacyStoredFeelings): IFeelingCheckIn[] {
  return (value.storedFeelings ?? []).flatMap((entry) =>
    Array.from({ length: Math.max(0, entry.count) }, (_, index) => {
      const key = LEGACY_ID_TO_KEY[entry.feelingId];
      return {
        id: `legacy-${entry.feelingId}-${index}`,
        feeling: key
          ? { key }
          : {
              key: `legacy.${entry.feelingId}`,
              customLabel: `Früheres Gefühl #${entry.feelingId}`,
            },
        intensity: 3,
        additionalFeelings: [],
        needs: [],
        createdAt: new Date(0).toISOString(),
        migrated: true,
      };
    })
  );
}

export async function getFeelingCheckInsAsync(): Promise<IFeelingCheckIn[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  const parsed: unknown = JSON.parse(raw);
  if (isCurrentStore(parsed)) return parsed.checkIns;

  const legacy = parsed as ILegacyStoredFeelings;
  if (Array.isArray(legacy?.storedFeelings)) {
    const migrated = migrateLegacyStore(legacy);
    await storeFeelingCheckInsAsync(migrated);
    return migrated;
  }
  return [];
}

export async function storeFeelingCheckInsAsync(
  checkIns: IFeelingCheckIn[]
) {
  const value: IStoredCheckIns = { version: 2, checkIns };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export async function addFeelingCheckInAsync(
  input: Omit<IFeelingCheckIn, "id" | "createdAt">
) {
  const checkIns = await getFeelingCheckInsAsync();
  const checkIn: IFeelingCheckIn = {
    ...input,
    id: createCheckInId(),
    createdAt: new Date().toISOString(),
  };
  await storeFeelingCheckInsAsync([checkIn, ...checkIns]);
  return checkIn;
}

export async function removeFeelingCheckInAsync(checkInId: string) {
  const checkIns = await getFeelingCheckInsAsync();
  await storeFeelingCheckInsAsync(
    checkIns.filter((checkIn) => checkIn.id !== checkInId)
  );
}

export async function resetFeelingCheckInsAsync() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
