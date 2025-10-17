import { CheckCircle, Circle, Loader } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  description: string;
}

interface ProgressTrackerProps {
  currentStep: number;
  steps: Step[];
}

export default function ProgressTracker({ currentStep, steps }: ProgressTrackerProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
              {/* Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                  isComplete
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-primary-500 text-white animate-pulse'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {isComplete ? (
                  <CheckCircle size={20} />
                ) : isCurrent ? (
                  <Loader className="animate-spin" size={20} />
                ) : (
                  <Circle size={20} />
                )}
              </div>

              {/* Label */}
              <div className="text-center max-w-[120px]">
                <p
                  className={`text-sm font-semibold mb-1 ${
                    isCurrent ? 'text-primary-600' : isComplete ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </p>
                {isCurrent && (
                  <p className="text-xs text-gray-500">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Pre-defined steps for AI analysis
export const AI_ANALYSIS_STEPS: Step[] = [
  {
    id: 'classification',
    label: 'Classifying',
    description: 'Analyzing issue type and complexity...'
  },
  {
    id: 'context',
    label: 'Context',
    description: 'Gathering relevant code files...'
  },
  {
    id: 'solution',
    label: 'Generating',
    description: 'Creating solution with AI...'
  },
  {
    id: 'validation',
    label: 'Validating',
    description: 'Checking solution quality...'
  },
  {
    id: 'complete',
    label: 'Complete',
    description: 'Ready for review!'
  }
];

