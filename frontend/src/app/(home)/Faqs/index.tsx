'use client'
import { faq } from "@/utils/constants";
import { useTheme } from '@/context/themecontext';

export function Faqs() {
    const { theme } = useTheme();
    
    return (
        <section className={`faqs ${theme}`} id="faq">
            <div className="container">
                <h2 className="text-center mb-5">Frequently Asked Questions</h2>
                
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="accordion" id="faqAccordion">
                            {faq.map((item, idx) => (
                                <div className="accordion-item" key={`faq-${idx}`}>
                                    <h3 className="accordion-header">
                                        <button 
                                            className="accordion-button collapsed" 
                                            type="button" 
                                            data-bs-toggle="collapse" 
                                            data-bs-target={`#collapse-${idx}`}
                                        >
                                            {item.ques}
                                        </button>
                                    </h3>
                                    <div 
                                        id={`collapse-${idx}`} 
                                        className="accordion-collapse collapse" 
                                        data-bs-parent="#faqAccordion"
                                    >
                                        <div className="accordion-body">
                                            {item.ans}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}