import React, {useState} from 'react';
import styles from './CompleteProfilePage.module.css';
import {useSupabase} from "@hooks/SupabaseProvider";
import {CamyNav} from "@components/CamyNav";
import {completeProfile, getTenantId} from "@api/api";
import {useNavigate} from "react-router-dom";

export function CompleteProfilePage() {
    const {supabase, loading} = useSupabase();
    const navigate = useNavigate();
    const [country, setCountry] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [newsletterOptIn, setNewsletterOptIn] = useState(false);
    const [working, setWorking] = useState(false);

    const handleContinue = async () => {
        if (!country || !acceptedTerms) return;

        setWorking(true);
        const ret = await completeProfile(supabase, country, getTenantId());
        window.location.assign(import.meta.env.VITE_ROUTER_BASENAME);
    };

    return (
        <>
            <CamyNav/>
            <div className={styles.bg}>
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-6">
                            <div className={styles.panel}>
                                <div className="px-4 py-2">
                                    <h2 className="pt-4 mb-4">Complete Your Profile</h2>

                                    {/* Country Dropdown */}
                                    <div className="mb-3">
                                        <label htmlFor="country" className="form-label">Country</label>
                                        <select
                                            id="country"
                                            className="form-select"
                                            value={country}
                                            onChange={e => setCountry(e.target.value)}
                                        >
                                            <option value="">Select your country</option>
                                            <option value="GBR">United Kingdom</option>
                                            <option value="USA">United States</option>
                                            <option value="DEU">Germany</option>
                                            <option value="FRA">France</option>
                                            <option value="ESP">Spain</option>
                                            <option value="ITA">Italy</option>
                                            <option value="NLD">Netherlands</option>
                                            <option value="BEL">Belgium</option>
                                            <option value="SWE">Sweden</option>
                                            <option value="NOR">Norway</option>
                                            <option value="CHE">Switzerland</option>
                                        </select>
                                    </div>

                                    {/* Accept Terms Checkbox */}
                                    <div className="form-check mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="terms"
                                            checked={acceptedTerms}
                                            onChange={e => setAcceptedTerms(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="terms">
                                            I accept the <a href=".">terms and conditions</a>
                                        </label>
                                    </div>

                                    {/* Newsletter Checkbox */}
                                    <div className="form-check mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="newsletter"
                                            checked={newsletterOptIn}
                                            onChange={e => setNewsletterOptIn(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="newsletter">
                                            Sign me up for updates and the newsletter
                                        </label>
                                    </div>

                                    {/* Continue Button */}
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleContinue}
                                        disabled={!country || !acceptedTerms || working}
                                    >
                                        Continue
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
