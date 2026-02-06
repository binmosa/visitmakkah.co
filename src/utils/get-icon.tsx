import {
    Mosque01Icon,
    BedSingle01Icon,
    Robot01Icon,
    BulbIcon,
    Kaaba01Icon,
    MapsLocation01Icon
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import React from 'react'

export const getIcon = (iconName?: string): React.ComponentType<{ className?: string }> | undefined => {
    const IconWrapper = ({ icon, className }: { icon: any; className?: string }) => (
        <HugeiconsIcon icon={icon} className={className} />
    )

    switch (iconName) {
        case 'FaMap':
        case 'MapsLocation01Icon':
            return (props) => <IconWrapper icon={MapsLocation01Icon} {...props} />
        case 'FaMosque':
        case 'Mosque01Icon':
            return (props) => <IconWrapper icon={Mosque01Icon} {...props} />
        case 'FaBed':
        case 'BedSingle01Icon':
            return (props) => <IconWrapper icon={BedSingle01Icon} {...props} />
        case 'FaRobot':
        case 'Robot01Icon':
            return (props) => <IconWrapper icon={Robot01Icon} {...props} />
        case 'FaLightbulb':
        case 'BulbIcon':
            return (props) => <IconWrapper icon={BulbIcon} {...props} />
        default:
            return undefined
    }
}
