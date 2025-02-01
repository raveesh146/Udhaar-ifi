"use client"
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect } from "react";
import { loadSlim } from "@tsparticles/slim";
import { useTheme } from '@/context/themecontext'; 

export const InnerParticlesComponent = (props) => {
    const { theme } = useTheme();
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        })
    }, []);
    const particlesOptions = {
        particles: {
            number: {
                value: 15,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: theme === 'dark' ? '#404040' : '#f0f0f0'
            },
            opacity: {
                value: 0.3
            },
            size: {
                value: 3
            },
            move: {
                enable: true,
                speed: 1
            }
        }
    }
    return <Particles id={props.id} options={particlesOptions} />;
};
