import React from "react";
import { ParticlesComponent } from "./ReactParticles";
import { project } from "@/utils/constants";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: `Home - ${project}`,
  description: `Homepage of ${project}`
}

export default function Home() {
  return (
    <React.Fragment>
      <ParticlesComponent id="particles-bg" />
      <Banner />
      <Features />
    </React.Fragment>
  );
}

function Banner() {
  return (
    <section className="banner">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="hero-content">
              <h1 className="hero-title">Borrow & Lend Against Your NFTs</h1>
              <p className="hero-subtitle">
                Access instant liquidity by using your NFTs as collateral, or earn yields by providing loans to borrowers.
              </p>
              <div className="hero-buttons">
                <Link href="/borrow/assets">
                  <button className="btn-primary me-3">Get a loan</button>
                </Link>
                <Link href="/lend/assets">
                  <button className="btn-secondary">Start lending</button>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-6 d-none d-lg-block">
            <div className="hero-image">
              <Image 
                src="/media/nfts/3.jpg" 
                alt="Featured NFT"
                width={400}
                height={400}
                className="floating-nft"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section className="features">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Lending</h3>
              <p>Your NFTs are safely stored in smart contracts until loan repayment</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Liquidity</h3>
              <p>Get immediate access to funds without selling your NFTs</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Earn Yields</h3>
              <p>Provide loans and earn attractive returns on your crypto</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
