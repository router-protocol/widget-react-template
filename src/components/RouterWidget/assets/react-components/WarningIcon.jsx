import React from 'react'

const WarningIcon = ({ fill = '#E8425A' }) => {
    return (
        <div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V14" stroke={fill} strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 17.5V18" stroke={fill} strokeWidth="2" strokeLinecap="round"/>
            <path d="M2.23203 19.016L10.35 3.05201C11.063 1.64901 12.94 1.64901 13.652 3.05201L21.769 19.016C22.45 20.36 21.544 22 20.116 22H3.88303C2.45603 22 1.54903 20.36 2.23303 19.016H2.23203Z" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>        
        </div>
    )
}

export default WarningIcon
