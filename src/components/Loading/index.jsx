import React, { useState, useEffect } from "react";

const LoadingUI = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) return 0; // Reset for demo
                return prev + 2;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center z-50">
            {/* Background dots pattern */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #fbbf24 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #ec4899 2px, transparent 2px)`,
                        backgroundSize: "50px 50px",
                    }}
                ></div>
            </div>

            <div className="relative flex flex-col items-center">
                {/* Film reel animation */}
                <div className="relative mb-8">
                    {/* Main film reel */}
                    <div className="w-32 h-32 border-8 border-yellow-400 rounded-full relative animate-spin">
                        {/* Inner circle */}
                        <div className="absolute inset-4 border-4 border-yellow-300 rounded-full">
                            <div className="absolute inset-2 bg-yellow-400 rounded-full flex items-center justify-center">
                                <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
                            </div>
                        </div>

                        {/* Film holes */}
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-3 h-3 bg-gray-800 rounded-full"
                                style={{
                                    top: "50%",
                                    left: "50%",
                                    transform: `translate(-50%, -50%) rotate(${i * 45
                                        }deg) translateY(-50px)`,
                                }}
                            ></div>
                        ))}
                    </div>

                    {/* Film strip */}
                    <div className="absolute -right-16 top-1/2 transform -translate-y-1/2">
                        <div className="w-12 h-24 bg-gray-700 rounded relative overflow-hidden">
                            {/* Film perforations */}
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between px-1 py-1"
                                >
                                    <div className="w-2 h-2 bg-gray-900 rounded-sm"></div>
                                    <div className="w-2 h-2 bg-gray-900 rounded-sm"></div>
                                </div>
                            ))}

                            {/* Film frames */}
                            <div className="absolute inset-2 bg-gradient-to-b from-purple-400 to-pink-400 rounded-sm opacity-70"></div>
                        </div>
                    </div>
                </div>

                {/* Animated text */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-white mb-2 animate-pulse">
                        Đang tải...
                    </h2>
                    <div className="flex space-x-1 justify-center">
                        {[
                            "Đ",
                            "a",
                            "n",
                            "g",
                            " ",
                            "t",
                            "ì",
                            "m",
                            " ",
                            "k",
                            "i",
                            "ế",
                            "m",
                            " ",
                            "v",
                            "é",
                            "...",
                        ].map((char, i) => (
                            <span
                                key={i}
                                className="text-yellow-400 font-medium animate-bounce"
                                style={{
                                    animationDelay: `${i * 0.1}s`,
                                    animationDuration: "1s",
                                }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Progress bar */}
                <div className="w-80 bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 rounded-full transition-all duration-300 ease-out relative"
                        style={{ width: `${progress}%` }}
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                    </div>
                </div>

                {/* Progress percentage */}
                <div className="text-yellow-400 font-bold text-lg">
                    {progress}%
                </div>

                {/* Floating tickets animation */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-pulse"
                            style={{
                                left: `${20 + i * 15}%`,
                                top: `${30 + (i % 2) * 40}%`,
                                animationDelay: `${i * 0.5}s`,
                                animationDuration: "3s",
                            }}
                        >
                            <div className="w-8 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-sm transform rotate-12 opacity-20">
                                <div className="w-full h-1 bg-gray-600 mt-1 rounded"></div>
                                <div className="w-3/4 h-1 bg-gray-600 mt-1 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Popcorn animation */}
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="text-4xl opacity-30">🍿</div>
                </div>

                {/* Cinema seats */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-20">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="w-6 h-6 bg-red-600 rounded-t-lg animate-pulse"
                            style={{
                                animationDelay: `${i * 0.2}s`,
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Corner decorative elements */}
            <div className="absolute top-4 left-4 text-yellow-400 opacity-30">
                <div className="w-12 h-12 border-2 border-current rounded-full flex items-center justify-center">
                    <div className="text-xl">🎬</div>
                </div>
            </div>

            <div className="absolute top-4 right-4 text-pink-400 opacity-30">
                <div className="w-12 h-12 border-2 border-current rounded-full flex items-center justify-center">
                    <div className="text-xl">🎭</div>
                </div>
            </div>
        </div>
    );
};

export default LoadingUI;
