"use client";

import React, { useEffect, useState } from 'react';

interface ModelViewerWrapperProps {
    src: string;
    alt: string;
    style?: React.CSSProperties;
    cameraOrbit?: string;
    disableZoom?: boolean;
    autoRotate?: boolean;
    cameraControls?: boolean;
    animationName?: string;
}

const ModelViewerWrapper: React.FC<ModelViewerWrapperProps> = ({
    src,
    alt,
    style,
    cameraOrbit = "0deg 90deg 105%",
    disableZoom = false,
    autoRotate = true,
    cameraControls = true,
    animationName
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div style={style} className="bg-slate-900 animate-pulse rounded-xl" />;
    }

    return (
        // @ts-ignore
        <model-viewer
            src={src}
            alt={alt}
            auto-rotate={autoRotate ? true : undefined}
            camera-controls={cameraControls ? true : undefined}
            camera-orbit={cameraOrbit}
            interaction-prompt="none"
            disable-zoom={disableZoom ? true : undefined}
            animation-name={animationName}
            autoplay={animationName ? true : undefined}
            style={style}
            shadow-intensity="1"
        >
            {/* @ts-ignore */}
        </model-viewer>
    );
};

export default ModelViewerWrapper;
