import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useHelpMode = (editableMatchesLength: number, newMatchesLength: number) => {
  const { t } = useTranslation();
  const [isHelpMode, setIsHelpMode] = useState(false);
  const [currentHelpStep, setCurrentHelpStep] = useState(0);

  const toggleHelpMode = useCallback(() => {
    setIsHelpMode((prev) => {
      if (!prev) {
        setCurrentHelpStep(0);
      }
      return !prev;
    });
  }, []);

  const nextHelpStep = useCallback(() => {
    setCurrentHelpStep((prev) => {
      const hasFirstRow = editableMatchesLength > 0 || newMatchesLength > 0;
      const totalSteps = hasFirstRow ? 7 : 5;
      return prev < totalSteps - 1 ? prev + 1 : prev;
    });
  }, [editableMatchesLength, newMatchesLength]);

  const prevHelpStep = useCallback(() => {
    setCurrentHelpStep((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const getHelpSteps = useMemo(() => {
    const hasFirstRow = editableMatchesLength > 0 || newMatchesLength > 0;
    const steps = [
      { id: "table", label: t("helpTooltipTable") },
      { id: "addButton", label: t("helpTooltipAddButton") },
    ];

    if (hasFirstRow) {
      steps.push(
        { id: "opponentField", label: t("helpTooltipOpponentField") },
        { id: "counterButtons", label: t("helpTooltipCounterButtons") },
      );
    }

    steps.push(
      { id: "saveButton", label: t("helpTooltipSave") },
      { id: "revertButton", label: t("helpTooltipRevert") },
      { id: "removeButton", label: t("helpTooltipRemoveButton") },
    );

    return steps;
  }, [editableMatchesLength, newMatchesLength, t]);

  const currentStep = getHelpSteps[currentHelpStep];
  const totalSteps = getHelpSteps.length;

  return {
    isHelpMode,
    currentHelpStep,
    currentStep,
    totalSteps,
    toggleHelpMode,
    nextHelpStep,
    prevHelpStep,
  };
};