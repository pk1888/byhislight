import React, { useState } from 'react';
import { AppSettings, RosaryMysteryType } from '../types';
import { ROSARY_MYSTERIES, getRecommendedMysteryForDay, FATIMA_PRAYER, HAIL_HOLY_QUEEN } from '../data/rosary';
import { CATHOLIC_PRAYERS } from '../data/prayers';
import { ChapelCross } from './ChapelCross';
import { RotateCcw, ChevronRight, ChevronLeft, Moon, Sun } from 'lucide-react';
import { playChapelBell } from '../utils/audio';

interface RosaryViewProps {
  settings: AppSettings;
}

export const RosaryView: React.FC<RosaryViewProps> = ({ settings }) => {
  const [selectedMysteryType, setSelectedMysteryType] = useState<RosaryMysteryType>(
    getRecommendedMysteryForDay()
  );

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [darkPrayerMode, setDarkPrayerMode] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const currentMysterySet = ROSARY_MYSTERIES[selectedMysteryType];
  const isDark = darkPrayerMode || settings.theme === 'candlelight' || settings.theme === 'stone';

  // Build complete bead step sequence for the 5 decades:
  // 0: Sign of Cross
  // 1: Apostles Creed
  // 2: Our Father
  // 3..5: Hail Mary x3
  // 6: Glory Be
  // Then for each decade (1 to 5):
  // Decade Intro (Decade Title, Scripture, Meditation) -> Our Father -> Hail Mary x10 -> Glory Be -> Fatima Prayer
  // Step list generation:
  interface RosaryStep {
    stepIndex: number;
    title: string;
    beadLabel: string;
    prayerText: string;
    latinText?: string;
    scriptureRef?: string;
    scriptureText?: string;
    meditation?: string;
    decadeNumber?: number;
  }

  const steps: RosaryStep[] = [];
  let sIdx = 0;

  // Initial Prayers
  steps.push({
    stepIndex: sIdx++,
    title: 'Sign of the Cross',
    beadLabel: 'Crucifix',
    prayerText: 'In the name of the Father,\nand of the Son,\nand of the Holy Spirit.\n\nAmen.'
  });

  const apCreed = CATHOLIC_PRAYERS.find(p => p.id === 'apostles-creed');
  steps.push({
    stepIndex: sIdx++,
    title: "Apostles' Creed",
    beadLabel: 'First Bead',
    prayerText: apCreed?.text || ''
  });

  const ourFather = CATHOLIC_PRAYERS.find(p => p.id === 'our-father');
  steps.push({
    stepIndex: sIdx++,
    title: 'Our Father',
    beadLabel: 'Large Bead',
    prayerText: ourFather?.text || '',
    latinText: ourFather?.latinText
  });

  const hailMary = CATHOLIC_PRAYERS.find(p => p.id === 'hail-mary');
  ['Increase of Faith', 'Increase of Hope', 'Increase of Charity'].map((intention, idx) => {
    steps.push({
      stepIndex: sIdx++,
      title: `Hail Mary (${intention})`,
      beadLabel: `Bead ${idx + 1} of 3`,
      prayerText: hailMary?.text || '',
      latinText: hailMary?.latinText
    });
  });

  const gloryBe = CATHOLIC_PRAYERS.find(p => p.id === 'glory-be');
  steps.push({
    stepIndex: sIdx++,
    title: 'Glory Be',
    beadLabel: 'Chain',
    prayerText: gloryBe?.text || '',
    latinText: gloryBe?.latinText
  });

  // 5 Decades
  currentMysterySet.decades.forEach((decade) => {
    // Decade Contemplation Step
    steps.push({
      stepIndex: sIdx++,
      title: `Decade ${decade.decadeNumber}: ${decade.title}`,
      beadLabel: `Mystery Contemplation`,
      prayerText: `Contemplate the ${decade.title}.`,
      scriptureRef: decade.scriptureRef,
      scriptureText: decade.scriptureText,
      meditation: decade.meditation,
      decadeNumber: decade.decadeNumber
    });

    // Our Father
    steps.push({
      stepIndex: sIdx++,
      title: `Decade ${decade.decadeNumber} - Our Father`,
      beadLabel: `Large Bead`,
      prayerText: ourFather?.text || '',
      scriptureRef: decade.scriptureRef,
      meditation: decade.meditation,
      decadeNumber: decade.decadeNumber
    });

    // 10 Hail Marys
    for (let h = 1; h <= 10; h++) {
      steps.push({
        stepIndex: sIdx++,
        title: `Decade ${decade.decadeNumber} - Hail Mary (${h}/10)`,
        beadLabel: `Hail Mary Bead ${h}`,
        prayerText: hailMary?.text || '',
        scriptureRef: decade.scriptureRef,
        meditation: decade.meditation,
        decadeNumber: decade.decadeNumber
      });
    }

    // Glory Be
    steps.push({
      stepIndex: sIdx++,
      title: `Decade ${decade.decadeNumber} - Glory Be`,
      beadLabel: `Glory Be Bead`,
      prayerText: gloryBe?.text || '',
      decadeNumber: decade.decadeNumber
    });

    // Fatima Prayer
    steps.push({
      stepIndex: sIdx++,
      title: `Decade ${decade.decadeNumber} - Fatima Prayer`,
      beadLabel: `Fatima Bead`,
      prayerText: FATIMA_PRAYER,
      decadeNumber: decade.decadeNumber
    });
  });

  // Concluding Prayers
  steps.push({
    stepIndex: sIdx++,
    title: 'Hail, Holy Queen',
    beadLabel: 'Rosary Centerpiece',
    prayerText: HAIL_HOLY_QUEEN
  });

  steps.push({
    stepIndex: sIdx++,
    title: 'Concluding Sign of the Cross',
    beadLabel: 'Crucifix',
    prayerText: 'In the name of the Father,\nand of the Son,\nand of the Holy Spirit.\n\nAmen.'
  });

  const activeStep = steps[currentStep] || steps[0];
  const totalSteps = steps.length;
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      if (settings.quietBell) playChapelBell(0.06);
      setCurrentStep(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    if (settings.quietBell) playChapelBell(0.15);
    setCurrentStep(0);
    setIsComplete(false);
  };

  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 space-y-8 transition-colors duration-500 ${
      darkPrayerMode ? 'bg-[#0f0e0d] text-[#e8ded0] rounded-3xl p-6 shadow-2xl border border-[#26231f]' : ''
    }`}>
      {/* Header & Mystery Selection */}
      <div className="text-center space-y-3">
        <h1 className={`font-heading text-3xl sm:text-4xl font-semibold tracking-wide ${
          isDark ? 'text-[#f5ebd8]' : 'text-[#1c2536]'
        }`}>
          The Holy Rosary
        </h1>

        <p className={`text-sm sm:text-base font-sans font-medium ${isDark ? 'text-[#C2B7A5]' : 'text-stone-600'}`}>
          {currentMysterySet.title} • Prayed on {currentMysterySet.days}
        </p>

        {/* Mystery Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {(['joyful', 'sorrowful', 'glorious', 'luminous'] as RosaryMysteryType[]).map((mType) => {
            const mData = ROSARY_MYSTERIES[mType];
            const isSelected = selectedMysteryType === mType;
            return (
              <button
                key={mType}
                onClick={() => {
                   setSelectedMysteryType(mType);
                   setCurrentStep(0);
                   setIsComplete(false);
                  if (settings.quietBell) playChapelBell(0.1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#c5a059] text-stone-950 font-bold shadow-sm'
                    : isDark
                      ? 'bg-[#22201d] text-[#a89f90] hover:bg-[#2c2822]'
                      : 'bg-[#eee5d4] text-[#4d463d] hover:bg-[#e4d8c2]'
                }`}
              >
                {mData.title}
              </button>
            );
          })}

          {/* Dark Prayer Mode Toggle */}
          <button
            onClick={() => setDarkPrayerMode(prev => !prev)}
            title="Toggle Distraction-Free Dark Prayer Mode"
            className={`p-1.5 rounded-full border text-xs transition-colors ml-2 ${
              darkPrayerMode
                ? 'border-[#c5a059] text-[#c5a059] bg-[#c5a059]/15'
                : isDark
                  ? 'border-stone-400/30 text-[#C2B7A5] hover:text-[#f5ebd8]'
                  : 'border-stone-400/30 text-stone-600 hover:text-stone-900'
            }`}
          >
            {darkPrayerMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Rosary Progress Bar */}
      <div className="space-y-2 max-w-xl mx-auto">
        <div className={`flex justify-between items-center text-xs font-mono ${isDark ? 'text-[#C2B7A5]' : 'text-stone-600'}`}>
          <span>Bead {currentStep + 1} of {totalSteps}</span>
          <span>{progressPercent}% Complete</span>
        </div>
        <div className="relative w-full h-1.5 bg-stone-700/30 rounded-full">
          <div
            className="h-full bg-[#c5a059] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
          <span
            className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-[#f8e7a7] bg-[#c5a059] shadow-[0_0_10px_rgba(212,175,55,0.8)] transition-all duration-300"
            style={{ left: `${progressPercent}%` }}
            aria-hidden="true"
          />
        </div>
      </div>

      {isComplete ? (
        <section className={`rounded-3xl border px-6 py-16 text-center shadow-md animate-fade-in sm:px-12 ${
          isDark ? 'bg-[#181614] border-[#2e2a24] text-[#ece4d6]' : 'bg-[#faf6ee] border-[#ebdcc8] text-[#2d2922]'
        }`}>
          <ChapelCross size={34} />
          <h2 className="mt-6 font-heading text-3xl sm:text-4xl">The Rosary is complete.</h2>
          <p className="mx-auto mt-6 max-w-md font-scripture text-xl leading-relaxed italic">
            May Our Lady keep you<br />
            beneath her mantle today.
          </p>
          <p className={`mt-8 font-serif text-sm italic ${isDark ? 'text-amber-200' : 'text-amber-900'}`}>
            Go in peace.
          </p>
          <button
            onClick={handleRestart}
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-stone-400/30 px-5 py-2.5 text-xs hover:border-[#c5a059] transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Pray the Rosary again
          </button>
        </section>
      ) : (
      /* Main Bead Card */
      <div className={`p-8 sm:p-12 rounded-3xl border text-center space-y-8 shadow-md transition-all ${
        isDark
          ? 'bg-[#181614] border-[#2e2a24] text-[#ece4d6]'
          : 'bg-[#faf6ee] border-[#ebdcc8] text-[#2d2922]'
      }`}>
        {/* Bead Label Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest bg-[#c5a059]/15 text-[#c5a059]">
          <ChapelCross size={14} />
          <span>{activeStep.beadLabel} • {activeStep.title}</span>
        </div>

        {/* Optional Scripture / Contemplation */}
        {activeStep.scriptureText && (
          <div className={`p-6 rounded-2xl border text-left space-y-3 ${
            isDark ? 'bg-[#22201d] border-[#38332b]' : 'bg-[#f4ebe0] border-[#e2d5c3]'
          }`}>
            <div className="text-xs font-mono uppercase tracking-wider text-[#c5a059]">
              Mystery Contemplation • {activeStep.scriptureRef}
            </div>
            <p className="font-scripture italic text-base sm:text-lg leading-relaxed">
              "{activeStep.scriptureText}"
            </p>
            {activeStep.meditation && (
              <p className={`font-sans text-xs sm:text-sm border-t pt-2 border-stone-500/20 ${isDark ? 'text-[#C2B7A5]' : 'text-stone-600'}`}>
                {activeStep.meditation}
              </p>
            )}
          </div>
        )}

        {/* Prayer Text */}
        <div className="py-4">
          <p className="font-scripture text-xl sm:text-2xl md:text-3xl leading-relaxed whitespace-pre-line tracking-wide">
            {activeStep.prayerText}
          </p>
        </div>

        {/* Step Navigation Controls */}
        <div className="pt-6 border-t border-stone-300/30 flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`p-3 rounded-full border transition-all ${
              currentStep === 0
                ? 'opacity-30 cursor-not-allowed border-stone-600'
                : 'hover:border-[#c5a059] hover:bg-[#c5a059]/10'
            }`}
            title="Previous bead"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Restart */}
          <button
            onClick={handleRestart}
            className="p-3 rounded-full border border-stone-400/30 hover:border-[#c5a059] transition-all text-xs flex items-center space-x-1"
            title="Restart Rosary"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Next Bead */}
          <button
            onClick={handleNext}
            className={`px-6 py-3 rounded-full font-medium text-xs sm:text-sm flex items-center space-x-2 transition-all shadow-sm ${
              'bg-[#c5a059] text-stone-950 hover:bg-[#d4b06a] font-bold'
            }`}
          >
            <span>{currentStep === totalSteps - 1 ? 'Complete the Rosary' : 'Pray Next Bead'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      )}
    </div>
  );
};
