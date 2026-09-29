import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import 'bootstrap/dist/css/bootstrap.css';
import "./globals.css";
import Image from "next/image";
import {Container} from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import {NavbarBrand} from "react-bootstrap";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Xefra Ltd.",
  description: "Xefra Limited Staff Hub",
  robots: {index: false}
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} data-bs-theme="dark" >
      <body>
      <Header/>
      <main>
      {children}
      </main>
      <Footer/>
      </body>
    </html>
  );
}

function Header() {
    return (<Navbar expand="lg" className={"bg-body-primary"}>
            <Container>
                <NavbarBrand href={"/"}>
                    <Image src={"/logo.webp"} alt={"Xefra Ltd."} width={48} height={48} /> <h2>Staff Hub</h2>
                </NavbarBrand>
            </Container>
        </Navbar>
    );
}

function Footer() {
  return <div className="footer">
    <p>
      Website made by <a href="https://lordimass.net">Sam Knight</a> <br />
    </p>
    <br />
    <p className="footer-company-information">
      {"\u00A9"} {/* <- Copyright character */} 2026{" "}
      <a href="https://lordimass.net">Sam Knight</a>. Licensed exclusively to{" "}
      <a href="https://find-and-update.company-information.service.gov.uk/company/15502638">
        Xefra Ltd.
      </a>
      <span className="policy-separator" aria-hidden="true">
          /
        </span>
      <span>Company No. 15502638</span>
      <span className="policy-separator" aria-hidden="true">
          /
        </span>
      <span>
          Registered in England & Wales 74 Low Petergate, York, YO1 7HZ
        </span>
      <span className="policy-separator" aria-hidden="true">
          /
        </span>
      <span>Contact: support@thisshopissogay.com</span>
    </p>
  </div>
}
