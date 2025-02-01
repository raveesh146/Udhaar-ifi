'use client'
import { working } from "@/utils/constants";
import { useTheme } from '@/context/themecontext';

export function HowItWorks() {
    const { theme } = useTheme();
    
    return (
        <section className={`how-it-works ${theme}`}>
            <div className="container">
                <h2 className="text-center mb-5">How It Works</h2>
                
                <div className="row g-4">
                    {working.map((item, idx) => (
                        <div className="col-md-4" key={`how-it-works-${idx}`}>
                            <div className="feature-card">
                                <span className="step-number">{idx + 1}</span>
                                <h4 className="mt-4 mb-3">{item.heading}</h4>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}