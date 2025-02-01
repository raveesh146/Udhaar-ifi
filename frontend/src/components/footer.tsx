"use client"
import { discordLink, footerLinks, project, telegramLink, twitterLnk } from '@/utils/constants';
import Image from 'next/image'
import Link from 'next/link'
import { BsDiscord, BsTelegram } from "react-icons/bs";
import { useTheme } from '@/context/themecontext';
import { BsTwitterX } from "react-icons/bs";


const Footer = () => {
    const { theme } = useTheme()
    return (
        <>
            <section className={`footer ${theme == 'light' ? 'light-theme' : 'dark-theme'}`}>
                <div className="container">
                    <div className="row popped rounded">
                        <div className="col-lg-3 pe-5">
                            <Image src="/media/logo.png" alt="logo" height={65} width={70} className='rounded footer-logo' />
                            <p className='pt-3'>Access liquidity without parting with your NFTs. Leverage them as collateral for secure, decentralized loans while keeping ownership of your digital assets intact.</p>
                        </div>
                        <div className="col-lg-3">
                            <h4>Quick View</h4>
                            <p className="br"></p>
                            <ul className='ft-list m-0 p-0'>
                                {
                                    footerLinks.map((v, idx) => (
                                        <Link href={v.path} key={`path-${idx}`}>
                                            <li>{v.heading}</li>
                                        </Link>
                                    ))
                                }
                            </ul>
                         </div>
                         {/* todo : work on the links and profile pucs */}
                         <div className="col-lg-3">
                            <h4>Developer</h4>
                            <p className="br"></p>
                            <ul className='ft-list m-0 p-0'>
                                <Link href={"https://github.com/raveesh146"} target='_blank'>
                                    <li><Image src={"/media/nfts/1.jpeg"} alt="Raveesh" height={24} width={24} className='me-2 rounded-circle' />Raveesh</li>
                                </Link>

                            </ul>
                        </div> 

                        <div className="col-lg-3">
                            <h4>Socials</h4>
                            <p className="br"></p>
                            <div className="social d-flex gap-2">
                                <Link href={discordLink} target='_blank'>
                                    <BsDiscord className='sc-icon' />
                                </Link>
                                <Link href={twitterLnk} target='_blank'>
                                    <BsTwitterX className='sc-icon'/>
                                </Link>
                                <Link href={telegramLink} target='_blank'>
                                    <BsTelegram className='sc-icon'/>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4 pt-2 ft-bottom">
                        <div className="col">
                            <p className="m-0">@Copyright 2025 {project}</p>
                        </div>
                        <div className="col d-flex justify-content-end">
                            <p className="m-0 text-end"><span>Privacy Policy</span> | <span>Terms and conditions</span></p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default Footer;