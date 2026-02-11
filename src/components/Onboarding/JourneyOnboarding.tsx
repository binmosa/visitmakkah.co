'use client'

import { useUserJourney, JourneyStage, JourneyType, TravelGroup, Gender } from '@/context/UserJourneyContext'
import { countries, filterCountries, detectCountryFromIP, getCountryByCode } from '@/data/countries'
import {
    Calendar03Icon,
    AirplaneTakeOff01Icon,
    Location01Icon,
    CheckmarkCircle02Icon,
    User03Icon,
    UserGroup03Icon,
    UserMultiple02Icon,
    HeartCheckIcon,
    Mosque01Icon,
    Male02Icon,
    Female02Icon,
    Search01Icon,
    GlobalIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type OnboardingStep = 'welcome' | 'stage' | 'type' | 'firstTime' | 'gender' | 'country' | 'group' | 'dates' | 'complete'

interface StageOption {
    value: JourneyStage
    label: string
    description: string
    icon: typeof Calendar03Icon | typeof AirplaneTakeOff01Icon | typeof Location01Icon | typeof CheckmarkCircle02Icon
}

interface TypeOption {
    value: JourneyType
    label: string
    description: string
}

interface GroupOption {
    value: TravelGroup
    label: string
    icon: typeof User03Icon | typeof HeartCheckIcon | typeof UserGroup03Icon | typeof UserMultiple02Icon
}

const stageOptions: StageOption[] = [
    {
        value: 'planning',
        label: 'Planning Stage',
        description: 'Researching and preparing for the journey',
        icon: Calendar03Icon,
    },
    {
        value: 'booked',
        label: 'Booked & Preparing',
        description: 'Trip is confirmed, getting ready',
        icon: AirplaneTakeOff01Icon,
    },
    {
        value: 'in_makkah',
        label: 'Currently in Makkah',
        description: "I'm here right now",
        icon: Location01Icon,
    },
    {
        value: 'returned',
        label: 'Just Returned',
        description: 'Recently completed my journey',
        icon: CheckmarkCircle02Icon,
    },
]

const typeOptions: TypeOption[] = [
    {
        value: 'umrah',
        label: 'Umrah',
        description: 'The lesser pilgrimage',
    },
    {
        value: 'hajj',
        label: 'Hajj',
        description: 'The major pilgrimage',
    },
    {
        value: 'both',
        label: 'Both',
        description: 'Planning for Umrah and Hajj',
    },
]

const groupOptions: GroupOption[] = [
    { value: 'solo', label: 'Solo', icon: User03Icon },
    { value: 'couple', label: 'Couple', icon: HeartCheckIcon },
    { value: 'family', label: 'Family', icon: UserGroup03Icon },
    { value: 'group', label: 'Group', icon: UserMultiple02Icon },
]

export default function JourneyOnboarding() {
    const { completeOnboarding } = useUserJourney()
    const [step, setStep] = useState<OnboardingStep>('welcome')
    const [formData, setFormData] = useState({
        journeyStage: null as JourneyStage,
        journeyType: null as JourneyType,
        isFirstTime: null as boolean | null,
        gender: null as Gender,
        country: null as string | null,
        travelGroup: null as TravelGroup,
        travelDates: {
            departure: '',
            return: '',
        },
    })

    // Country selection state
    const [countrySearch, setCountrySearch] = useState('')
    const [detectedCountry, setDetectedCountry] = useState<string | null>(null)
    const [isDetectingCountry, setIsDetectingCountry] = useState(true)

    // Detect country from IP on mount
    useEffect(() => {
        detectCountryFromIP().then((code) => {
            if (code) {
                setDetectedCountry(code)
                // Pre-fill the form with detected country
                setFormData((prev) => ({ ...prev, country: code }))
            }
            setIsDetectingCountry(false)
        })
    }, [])

    const handleComplete = () => {
        completeOnboarding({
            ...formData,
            travelDates: {
                departure: formData.travelDates.departure || null,
                return: formData.travelDates.return || null,
            },
        })
    }

    const allSteps: OnboardingStep[] = ['welcome', 'stage', 'type', 'firstTime', 'gender', 'country', 'group', 'dates', 'complete']

    const nextStep = () => {
        const currentIndex = allSteps.indexOf(step)
        if (currentIndex < allSteps.length - 1) {
            setStep(allSteps[currentIndex + 1])
        }
    }

    const prevStep = () => {
        const currentIndex = allSteps.indexOf(step)
        if (currentIndex > 0) {
            setStep(allSteps[currentIndex - 1])
        }
    }

    const skipDates = () => {
        setStep('complete')
    }

    const renderStep = () => {
        switch (step) {
            case 'welcome':
                return (
                    <div className="text-center">
                        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                            <HugeiconsIcon icon={Mosque01Icon} className="size-10 text-primary-600 dark:text-primary-400" />
                        </div>
                        <h1 className="mb-3 text-2xl font-bold text-neutral-900 sm:text-3xl dark:text-white">
                            Welcome to Visit Makkah
                        </h1>
                        <p className="mb-8 text-neutral-600 dark:text-neutral-400">
                            Your AI-powered guide for an unforgettable pilgrimage experience.
                            Let us personalize your journey.
                        </p>
                        <button
                            onClick={nextStep}
                            className="w-full rounded-xl bg-primary-600 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-primary-700 sm:w-auto"
                        >
                            Get Started
                        </button>
                    </div>
                )

            case 'stage':
                return (
                    <div>
                        <h2 className="mb-2 text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">
                            Where are you in your journey?
                        </h2>
                        <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
                            This helps us show you the most relevant information
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {stageOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setFormData({ ...formData, journeyStage: option.value })
                                        nextStep()
                                    }}
                                    className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                                        formData.journeyStage === option.value
                                            ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20'
                                            : 'border-neutral-200 hover:border-primary-300 dark:border-neutral-700 dark:hover:border-primary-600'
                                    }`}
                                >
                                    <div className={`rounded-lg p-2 ${
                                        formData.journeyStage === option.value
                                            ? 'bg-primary-100 dark:bg-primary-800'
                                            : 'bg-neutral-100 dark:bg-neutral-800'
                                    }`}>
                                        <HugeiconsIcon
                                            icon={option.icon}
                                            className={`size-5 ${
                                                formData.journeyStage === option.value
                                                    ? 'text-primary-600 dark:text-primary-400'
                                                    : 'text-neutral-600 dark:text-neutral-400'
                                            }`}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-neutral-900 dark:text-white">{option.label}</p>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{option.description}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )

            case 'type':
                return (
                    <div>
                        <h2 className="mb-2 text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">
                            What type of journey?
                        </h2>
                        <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
                            Select your pilgrimage type
                        </p>
                        <div className="grid gap-3 sm:grid-cols-3">
                            {typeOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setFormData({ ...formData, journeyType: option.value })
                                        nextStep()
                                    }}
                                    className={`rounded-xl border-2 p-4 text-center transition-all ${
                                        formData.journeyType === option.value
                                            ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20'
                                            : 'border-neutral-200 hover:border-primary-300 dark:border-neutral-700 dark:hover:border-primary-600'
                                    }`}
                                >
                                    <p className="text-lg font-bold text-neutral-900 dark:text-white">{option.label}</p>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{option.description}</p>
                                </button>
                            ))}
                        </div>
                        <button onClick={prevStep} className="mt-4 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
                            Back
                        </button>
                    </div>
                )

            case 'firstTime':
                return (
                    <div>
                        <h2 className="mb-2 text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">
                            Is this your first time?
                        </h2>
                        <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
                            We&apos;ll adjust guidance based on your experience
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <button
                                onClick={() => {
                                    setFormData({ ...formData, isFirstTime: true })
                                    nextStep()
                                }}
                                className={`rounded-xl border-2 p-6 text-center transition-all ${
                                    formData.isFirstTime === true
                                        ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20'
                                        : 'border-neutral-200 hover:border-primary-300 dark:border-neutral-700 dark:hover:border-primary-600'
                                }`}
                            >
                                <p className="text-lg font-bold text-neutral-900 dark:text-white">Yes, first time</p>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">I need detailed guidance</p>
                            </button>
                            <button
                                onClick={() => {
                                    setFormData({ ...formData, isFirstTime: false })
                                    nextStep()
                                }}
                                className={`rounded-xl border-2 p-6 text-center transition-all ${
                                    formData.isFirstTime === false
                                        ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20'
                                        : 'border-neutral-200 hover:border-primary-300 dark:border-neutral-700 dark:hover:border-primary-600'
                                }`}
                            >
                                <p className="text-lg font-bold text-neutral-900 dark:text-white">No, returning</p>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">I have been before</p>
                            </button>
                        </div>
                        <button onClick={prevStep} className="mt-4 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
                            Back
                        </button>
                    </div>
                )

            case 'gender':
                return (
                    <div>
                        <h2 className="mb-2 text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">
                            How should we address you?
                        </h2>
                        <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
                            This helps us provide personalized guidance
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <button
                                onClick={() => {
                                    setFormData({ ...formData, gender: 'male' })
                                    nextStep()
                                }}
                                className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all ${
                                    formData.gender === 'male'
                                        ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20'
                                        : 'border-neutral-200 hover:border-primary-300 dark:border-neutral-700 dark:hover:border-primary-600'
                                }`}
                            >
                                <HugeiconsIcon
                                    icon={Male02Icon}
                                    className={`size-10 ${
                                        formData.gender === 'male'
                                            ? 'text-primary-600 dark:text-primary-400'
                                            : 'text-neutral-500 dark:text-neutral-400'
                                    }`}
                                />
                                <p className="text-lg font-bold text-neutral-900 dark:text-white">Male</p>
                            </button>
                            <button
                                onClick={() => {
                                    setFormData({ ...formData, gender: 'female' })
                                    nextStep()
                                }}
                                className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all ${
                                    formData.gender === 'female'
                                        ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20'
                                        : 'border-neutral-200 hover:border-primary-300 dark:border-neutral-700 dark:hover:border-primary-600'
                                }`}
                            >
                                <HugeiconsIcon
                                    icon={Female02Icon}
                                    className={`size-10 ${
                                        formData.gender === 'female'
                                            ? 'text-primary-600 dark:text-primary-400'
                                            : 'text-neutral-500 dark:text-neutral-400'
                                    }`}
                                />
                                <p className="text-lg font-bold text-neutral-900 dark:text-white">Female</p>
                            </button>
                        </div>
                        <button onClick={prevStep} className="mt-4 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
                            Back
                        </button>
                    </div>
                )

            case 'country': {
                const filteredCountries = filterCountries(countrySearch)
                const selectedCountry = formData.country ? getCountryByCode(formData.country) : null
                const detectedCountryInfo = detectedCountry ? getCountryByCode(detectedCountry) : null

                return (
                    <div>
                        <h2 className="mb-2 text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">
                            Where are you from?
                        </h2>
                        <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
                            We&apos;ll customize visa info and tips for your country
                        </p>

                        {/* Show detected country if available */}
                        {detectedCountryInfo && !countrySearch && (
                            <div className="mb-4">
                                <p className="mb-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                    Detected from your location:
                                </p>
                                <button
                                    onClick={() => {
                                        setFormData({ ...formData, country: detectedCountry })
                                        nextStep()
                                    }}
                                    className={`flex w-full items-center justify-between rounded-xl border-2 p-4 transition-all ${
                                        formData.country === detectedCountry
                                            ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20'
                                            : 'border-primary-200 bg-primary-50/50 hover:border-primary-400 dark:border-primary-800 dark:bg-primary-900/10'
                                    }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="text-2xl">{detectedCountryInfo.flag}</span>
                                        <span className="font-semibold text-neutral-900 dark:text-white">
                                            {detectedCountryInfo.name}
                                        </span>
                                    </span>
                                    <span className="text-sm text-primary-600 dark:text-primary-400">
                                        Continue →
                                    </span>
                                </button>
                            </div>
                        )}

                        {/* Search input */}
                        <div className="relative mb-3">
                            <HugeiconsIcon
                                icon={Search01Icon}
                                className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-neutral-400"
                            />
                            <input
                                type="text"
                                placeholder="Search your country..."
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                className="w-full rounded-xl border border-neutral-300 bg-white py-3 pl-10 pr-4 text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                            />
                        </div>

                        {/* Country list */}
                        <div className="max-h-48 overflow-y-auto rounded-xl border border-neutral-200 dark:border-neutral-700">
                            {isDetectingCountry ? (
                                <div className="flex items-center justify-center gap-2 py-8 text-neutral-500">
                                    <HugeiconsIcon icon={GlobalIcon} className="size-5 animate-pulse" />
                                    <span>Detecting your location...</span>
                                </div>
                            ) : filteredCountries.length === 0 ? (
                                <div className="py-8 text-center text-neutral-500">
                                    No countries found
                                </div>
                            ) : (
                                filteredCountries.map((country) => (
                                    <button
                                        key={country.code}
                                        onClick={() => {
                                            setFormData({ ...formData, country: country.code })
                                            nextStep()
                                        }}
                                        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                                            formData.country === country.code
                                                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                                                : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                        }`}
                                    >
                                        <span className="text-xl">{country.flag}</span>
                                        <span className="font-medium text-neutral-900 dark:text-white">
                                            {country.name}
                                        </span>
                                    </button>
                                ))
                            )}
                        </div>

                        <button onClick={prevStep} className="mt-4 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
                            Back
                        </button>
                    </div>
                )
            }

            case 'group':
                return (
                    <div>
                        <h2 className="mb-2 text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">
                            Who are you traveling with?
                        </h2>
                        <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
                            This helps us provide relevant tips
                        </p>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {groupOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setFormData({ ...formData, travelGroup: option.value })
                                        nextStep()
                                    }}
                                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                                        formData.travelGroup === option.value
                                            ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20'
                                            : 'border-neutral-200 hover:border-primary-300 dark:border-neutral-700 dark:hover:border-primary-600'
                                    }`}
                                >
                                    <HugeiconsIcon
                                        icon={option.icon}
                                        className={`size-8 ${
                                            formData.travelGroup === option.value
                                                ? 'text-primary-600 dark:text-primary-400'
                                                : 'text-neutral-600 dark:text-neutral-400'
                                        }`}
                                    />
                                    <p className="font-semibold text-neutral-900 dark:text-white">{option.label}</p>
                                </button>
                            ))}
                        </div>
                        <button onClick={prevStep} className="mt-4 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
                            Back
                        </button>
                    </div>
                )

            case 'dates':
                return (
                    <div>
                        <h2 className="mb-2 text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">
                            When is your journey?
                        </h2>
                        <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
                            Optional - helps us show countdown and timely reminders
                        </p>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Departure Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.travelDates.departure}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            travelDates: { ...formData.travelDates, departure: e.target.value },
                                        })
                                    }
                                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Return Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.travelDates.return}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            travelDates: { ...formData.travelDates, return: e.target.value },
                                        })
                                    }
                                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={prevStep}
                                className="flex-1 rounded-xl border border-neutral-300 px-4 py-3 font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
                            >
                                Back
                            </button>
                            <button
                                onClick={skipDates}
                                className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                            >
                                Skip
                            </button>
                            <button
                                onClick={() => setStep('complete')}
                                className="flex-1 rounded-xl bg-primary-600 px-4 py-3 font-medium text-white transition-colors hover:bg-primary-700"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )

            case 'complete':
                return (
                    <div className="text-center">
                        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-10 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="mb-3 text-2xl font-bold text-neutral-900 dark:text-white">
                            You&apos;re all set!
                        </h2>
                        <p className="mb-8 text-neutral-600 dark:text-neutral-400">
                            Your personalized dashboard is ready. Let&apos;s begin your journey.
                        </p>
                        <button
                            onClick={handleComplete}
                            className="w-full rounded-xl bg-primary-600 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-primary-700 sm:w-auto"
                        >
                            Go to My Dashboard
                        </button>
                    </div>
                )

            default:
                return null
        }
    }

    // Progress indicator
    const currentIndex = allSteps.indexOf(step)
    const progress = ((currentIndex) / (allSteps.length - 1)) * 100

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-8">
            <div className="w-full max-w-lg">
                {/* Progress bar */}
                {step !== 'welcome' && step !== 'complete' && (
                    <div className="mb-8">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                            <motion.div
                                className="h-full bg-primary-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <p className="mt-2 text-center text-xs text-neutral-500">
                            Step {currentIndex} of {allSteps.length - 2}
                        </p>
                    </div>
                )}

                {/* Step content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl sm:p-8 dark:border-neutral-700 dark:bg-neutral-900"
                    >
                        <div className="relative z-10">
                            {renderStep()}
                        </div>
                        {/* Islamic pattern overlay */}
                        <div
                            className="pointer-events-none absolute inset-0 z-0"
                            style={{
                                backgroundImage: 'url(/images/islamic-pattern.svg)',
                                backgroundPosition: 'left top',
                                backgroundRepeat: 'repeat-y',
                                backgroundSize: 'auto 300px',
                            }}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
