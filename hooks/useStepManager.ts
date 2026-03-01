import { useCallback, useState } from 'react';

export function useStepManager(totalSteps: number, initialStep = 0) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const nextStep = useCallback(() => {
    if (!isLastStep) setCurrentStep((s) => s + 1);
  }, [isLastStep]);

  const prevStep = useCallback(() => {
    if (!isFirstStep) setCurrentStep((s) => s - 1);
  }, [isFirstStep]);

  const goToStep = useCallback(
    (index: number) => {
      setCurrentStep(Math.max(0, Math.min(index, totalSteps - 1)));
    },
    [totalSteps],
  );

  return {
    currentStep,
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
    goToStep,
  };
}
