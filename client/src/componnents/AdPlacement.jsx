import React from 'react';
import styled from 'styled-components';

// Ad placement variants
const AD_SIZES = {
    sidebar: { width: '300px', height: '600px', label: 'Sidebar Ad' },
    'in-article': { width: '728px', height: '90px', label: 'In-Article Ad' },
    'between-posts': { width: '300px', height: '250px', label: 'Ad' },
    'mobile-banner': { width: '320px', height: '100px', label: 'Ad' }
};

const AdContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ $isPlaceholder }) => 
        $isPlaceholder 
            ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' 
            : 'transparent'
    };
    border: ${({ $isPlaceholder }) => 
        $isPlaceholder ? '1px dashed rgba(255, 255, 255, 0.2)' : 'none'
    };
    border-radius: 8px;
    width: ${({ $width }) => $width};
    max-width: 100%;
    height: ${({ $height }) => $height};
    margin: ${({ $margin }) => $margin || '20px auto'};
    overflow: hidden;
    position: relative;
    
    @media (max-width: 768px) {
        width: 100%;
        height: ${({ $mobileHeight }) => $mobileHeight || '100px'};
    }
`;

const PlaceholderContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.3);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    gap: 8px;
`;

const AdIcon = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
`;

const AdLabel = styled.span`
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.2);
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

/**
 * AdPlacement Component
 * 
 * Reusable ad placeholder for future Google AdSense integration.
 * Currently displays placeholder UI. When ready for AdSense:
 * 1. Set isPlaceholder to false
 * 2. Pass your adSlot ID from AdSense
 * 3. Ensure AdSense script is in index.html
 * 
 * @param {string} variant - 'sidebar' | 'in-article' | 'between-posts' | 'mobile-banner'
 * @param {boolean} isPlaceholder - Show placeholder or attempt to render real ad
 * @param {string} adSlot - Google AdSense ad slot ID (for future use)
 * @param {string} margin - Custom margin (default: '20px auto')
 */
const AdPlacement = ({ 
    variant = 'between-posts', 
    isPlaceholder = true,
    adSlot = '',
    margin
}) => {
    const size = AD_SIZES[variant] || AD_SIZES['between-posts'];
    
    // When ready for AdSense, this will render the actual ad
    if (!isPlaceholder && adSlot) {
        return (
            <AdContainer 
                $width={size.width} 
                $height={size.height}
                $margin={margin}
                $isPlaceholder={false}
            >
                {/* 
                    Future AdSense Implementation:
                    <ins 
                        className="adsbygoogle"
                        style={{ display: 'block' }}
                        data-ad-client="ca-pub-XXXXX"
                        data-ad-slot={adSlot}
                        data-ad-format="auto"
                        data-full-width-responsive="true"
                    />
                */}
            </AdContainer>
        );
    }
    
    // Placeholder mode - shows visual indicator where ads will appear
    return (
        <AdContainer 
            $width={size.width} 
            $height={size.height}
            $mobileHeight={variant === 'sidebar' ? '250px' : '100px'}
            $margin={margin}
            $isPlaceholder={true}
        >
            <PlaceholderContent>
                <AdIcon>📢</AdIcon>
                <span>{size.label}</span>
            </PlaceholderContent>
            <AdLabel>Advertisement</AdLabel>
        </AdContainer>
    );
};

export default AdPlacement;
