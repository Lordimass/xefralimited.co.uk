"use client";

import {useEffect, useRef, useState} from "react";
import {createClient, login} from "@/lib/supabase/client";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {SubmitEvent} from "react";
import styles from "./page.module.css"
import safeFindDOMNode from "react-bootstrap/cjs/safeFindDOMNode";
import {AuthApiError} from "@supabase/supabase-js";
import {BlankHeader} from "@/components/Header/Header";
import {Footer} from "@/components/Footer/Footer";

export default function Home() {
    {
        const [mfaStep, setMfaStep] = useState<"enroll" | "challenge" | undefined>(undefined);
        const [factorId, setFactorId] = useState<string | undefined>(undefined);
        const [qrCode, setQrCode] = useState<string | undefined>(undefined);
        const [code, setCode] = useState("");

        const [validated, setValidated] = useState(false);
        const [error, setError] = useState<string | undefined>(undefined);
        const emailRef = useRef<HTMLInputElement>(null);
        const passwordRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
            const supabase = createClient()
            supabase.auth.getUser().then(async r => {
                if (r.error && r.error.name !== "AuthSessionMissingError" && r.error.name !== "AuthRetryableFetchError") {
                    console.error(r.error)
                    throw r.error;
                }
                if (!r.error && r.data.user) await startMfa(supabase);
            })
        }, [])

        async function startMfa(supabase = createClient()) {
            const {data: assurance, error: assuranceError} = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
            if (assuranceError) {
                console.warn(assuranceError);
                return;
            }
            if (assurance.currentLevel === "aal2") {
                window.location.href = "/staff";
                return;
            }

            // Check if 2FA is set up already
            const {data: factors, error: factorsError} = await supabase.auth.mfa.listFactors();
            if (factorsError) {
                console.warn(factorsError);
                return;
            }
            if (factors.totp[0]) {
                setFactorId(factors.totp[0].id);
                setMfaStep("challenge");
                return;
            }

            const {data: enrollment, error: enrollmentError} = await supabase.auth.mfa.enroll({factorType: "totp"});
            if (enrollmentError) {
                console.warn(enrollmentError);
                return;
            }
            setFactorId(enrollment.id);
            setQrCode(enrollment.totp.qr_code);
            setMfaStep("enroll");
        }

        async function verifyMfa() {
            if (!factorId) return;
            setError(undefined);
            const supabase = createClient();
            const {data: challenge, error: challengeError} = await supabase.auth.mfa.challenge({factorId});
            if (challengeError) {
                setError(challengeError.message);
                return;
            }
            const {error: verifyError} = await supabase.auth.mfa.verify({factorId, challengeId: challenge.id, code});
            if (verifyError) {
                setError("Invalid authentication code");
                return;
            }
            window.location.href = "/staff";
        }

        async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
            e.preventDefault();
            const form = e.currentTarget;
            const validity = form.checkValidity();
            setValidated(true);
            if (!validity) {
                e.stopPropagation();
                return;
            }

            const emailField = safeFindDOMNode(emailRef.current) as HTMLInputElement;
            const passwordField = safeFindDOMNode(passwordRef.current) as HTMLInputElement;
            let result;
            try {
                result = await login(emailField.value, passwordField.value)
            } catch (error) {
                if (!(error instanceof AuthApiError)) throw error;
                setError("Invalid email or password");
                return;
            }
            console.log(result)

            if (result?.newAccount) {
                window.location.href = "/staff";
            } else {
                await startMfa()
            }

        }

        return (<>
            <BlankHeader/>
            <main>
                {/* Form to show before MFA step starts */}
                <Form
                    id={styles.loginForm}
                    onSubmit={handleSubmit}
                    noValidate validated={validated}
                    hidden={!!mfaStep}
                >
                    <h2 id={styles.loginHeader}>Login or Create a New Account</h2>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" ref={emailRef} isInvalid={!!error}/>
                        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="********" ref={passwordRef} isInvalid={!!error}/>
                        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formSubmit">
                        <Button variant="primary" type="submit">
                            Login / Sign up
                        </Button>
                    </Form.Group>
                </Form>

                {/* Form to show after MFA step starts */}
                <Form id={styles.loginForm}
                      hidden={!mfaStep}
                      onSubmit={(e) => {
                          e.preventDefault();
                          verifyMfa().then();
                      }}
                >
                    <h2>{mfaStep === "enroll" ? "Set up two-factor authentication" : "Two-factor authentication"}</h2>
                    {mfaStep === "enroll" ? <>
                        <p>Scan this QR code with an authenticator app, then enter its six-digit code.</p>
                        {qrCode ?
                            <img id={styles.qrCode} src={qrCode} alt="Authenticator app QR code"/>
                            : null
                        }
                    </> : <p>Enter the six-digit code from your authenticator app.</p>}
                    <Form.Group className="mb-3" controlId="mfaCode">
                        <Form.Label>Authentication code</Form.Label>
                        <Form.Control
                            type="text" inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value.trim())}
                            isInvalid={!!error}
                            required
                        />
                        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="primary" type="submit">Verify code</Button>
                </Form>
            </main>
            <Footer/></>);
    }
}