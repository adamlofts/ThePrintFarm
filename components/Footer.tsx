import React, {useState} from 'react'
import styles from './EmbedForm.module.css';
import {crossSpecAndFiles, defaultSpec, quote} from "@api/api";
import {useSupabase} from "@hooks/SupabaseProvider";
import {Auth} from "@supabase/auth-ui-react";
import {ThemeSupa} from "@supabase/auth-ui-shared";
import {SpecDropdown} from "./SpecDropdown";
import {FormDispatch} from "./PartDispatch";
import {FileDropWrapper} from "./ui/FileDropWrapper";

import React from "react";

export function Footer() {
    return (
        <>
            <div
                id="yui_3_17_2_1_1759322580136_415"
                className="content"
            >
                <div
                    id="yui_3_17_2_1_1759322580136_414"
                    style={{ backgroundColor: "#393939", color: "white" }}
                >
                    <div
                        id="yui_3_17_2_1_1759322580136_413"
                        className="fluid-engine fe-68bf005601a7da273274b675"
                        style={{
                            gridArea: "1 / 1 / -1 / -1",
                            gap: "11px",
                            display: "grid",
                            position: "relative",
                            overflowX: "clip",
                            gridTemplateRows:
                                "repeat(12,minmax(calc(min(2000px, calc(100vw - 1vw * 2 - 0vw )) * 0.0215), auto))",
                            gridTemplateColumns:
                                "minmax(calc(1vw - 11.0px), 1fr)\n      repeat(24, minmax(0, calc( ( 2000px - (11.0px * (24 - 1)) ) / 24 )))\n      minmax(calc(1vw - 11.0px), 1fr)",
                        }}
                    >
                        <div
                            className="fe-block fe-block-286c6e9ef55fc40eb8b6"
                            style={{
                                gridArea: "2 / 3 / 4 / 11",
                                zIndex: 1,
                                mixBlendMode: "normal",
                            }}
                        >
                            <div
                                id="block-286c6e9ef55fc40eb8b6"
                                className="sqs-block html-block sqs-block-html"
                                style={{
                                    position: "relative",
                                    clear: "none",
                                    borderColor: "hsla(188,100%,32.35%,1)",
                                    display: "flex",
                                    height: "100%",
                                    width: "100%",
                                    flexDirection: "column",
                                    paddingTop: "0px",
                                    paddingBottom: "0px",
                                    justifyContent: "flex-start",
                                }}
                            >
                                <div
                                    className="sqs-block-content preFade fadeIn"
                                    style={{
                                        transitionProperty: "opacity",
                                        transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)",
                                        transitionDuration: "0.5s",
                                        opacity: 1,
                                    }}
                                >
                                    <div className="sqs-html-content" style={{ outline: "none" }}>
                                        <p
                                            className="preFlex flexIn"
                                            style={{
                                                margin: "1rem 0px",
                                                lineHeight: "1.9em",
                                                transitionProperty: "transform, opacity, clip-path",
                                                opacity: 1,
                                                transform: "translate(0%, 0%)",
                                                overflowWrap: "break-word",
                                                marginTop: "0px",
                                                marginBottom: "0px",
                                                whiteSpace: "pre-wrap",
                                                transitionTimingFunction:
                                                    "cubic-bezier(0.19, 1, 0.22, 1)",
                                                transitionDuration: "0.5s",
                                            }}
                                        >
                                            <em style={{ overflowWrap: "break-word" }}>
                                                Customer Support
                                            </em>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="fe-block fe-block-yui_3_17_2_1_1757429006185_19392"
                            style={{
                                gridArea: "3 / 3 / 5 / 11",
                                zIndex: 5,
                                mixBlendMode: "normal",
                            }}
                        >
                            <div
                                id="block-yui_3_17_2_1_1757429006185_19392"
                                className="sqs-block html-block sqs-block-html"
                                style={{
                                    position: "relative",
                                    clear: "none",
                                    borderColor: "hsla(188,100%,32.35%,1)",
                                    display: "flex",
                                    height: "100%",
                                    width: "100%",
                                    flexDirection: "column",
                                    paddingTop: "0px",
                                    paddingBottom: "0px",
                                    justifyContent: "flex-start",
                                }}
                            >
                                <div
                                    className="sqs-block-content preFade fadeIn"
                                    style={{
                                        transitionProperty: "opacity",
                                        transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)",
                                        transitionDuration: "0.5s",
                                        opacity: 1,
                                    }}
                                >
                                    <div className="sqs-html-content" style={{ outline: "none" }}>
                                        <p
                                            className="preFlex flexIn"
                                            style={{
                                                margin: "1rem 0px",
                                                lineHeight: "1.9em",
                                                transitionProperty: "transform, opacity, clip-path",
                                                opacity: 1,
                                                transform: "translate(0%, 0%)",
                                                overflowWrap: "break-word",
                                                marginTop: "0px",
                                                marginBottom: "0px",
                                                whiteSpace: "pre-wrap",
                                                transitionTimingFunction:
                                                    "cubic-bezier(0.19, 1, 0.22, 1)",
                                                transitionDuration: "0.5s",
                                            }}
                                        >
                                            <a
                                                href="mailto:support@theprintfarm.co.uk?"
                                                target="_blank"
                                                style={{
                                                    background: "0px 0px",
                                                    cursor: "pointer",
                                                    whiteSpace: "initial",
                                                    textUnderlineOffset: "0.2em",
                                                    textDecorationSkipInk: "auto",
                                                    color: "hsla(188,100%,32.35%,1)",
                                                    textDecoration: "none",
                                                    backgroundPosition: "left bottom",
                                                    transition:
                                                        "color 0.6s cubic-bezier(0.19, 1, 0.22, 1), background-size calc(0.3s) cubic-bezier(0.19, 1, 0.22, 1)",
                                                    backgroundImage:
                                                        "linear-gradient(currentcolor, currentcolor)",
                                                    backgroundRepeat: "no-repeat",
                                                    backgroundSize: "100% 1px",
                                                    overflowWrap: "break-word",
                                                    display: "inline-block",
                                                }}
                                            >
                                                support@theprintfarm.co.uk
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="fe-block fe-block-62831a91e3df788b9089"
                            style={{
                                gridArea: "5 / 3 / 7 / 11",
                                zIndex: 2,
                                mixBlendMode: "normal",
                            }}
                        >
                            <div
                                id="block-62831a91e3df788b9089"
                                className="sqs-block html-block sqs-block-html"
                                style={{
                                    position: "relative",
                                    clear: "none",
                                    borderColor: "hsla(188,100%,32.35%,1)",
                                    display: "flex",
                                    height: "100%",
                                    width: "100%",
                                    flexDirection: "column",
                                    paddingTop: "0px",
                                    paddingBottom: "0px",
                                    justifyContent: "flex-start",
                                }}
                            >
                                <div
                                    className="sqs-block-content preFade fadeIn"
                                    style={{
                                        transitionProperty: "opacity",
                                        transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)",
                                        transitionDuration: "0.5s",
                                        opacity: 1,
                                    }}
                                >
                                    <div className="sqs-html-content" style={{ outline: "none" }}>
                                        <p
                                            className="preFlex flexIn"
                                            style={{
                                                margin: "1rem 0px",
                                                lineHeight: "1.9em",
                                                transitionProperty: "transform, opacity, clip-path",
                                                opacity: 1,
                                                transform: "translate(0%, 0%)",
                                                overflowWrap: "break-word",
                                                marginTop: "0px",
                                                marginBottom: "0px",
                                                whiteSpace: "pre-wrap",
                                                transitionTimingFunction:
                                                    "cubic-bezier(0.19, 1, 0.22, 1)",
                                                transitionDuration: "0.5s",
                                            }}
                                        >
                                            <em style={{ overflowWrap: "break-word" }}>
                                                General Enquiries
                                            </em>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="fe-block fe-block-bd6c5d28dea4bd9bba17"
                            style={{
                                gridArea: "6 / 3 / 8 / 11",
                                zIndex: 2,
                                mixBlendMode: "normal",
                            }}
                        >
                            <div
                                id="block-bd6c5d28dea4bd9bba17"
                                className="sqs-block html-block sqs-block-html"
                                style={{
                                    position: "relative",
                                    clear: "none",
                                    borderColor: "hsla(188,100%,32.35%,1)",
                                    display: "flex",
                                    height: "100%",
                                    width: "100%",
                                    flexDirection: "column",
                                    paddingTop: "0px",
                                    paddingBottom: "0px",
                                    justifyContent: "flex-start",
                                }}
                            >
                                <div
                                    className="sqs-block-content preFade fadeIn"
                                    style={{
                                        transitionProperty: "opacity",
                                        transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)",
                                        transitionDuration: "0.5s",
                                        opacity: 1,
                                    }}
                                >
                                    <div className="sqs-html-content" style={{ outline: "none" }}>
                                        <p
                                            className="preFlex flexIn"
                                            style={{
                                                margin: "1rem 0px",
                                                lineHeight: "1.9em",
                                                transitionProperty: "transform, opacity, clip-path",
                                                opacity: 1,
                                                transform: "translate(0%, 0%)",
                                                overflowWrap: "break-word",
                                                marginTop: "0px",
                                                marginBottom: "0px",
                                                whiteSpace: "pre-wrap",
                                                transitionTimingFunction:
                                                    "cubic-bezier(0.19, 1, 0.22, 1)",
                                                transitionDuration: "0.5s",
                                            }}
                                        >
                                            <a
                                                href="mailto:hello@theprintfarm.co.uk?"
                                                target="_blank"
                                                style={{
                                                    background: "0px 0px",
                                                    cursor: "pointer",
                                                    whiteSpace: "initial",
                                                    textUnderlineOffset: "0.2em",
                                                    textDecorationSkipInk: "auto",
                                                    color: "hsla(188,100%,32.35%,1)",
                                                    textDecoration: "none",
                                                    backgroundPosition: "left bottom",
                                                    transition:
                                                        "color 0.6s cubic-bezier(0.19, 1, 0.22, 1), background-size calc(0.3s) cubic-bezier(0.19, 1, 0.22, 1)",
                                                    backgroundImage:
                                                        "linear-gradient(currentcolor, currentcolor)",
                                                    backgroundRepeat: "no-repeat",
                                                    backgroundSize: "100% 1px",
                                                    overflowWrap: "break-word",
                                                    display: "inline-block",
                                                }}
                                            >
                                                hello@theprintfarm.co.uk
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="fe-block fe-block-5319490b5de26e7e6600"
                            style={{
                                gridArea: "9 / 3 / 13 / 8",
                                zIndex: 2,
                                mixBlendMode: "normal",
                            }}
                        >
                            <div
                                id="block-5319490b5de26e7e6600"
                                className="sqs-block html-block sqs-block-html"
                                style={{
                                    position: "relative",
                                    clear: "none",
                                    borderColor: "hsla(188,100%,32.35%,1)",
                                    display: "flex",
                                    height: "100%",
                                    width: "100%",
                                    flexDirection: "column",
                                    paddingTop: "0px",
                                    paddingBottom: "0px",
                                    justifyContent: "flex-start",
                                }}
                            >
                                <div
                                    className="sqs-block-content preFade fadeIn"
                                    style={{
                                        transitionProperty: "opacity",
                                        transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)",
                                        transitionDuration: "0.5s",
                                        opacity: 1,
                                    }}
                                >
                                    <div className="sqs-html-content" style={{ outline: "none" }}>
                                        <p
                                            className="preFlex flexIn"
                                            style={{
                                                margin: "1rem 0px",
                                                lineHeight: "1.9em",
                                                transitionProperty: "transform, opacity, clip-path",
                                                opacity: 1,
                                                transform: "translate(0%, 0%)",
                                                overflowWrap: "break-word",
                                                marginTop: "0px",
                                                whiteSpace: "pre-wrap",
                                                transitionTimingFunction:
                                                    "cubic-bezier(0.19, 1, 0.22, 1)",
                                                transitionDuration: "0.5s",
                                            }}
                                        >
                                            Further Information
                                        </p>
                                        <p
                                            className="preFlex flexIn"
                                            style={{
                                                margin: "1rem 0px",
                                                lineHeight: "1.9em",
                                                transitionProperty: "transform, opacity, clip-path",
                                                opacity: 1,
                                                transform: "translate(0%, 0%)",
                                                overflowWrap: "break-word",
                                                marginBottom: "0px",
                                                whiteSpace: "pre-wrap",
                                                transitionTimingFunction:
                                                    "cubic-bezier(0.19, 1, 0.22, 1)",
                                                transitionDuration: "0.5s",
                                            }}
                                        >
                                            <a
                                                href="https://www.theprintfarm.co.uk/services"
                                                style={{
                                                    background: "0px 0px",
                                                    cursor: "pointer",
                                                    whiteSpace: "initial",
                                                    textUnderlineOffset: "0.2em",
                                                    textDecorationSkipInk: "auto",
                                                    color: "hsla(188,100%,32.35%,1)",
                                                    textDecoration: "none",
                                                    backgroundPosition: "left bottom",
                                                    transition:
                                                        "color 0.6s cubic-bezier(0.19, 1, 0.22, 1), background-size calc(0.3s) cubic-bezier(0.19, 1, 0.22, 1)",
                                                    backgroundImage:
                                                        "linear-gradient(currentcolor, currentcolor)",
                                                    backgroundRepeat: "no-repeat",
                                                    backgroundSize: "100% 1px",
                                                    overflowWrap: "break-word",
                                                    display: "inline-block",
                                                }}
                                            >
                                                Services Offered
                                            </a>
                                            <br style={{ overflowWrap: "break-word" }} />
                                            <a
                                                href="https://www.theprintfarm.co.uk/materials"
                                                style={{
                                                    background: "0px 0px",
                                                    cursor: "pointer",
                                                    whiteSpace: "initial",
                                                    textUnderlineOffset: "0.2em",
                                                    textDecorationSkipInk: "auto",
                                                    color: "hsla(188,100%,32.35%,1)",
                                                    textDecoration: "none",
                                                    backgroundPosition: "left bottom",
                                                    transition:
                                                        "color 0.6s cubic-bezier(0.19, 1, 0.22, 1), background-size calc(0.3s) cubic-bezier(0.19, 1, 0.22, 1)",
                                                    backgroundImage:
                                                        "linear-gradient(currentcolor, currentcolor)",
                                                    backgroundRepeat: "no-repeat",
                                                    backgroundSize: "100% 1px",
                                                    overflowWrap: "break-word",
                                                    display: "inline-block",
                                                }}
                                            >
                                                Available Materials
                                            </a>
                                            <br style={{ overflowWrap: "break-word" }} />
                                            <a
                                                href="https://www.theprintfarm.co.uk/contactus"
                                                style={{
                                                    background: "0px 0px",
                                                    cursor: "pointer",
                                                    whiteSpace: "initial",
                                                    textUnderlineOffset: "0.2em",
                                                    textDecorationSkipInk: "auto",
                                                    color: "hsla(188,100%,32.35%,1)",
                                                    textDecoration: "none",
                                                    backgroundPosition: "left bottom",
                                                    transition:
                                                        "color 0.6s cubic-bezier(0.19, 1, 0.22, 1), background-size calc(0.3s) cubic-bezier(0.19, 1, 0.22, 1)",
                                                    backgroundImage:
                                                        "linear-gradient(currentcolor, currentcolor)",
                                                    backgroundRepeat: "no-repeat",
                                                    backgroundSize: "100% 1px",
                                                    overflowWrap: "break-word",
                                                    display: "inline-block",
                                                }}
                                            >
                                                Contact Information
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="fe-block fe-block-3cb83c1b5caa4dddbb39"
                            style={{
                                gridArea: "2 / 12 / 10 / 19",
                                zIndex: 3,
                                mixBlendMode: "normal",
                            }}
                        >
                            <div
                                id="block-3cb83c1b5caa4dddbb39"
                                className="sqs-block html-block sqs-block-html"
                                style={{
                                    position: "relative",
                                    clear: "none",
                                    borderColor: "hsla(188,100%,32.35%,1)",
                                    display: "flex",
                                    height: "100%",
                                    width: "100%",
                                    flexDirection: "column",
                                    paddingTop: "0px",
                                    paddingBottom: "0px",
                                    justifyContent: "flex-start",
                                }}
                            >
                                <div
                                    className="sqs-block-content preFade fadeIn"
                                    style={{
                                        transitionProperty: "opacity",
                                        transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)",
                                        transitionDuration: "0.5s",
                                        opacity: 1,
                                    }}
                                >
                                    <div className="sqs-html-content" style={{ outline: "none" }}>
                                        <p
                                            className="preFlex flexIn"
                                            style={{
                                                margin: "1rem 0px",
                                                lineHeight: "1.9em",
                                                transitionProperty: "transform, opacity, clip-path",
                                                opacity: 1,
                                                transform: "translate(0%, 0%)",
                                                overflowWrap: "break-word",
                                                marginTop: "0px",
                                                whiteSpace: "pre-wrap",
                                                transitionTimingFunction:
                                                    "cubic-bezier(0.19, 1, 0.22, 1)",
                                                transitionDuration: "0.5s",
                                            }}
                                        >
                                            <em style={{ overflowWrap: "break-word" }}>
                                                Other Information
                                            </em>
                                        </p>
                                        <p
                                            className="preFlex flexIn"
                                            style={{
                                                margin: "1rem 0px",
                                                lineHeight: "1.9em",
                                                transitionProperty: "transform, opacity, clip-path",
                                                opacity: 1,
                                                transform: "translate(0%, 0%)",
                                                overflowWrap: "break-word",
                                                marginBottom: "0px",
                                                whiteSpace: "pre-wrap",
                                                transitionTimingFunction:
                                                    "cubic-bezier(0.19, 1, 0.22, 1)",
                                                transitionDuration: "0.5s",
                                            }}
                                        >
                                            Enquiries Number:{" "}
                                            <a
                                                href="tel:+447375566668"
                                                target="_blank"
                                                style={{
                                                    background: "0px 0px",
                                                    cursor: "pointer",
                                                    whiteSpace: "initial",
                                                    textUnderlineOffset: "0.2em",
                                                    textDecorationSkipInk: "auto",
                                                    color: "hsla(188,100%,32.35%,1)",
                                                    textDecoration: "none",
                                                    backgroundPosition: "left bottom",
                                                    transition:
                                                        "color 0.6s cubic-bezier(0.19, 1, 0.22, 1), background-size calc(0.3s) cubic-bezier(0.19, 1, 0.22, 1)",
                                                    backgroundImage:
                                                        "linear-gradient(currentcolor, currentcolor)",
                                                    backgroundRepeat: "no-repeat",
                                                    backgroundSize: "100% 1px",
                                                    overflowWrap: "break-word",
                                                    display: "inline-block",
                                                }}
                                            >
                                                +447375566668
                                            </a>
                                            <br style={{ overflowWrap: "break-word" }} />
                                            Address: Kennedy House, BR53QY
                                            <br style={{ overflowWrap: "break-word" }} />
                                            <a
                                                href="https://www.theprintfarm.co.uk/about"
                                                style={{
                                                    background: "0px 0px",
                                                    cursor: "pointer",
                                                    whiteSpace: "initial",
                                                    textUnderlineOffset: "0.2em",
                                                    textDecorationSkipInk: "auto",
                                                    color: "hsla(188,100%,32.35%,1)",
                                                    textDecoration: "none",
                                                    backgroundPosition: "left bottom",
                                                    transition:
                                                        "color 0.6s cubic-bezier(0.19, 1, 0.22, 1), background-size calc(0.3s) cubic-bezier(0.19, 1, 0.22, 1)",
                                                    backgroundImage:
                                                        "linear-gradient(currentcolor, currentcolor)",
                                                    backgroundRepeat: "no-repeat",
                                                    backgroundSize: "100% 1px",
                                                    overflowWrap: "break-word",
                                                    display: "inline-block",
                                                }}
                                            >
                                                About Company
                                                <br style={{ overflowWrap: "break-word" }} />
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            id="yui_3_17_2_1_1759322580136_412"
                            className="fe-block fe-block-yui_3_17_2_1_1757400654766_30117"
                            style={{ gridArea: "2 / 20 / 8 / 24", zIndex: 4 }}
                        >
                            <div
                                id="block-yui_3_17_2_1_1757400654766_30117"
                                className="sqs-block image-block sqs-block-image sqs-stretched sqs-text-ready"
                                style={{
                                    position: "relative",
                                    display: "flex",
                                    height: "100%",
                                    width: "100%",
                                    flexDirection: "column",
                                    paddingTop: "0px",
                                    paddingBottom: "0px",
                                    justifyContent: "center",
                                    clear: "both",
                                }}
                            >
                                <div
                                    id="yui_3_17_2_1_1759322580136_411"
                                    className="sqs-block-content preFade fadeIn"
                                    style={{
                                        transitionProperty: "opacity",
                                        height: "100%",
                                        width: "100%",
                                        transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)",
                                        transitionDuration: "0.5s",
                                        opacity: 1,
                                    }}
                                >
                                    <div
                                        id="yui_3_17_2_1_1759322580136_410"
                                        className="image-block-outer-wrapper layout-caption-below design-layout-fluid image-position-center combination-animation-site-default individual-animation-site-default sqs-narrow-width animation-loaded"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            transform: "translateZ(0px)",
                                        }}
                                    >
                                        <div
                                            id="yui_3_17_2_1_1759322580136_409"
                                            className="fluid-image-animation-wrapper sqs-image sqs-block-alignment-wrapper preFlex flexIn"
                                            style={{
                                                minHeight: "1px",
                                                transitionProperty: "transform, opacity, clip-path",
                                                opacity: 1,
                                                alignItems: "center",
                                                width: "100%",
                                                height: "100%",
                                                display: "flex",
                                                transform: "none",
                                                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                                                justifyContent: "center",
                                                transitionTimingFunction:
                                                    "cubic-bezier(0.19, 1, 0.22, 1)",
                                                transitionDuration: "0.5s",
                                            }}
                                        >
                                            <div
                                                id="yui_3_17_2_1_1759322580136_408"
                                                className="fluid-image-container sqs-image-content"
                                                style={{
                                                    overflow: "hidden",
                                                    maskImage:
                                                        "-webkit-radial-gradient(center, white, black)",
                                                    position: "relative",
                                                    width: "100%",
                                                    height: "199px",
                                                }}
                                            >
                                                <div
                                                    id="yui_3_17_2_1_1759322580136_407"
                                                    className="content-fit"
                                                >
                                                    <img
                                                        height={199}
                                                        width={199}
                                                        sizes="(max-width: 640px) 100vw, (max-width: 767px) 100vw, 16.666666666666664vw"
                                                        src="https://images.squarespace-cdn.com/content/v1/68be8411d6e2ce3c2038f169/3e6c7f12-649d-4979-a753-6262fd54bd32/TPF_Logo_BW.png"
                                                        srcSet="https://images.squarespace-cdn.com/content/v1/68be8411d6e2ce3c2038f169/3e6c7f12-649d-4979-a753-6262fd54bd32/TPF_Logo_BW.png?format=100w 100w, https://images.squarespace-cdn.com/content/v1/68be8411d6e2ce3c2038f169/3e6c7f12-649d-4979-a753-6262fd54bd32/TPF_Logo_BW.png?format=300w 300w, https://images.squarespace-cdn.com/content/v1/68be8411d6e2ce3c2038f169/3e6c7f12-649d-4979-a753-6262fd54bd32/TPF_Logo_BW.png?format=500w 500w, https://images.squarespace-cdn.com/content/v1/68be8411d6e2ce3c2038f169/3e6c7f12-649d-4979-a753-6262fd54bd32/TPF_Logo_BW.png?format=750w 750w, https://images.squarespace-cdn.com/content/v1/68be8411d6e2ce3c2038f169/3e6c7f12-649d-4979-a753-6262fd54bd32/TPF_Logo_BW.png?format=1000w 1000w, https://images.squarespace-cdn.com/content/v1/68be8411d6e2ce3c2038f169/3e6c7f12-649d-4979-a753-6262fd54bd32/TPF_Logo_BW.png?format=1500w 1500w, https://images.squarespace-cdn.com/content/v1/68be8411d6e2ce3c2038f169/3e6c7f12-649d-4979-a753-6262fd54bd32/TPF_Logo_BW.png?format=2500w 2500w"
                                                        style={{
                                                            border: "0px",
                                                            width: "100%",
                                                            height: "100%",
                                                            position: "absolute",
                                                            display: "block",
                                                            objectFit: "contain",
                                                            objectPosition: "50% 50%",
                                                        }}
                                                    />
                                                    <div
                                                        className="fluidImageOverlay"
                                                        style={{
                                                            backgroundColor: "hsla(0,0%,22.35%,.5)",
                                                            position: "absolute",
                                                            top: "0px",
                                                            left: "0px",
                                                            width: "100%",
                                                            height: "100%",
                                                            mixBlendMode: "normal",
                                                            opacity: 0,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            id="yui_3_17_2_1_1759322580136_426"
                            className="fe-block fe-block-yui_3_17_2_1_1757429006185_20409"
                            style={{ gridArea: "8 / 19 / 10 / 25", zIndex: 6 }}
                        >
                            <div
                                id="block-yui_3_17_2_1_1757429006185_20409"
                                className="sqs-block image-block sqs-block-image sqs-stretched sqs-text-ready"
                                style={{
                                    position: "relative",
                                    display: "flex",
                                    height: "100%",
                                    width: "100%",
                                    flexDirection: "column",
                                    paddingTop: "0px",
                                    paddingBottom: "0px",
                                    justifyContent: "center",
                                    clear: "both",
                                }}
                            >
                                <div
                                    id="yui_3_17_2_1_1759322580136_425"
                                    className="sqs-block-content preFade fadeIn"
                                    style={{
                                        transitionProperty: "opacity",
                                        height: "100%",
                                        width: "100%",
                                        transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)",
                                        transitionDuration: "0.5s",
                                        opacity: 1,
                                    }}
                                >
                                    <div
                                        id="yui_3_17_2_1_1759322580136_424"
                                        className="image-block-outer-wrapper layout-caption-below design-layout-fluid image-position-center combination-animation-site-default individual-animation-site-default sqs-narrow-width animation-loaded"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            transform: "translateZ(0px)",
                                        }}
                                    >
                                        <div
                                            id="yui_3_17_2_1_1759322580136_423"
                                            className="fluid-image-animation-wrapper sqs-image sqs-block-alignment-wrapper preFlex flexIn"
                                            style={{
                                                minHeight: "1px",
                                                transitionProperty: "transform, opacity, clip-path",
                                                opacity: 1,
                                                alignItems: "center",
                                                width: "100%",
                                                height: "100%",
                                                display: "flex",
                                                transform: "none",
                                                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                                                justifyContent: "center",
                                                transitionTimingFunction:
                                                    "cubic-bezier(0.19, 1, 0.22, 1)",
                                                transitionDuration: "0.5s",
                                            }}
                                        >
                                            <div
                                                id="yui_3_17_2_1_1759322580136_422"
                                                className="fluid-image-container sqs-image-content"
                                                style={{
                                                    overflow: "hidden",
                                                    maskImage:
                                                        "-webkit-radial-gradient(center, white, black)",
                                                    position: "relative",
                                                    width: "100%",
                                                    height: "35.872px",
                                                }}
                                            >
                                                <div
                                                    id="yui_3_17_2_1_1759322580136_421"
                                                    className="content-fit"
                                                >
                                                    <img
                                                        height={36}
                                                        width={304}
                                                        sizes="(max-width: 640px) 100vw, (max-width: 767px) 100vw, 25vw"
                                                        src="https://images.squarespace-cdn.com/content/v1/68be8411d6e2ce3c2038f169/64b40da0-ec75-47c0-a7c5-ecf2854fa756/TPF2025.png"
                                                        srcSet="https://images.squarespace-cdn.com/content/v1/68be8411d6e2ce3c2038f169/64b40da0-ec75-47c0-a7c5-ecf2854fa756/TPF2025.png?format=100w 100w, https://images.squarespace-cdn.com/content/v1/68be8411d6e2ce3c2038f169/64b40da0-ec75-47c0-a7c5-ecf2854fa756/TPF2025.png?format=300w 300w, https://images.squarespace-cdn.com/content/v1/68be8411d6e2ce3c2038f169/64b40da0-ec75-47c0-a7c5-ecf2854fa756/TPF2025.png?format=500w 500w, https://images.squarespace-cdn.com/content/v1/68be8411d6e2ce3c2038f169/64b40da0-ec75-47c0-a7c5-ecf2854fa756/TPF2025.png?format=750w 750w, https://images.squarespace-cdn.com/content/v1/68be8411d6e2ce3c2038f169/64b40da0-ec75-47c0-a7c5-ecf2854fa756/TPF2025.png?format=1000w 1000w, https://images.squarespace-cdn.com/content/v1/68be8411d6e2ce3c2038f169/64b40da0-ec75-47c0-a7c5-ecf2854fa756/TPF2025.png?format=1500w 1500w, https://images.squarespace-cdn.com/content/v1/68be8411d6e2ce3c2038f169/64b40da0-ec75-47c0-a7c5-ecf2854fa756/TPF2025.png?format=2500w 2500w"
                                                        style={{
                                                            border: "0px",
                                                            width: "100%",
                                                            height: "100%",
                                                            position: "absolute",
                                                            display: "block",
                                                            objectFit: "contain",
                                                            objectPosition: "50% 50%",
                                                        }}
                                                    />
                                                    <div
                                                        className="fluidImageOverlay"
                                                        style={{
                                                            backgroundColor: "hsla(0,0%,22.35%,.5)",
                                                            position: "absolute",
                                                            top: "0px",
                                                            left: "0px",
                                                            width: "100%",
                                                            height: "100%",
                                                            mixBlendMode: "normal",
                                                            opacity: 0,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
