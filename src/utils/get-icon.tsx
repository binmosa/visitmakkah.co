import { FaMap, FaMosque, FaBed, FaRobot, FaLightbulb } from 'react-icons/fa6'
import React from 'react'

export const getIcon = (iconName?: string): React.ComponentType<{ className?: string }> | undefined => {
    switch (iconName) {
        case 'FaMap':
            return FaMap
        case 'FaMosque':
            return FaMosque
        case 'FaBed':
            return FaBed
        case 'FaRobot':
            return FaRobot
        case 'FaLightbulb':
            return FaLightbulb
        default:
            return undefined
    }
}
