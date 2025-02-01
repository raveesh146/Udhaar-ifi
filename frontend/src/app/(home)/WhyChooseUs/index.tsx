'use client'
import { chooseUs } from '@/utils/constants'
import { useTheme } from '@/context/themecontext'

export function WhyChooseUs() {
    const { theme } = useTheme();
    
    return (
        <section className={`why-choose-us ${theme}`}>
            <div className="container">
                <h2 className="text-center mb-5">Why Choose Us</h2>
                
                <div className="row g-4">
                    {chooseUs.map((item, idx) => (
                        <div className="col-md-4" key={`why-choose-${idx}`}>
                            <div className="benefit-card">
                                <div className="benefit-icon">
                                    <img 
                                        src={theme === 'dark' ? item.imgurl : item.imgurl_active} 
                                        alt={item.title}
                                        width={40}
                                        height={40}
                                    />
                                </div>
                                <h4 className="mt-4 mb-3">{item.title}</h4>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}