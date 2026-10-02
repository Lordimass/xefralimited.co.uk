import "./globals.css"
import Image from "next/image";

export default function Page() {
    return <div id={"contacts-page"}>
        <h1>Key Points of Contact</h1>
        <br/>
        <hr style={{width:"100%"}}/>
        <div className={"contacts"}>
            <Contact
                name={"Claire Platz"}
                img={"/logo.webp"}
                jobTitle={"Founder"}
                phone={"07557 371702"}
                email={"sherlockimaginarium@gmail.com"}
            />
            <Contact
                name={"Sam Tran"}
                img={"/logo.webp"}
                jobTitle={"Area Manager"}
                phone={"07539 011171"}
                email={"samtran.management@outlook.com"}
            />
            <Contact
                name={"Sam Knight"}
                img={"/logo.webp"}
                jobTitle={"Head of E-Commerce Operations"}
                email={"sam@thisshopissogay.com"}
            />
        </div>
        <hr style={{width:"100%"}}/>
        <div className={"contacts"}>
            <Contact
                name={"Ted F"}
                img={"/logo.webp"}
                jobTitle={"Team Leader"}
                phone={"07549 727963"}
            />
            <Contact
                name={"James R"}
                img={"/logo.webp"}
                jobTitle={"Team Leader"}
                phone={"07780 278252"}
            />
            <Contact
                name={"Fay B"}
                img={"/logo.webp"}
                jobTitle={"Team Leader"}
                phone={"07873 677224"}
            />
        </div>
    </div>
}

function Contact({name, img, jobTitle, phone, email}: {
    name: string,
    img: string,
    jobTitle: string,
    phone?: string,
    email?: string
}) {
    return <div className={"contact"}>
        <Image src={img} alt={name} width={200} height={200} />
        <hr style={{width:"100%"}}/>
        <div className={"contact-info"}>
            <h3>{name}</h3>
            <p>{jobTitle}</p>
            <p>{phone}</p>
            <p>{email}</p>
        </div>
    </div>
}