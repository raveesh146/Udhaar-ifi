"use client"
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect } from "react";
import { loadSlim } from "@tsparticles/slim";
import { useTheme } from '@/context/themecontext';

export const ParticlesComponent = (props) => {
  const { theme } = useTheme();
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    })
  }, []);

  const particlesOptions = {
    particles: {
      number: {
        value: 10,
        density: {
          enable: true,
          value_area: 900
        }
      },
      color: {
        value: theme === 'dark' ? '#ffffff' : '#ffffff'
      },
      opacity: {
        value: 0.8
      },
      size: {
        value: 2
      },
      move: {
        enable: false
      }
    }
  }
  return <Particles id={props.id} options={particlesOptions} />; 
};