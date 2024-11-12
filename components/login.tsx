"use client";
import { useEffect, useRef, useState } from "react";
import { useLogin } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";

interface VideoData {
    poster: string;
    src: string;
    title: string;
}

interface Position {
    x: number;
    y: number;
}

const Hero = () => {
    const router = useRouter();
    const { login } = useLogin({
        onComplete: () => router.push("/dashboard"),
    });

    const { ready, authenticated } = usePrivy();

    const [activeBox, setActiveBox] = useState<number | null>(null);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement | null>(null);

    const videos: VideoData[] = [
        {
            poster: "https://cdn.prod.website-files.com/65035c417fe69396bd8c0d5c/6526a875a3e147a5a2dd8e4b_cursor-card-desktop01-poster-00001.jpg",
            src: "https://cdn.prod.website-files.com/65035c417fe69396bd8c0d5c/6526a875a3e147a5a2dd8e4b_cursor-card-desktop01-transcode.mp4",
            title: "Send Money",
        },
        {
            poster: "https://cdn.prod.website-files.com/65035c417fe69396bd8c0d5c/6543e531eca6def09e78b0c5_cursor-card-desktop-poster-00001.jpg",
            src: "https://cdn.prod.website-files.com/65035c417fe69396bd8c0d5c/6543e531eca6def09e78b0c5_cursor-card-desktop-transcode.mp4",
            title: "Receive Money",
        },
        {
            poster: "https://cdn.prod.website-files.com/65035c417fe69396bd8c0d5c/6526abe1c6394cfc7d57243a_cursor-card-desktop03-poster-00001.jpg",
            src: "https://cdn.prod.website-files.com/65035c417fe69396bd8c0d5c/6526abe1c6394cfc7d57243a_cursor-card-desktop03-transcode.mp4",
            title: "Exchange",
        },
        {
            poster: "https://cdn.prod.website-files.com/65035c417fe69396bd8c0d5c/6526ac27ac9773a0faf44d88_cursor-card-desktop04-poster-00001.jpg",
            src: "https://cdn.prod.website-files.com/65035c417fe69396bd8c0d5c/6526ac27ac9773a0faf44d88_cursor-card-desktop04-transcode.mp4",
            title: "Manage",
        },
    ];

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent): void => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setPosition({
                    x: e.clientX - rect.left - 480,
                    y: e.clientY - rect.top - 380,
                });
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const handleMouseEnter = (index: number): void => {
        setActiveBox(index);
    };

    const handleMouseMove = (index: number): void => {
        if (activeBox !== index) setActiveBox(index);
    };

    const getVideoStyle = (): React.CSSProperties => ({
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: "transform 0.1s ease-out",
        width: "300px",
        height: "300px",
        zIndex: 10,
    });

    return (
        <div
            ref={containerRef}
            className="flex flex-1 p-6 justify-evenly items-center flex-col min-h-screen overflow-hidden"
        >
            {/* Floating video container */}
            {activeBox !== null && (
                <div
                    className="fixed pointer-events-none"
                    style={getVideoStyle()}
                >
                    <video
                        className="w-full h-full object-cover rounded-2xl"
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster={videos[activeBox].poster}
                    >
                        <source src={videos[activeBox].src} type="video/mp4" />
                    </video>
                </div>
            )}

            {/* Interactive sections */}
            <div className="grid grid-cols-4 w-full mx-auto h-full z-10 absolute top-14">
                {videos.map((video, index) => (
                    <div
                        key={index}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseMove={() => handleMouseMove(index)}
                        onMouseLeave={() => setActiveBox(null)}
                        className="h-full w-full"
                    ></div>
                ))}
            </div>

            {/* Main content */}
            <h1 className="uppercase font-bold text-7xl md:text-8xl text-center mb-12 z-0">
                Money Beyond Borders
            </h1>

            <div>
                <p className="text-center max-w-md mx-auto mb-6 z-0">
                    Discover our global payment platform. Powered by open,
                    decentralised and interoperable network.
                </p>
                <div className="flex justify-center">
                    {ready && authenticated ? (
                        <Button
                            className="bg-[#666eff] hover:bg-[#666eff]/90 py-3 px-6 text-white rounded-lg transition-colors z-20"
                            onClick={() => router.push("/dashboard")}
                        >
                            Dashboard
                        </Button>
                    ) : (
                        <Button
                            className="bg-[#666eff] hover:bg-[#666eff]/90 py-3 px-6 text-white rounded-lg transition-colors z-20"
                            onClick={login}
                        >
                            CREATE ACCOUNT
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

const TextsTransition = () => {
    return (
        <div className="h-screen">
            <h1 className="uppercase font-bold text-5xl md:text-8xl text-center">
                A New Way To
            </h1>
            <h1 className="uppercase font-bold text-5xl md:text-8xl text-center text-[#666eff]">
                Pay
            </h1>
            <h1 className="uppercase font-bold text-5xl md:text-8xl text-center text-[#666eff]">
                Send
            </h1>
            <h1 className="uppercase font-bold text-5xl md:text-8xl text-center text-[#666eff]">
                Receive
            </h1>
            <h1 className="uppercase font-bold text-5xl md:text-8xl text-center text-[#666eff]">
                Exchange
            </h1>
            <h1 className="uppercase font-bold text-5xl md:text-8xl text-center text-[#666eff]">
                Get Paid
            </h1>
        </div>
    );
};

export default function LoginPage() {
    return (
        <>
            <div className="min-h-screen min-w-full">
                <Hero />
                <TextsTransition />
            </div>
        </>
    );
}