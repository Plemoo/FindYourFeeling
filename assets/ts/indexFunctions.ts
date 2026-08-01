import allFeelingsDe from "../../assets/json/feelings_de.json";
import allFeelingsEn from "../../assets/json/feelings_en.json";
import { LANGUAGE } from "../styles/constants";

export function getFeelingsBasedOnLanguage(language: string): INestedFeelings {
  return language.startsWith(LANGUAGE.english)
    ? allFeelingsEn
    : allFeelingsDe;
}

export function getFeelingNodeByKey(
  feelingKey: string,
  root: INestedFeelings
): INestedFeelings | null {
  if (root.key === feelingKey) return root;
  for (const child of root.children ?? []) {
    const match = getFeelingNodeByKey(feelingKey, child);
    if (match) return match;
  }
  return null;
}

export function getFeelingPathByKey(
  feelingKey: string,
  root: INestedFeelings,
  path: INestedFeelings[] = []
): INestedFeelings[] | null {
  const nextPath = [...path, root];
  if (root.key === feelingKey) return nextPath;
  for (const child of root.children ?? []) {
    const match = getFeelingPathByKey(feelingKey, child, nextPath);
    if (match) return match;
  }
  return null;
}

export function flattenFeelings(
  root: INestedFeelings,
  onlySelectable = false
): INestedFeelings[] {
  const values: INestedFeelings[] = [];
  const visit = (node: INestedFeelings) => {
    const selectable = !node.children?.length;
    if (!onlySelectable || selectable) values.push(node);
    node.children?.forEach(visit);
  };
  visit(root);
  return values;
}

export function getFeelingLabel(
  reference: IFeelingReference,
  root: INestedFeelings
): string {
  if (reference.customLabel) return reference.customLabel;
  return getFeelingNodeByKey(reference.key, root)?.name ?? reference.key;
}
