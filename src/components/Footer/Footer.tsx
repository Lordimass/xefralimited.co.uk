import "./Footer.css"

export function Footer() {
    return <div className="footer">
        <p>
            Website made by <a href="https://lordimass.net">Sam Knight</a> <br/>
        </p>
        <br/>
        <p className="footer-company-information">
            {"\u00A9 2026"} {/* <- Copyright character */}
            <a href="https://lordimass.net">Sam Knight</a>. Licensed exclusively to
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