import React from 'react';
import styles from './SpecDropdown.module.css';

export const specOptions = [{
    spec: 'fwpipe',
    title: "Filament Wound Tube",
    description: "",
    svg: 'data:image/svg+xml,%3Csvg%20width%3D%22200%22%20height%3D%22100%22%20viewBox%3D%220%200%20400%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3C!--%20Tube%20background%20--%3E%3Crect%20x%3D%2220%22%20y%3D%2250%22%20width%3D%22360%22%20height%3D%22100%22%20fill%3D%22%23f8f9fa%22%20stroke%3D%22%23aaa%22%20stroke-width%3D%222%22%20rx%3D%2210%22%2F%3E%3C!--%20%2B45%C2%B0%20windings%20--%3E%3Cg%20stroke%3D%22%23000%22%20stroke-width%3D%221%22%3E%3Cline%20x1%3D%2220%22%20y1%3D%22150%22%20x2%3D%2280%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%2240%22%20y1%3D%22150%22%20x2%3D%22100%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%2260%22%20y1%3D%22150%22%20x2%3D%22120%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%2280%22%20y1%3D%22150%22%20x2%3D%22140%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22100%22%20y1%3D%22150%22%20x2%3D%22160%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22120%22%20y1%3D%22150%22%20x2%3D%22180%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22140%22%20y1%3D%22150%22%20x2%3D%22200%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22160%22%20y1%3D%22150%22%20x2%3D%22220%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22180%22%20y1%3D%22150%22%20x2%3D%22240%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22200%22%20y1%3D%22150%22%20x2%3D%22260%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22220%22%20y1%3D%22150%22%20x2%3D%22280%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22240%22%20y1%3D%22150%22%20x2%3D%22300%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22260%22%20y1%3D%22150%22%20x2%3D%22320%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22280%22%20y1%3D%22150%22%20x2%3D%22340%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22300%22%20y1%3D%22150%22%20x2%3D%22360%22%20y2%3D%2250%22%20%2F%3E%3C%2Fg%3E%3C!--%20-45%C2%B0%20windings%20--%3E%3Cg%20stroke%3D%22%23555%22%20stroke-width%3D%221%22%3E%3Cline%20x1%3D%2220%22%20y1%3D%2250%22%20x2%3D%2280%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%2240%22%20y1%3D%2250%22%20x2%3D%22100%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%2260%22%20y1%3D%2250%22%20x2%3D%22120%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%2280%22%20y1%3D%2250%22%20x2%3D%22140%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22100%22%20y1%3D%2250%22%20x2%3D%22160%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22120%22%20y1%3D%2250%22%20x2%3D%22180%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22140%22%20y1%3D%2250%22%20x2%3D%22200%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22160%22%20y1%3D%2250%22%20x2%3D%22220%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22180%22%20y1%3D%2250%22%20x2%3D%22240%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22200%22%20y1%3D%2250%22%20x2%3D%22260%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22220%22%20y1%3D%2250%22%20x2%3D%22280%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22240%22%20y1%3D%2250%22%20x2%3D%22300%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22260%22%20y1%3D%2250%22%20x2%3D%22320%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22280%22%20y1%3D%2250%22%20x2%3D%22340%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22300%22%20y1%3D%2250%22%20x2%3D%22360%22%20y2%3D%22150%22%20%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E',
}, {
    spec: 'rollwrappedpipe',
    title: "Roll Wrapped Carbon Fibre Tube",
    description: "",
    svg: 'data:image/svg+xml,%3Csvg%20width%3D%22200%22%20height%3D%22100%22%20viewBox%3D%220%200%20400%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3C!--%20Tube%20background%20--%3E%3Crect%20x%3D%2220%22%20y%3D%2250%22%20width%3D%22360%22%20height%3D%22100%22%20fill%3D%22%23f8f9fa%22%20stroke%3D%22%23aaa%22%20stroke-width%3D%222%22%20rx%3D%2210%22%2F%3E%3C!--%20%2B45%C2%B0%20windings%20--%3E%3Cg%20stroke%3D%22%23000%22%20stroke-width%3D%221%22%3E%3Cline%20x1%3D%2220%22%20y1%3D%22150%22%20x2%3D%2280%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%2240%22%20y1%3D%22150%22%20x2%3D%22100%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%2260%22%20y1%3D%22150%22%20x2%3D%22120%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%2280%22%20y1%3D%22150%22%20x2%3D%22140%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22100%22%20y1%3D%22150%22%20x2%3D%22160%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22120%22%20y1%3D%22150%22%20x2%3D%22180%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22140%22%20y1%3D%22150%22%20x2%3D%22200%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22160%22%20y1%3D%22150%22%20x2%3D%22220%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22180%22%20y1%3D%22150%22%20x2%3D%22240%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22200%22%20y1%3D%22150%22%20x2%3D%22260%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22220%22%20y1%3D%22150%22%20x2%3D%22280%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22240%22%20y1%3D%22150%22%20x2%3D%22300%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22260%22%20y1%3D%22150%22%20x2%3D%22320%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22280%22%20y1%3D%22150%22%20x2%3D%22340%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22300%22%20y1%3D%22150%22%20x2%3D%22360%22%20y2%3D%2250%22%20%2F%3E%3C%2Fg%3E%3C!--%20-45%C2%B0%20windings%20--%3E%3Cg%20stroke%3D%22%23555%22%20stroke-width%3D%221%22%3E%3Cline%20x1%3D%2220%22%20y1%3D%2250%22%20x2%3D%2280%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%2240%22%20y1%3D%2250%22%20x2%3D%22100%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%2260%22%20y1%3D%2250%22%20x2%3D%22120%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%2280%22%20y1%3D%2250%22%20x2%3D%22140%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22100%22%20y1%3D%2250%22%20x2%3D%22160%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22120%22%20y1%3D%2250%22%20x2%3D%22180%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22140%22%20y1%3D%2250%22%20x2%3D%22200%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22160%22%20y1%3D%2250%22%20x2%3D%22220%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22180%22%20y1%3D%2250%22%20x2%3D%22240%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22200%22%20y1%3D%2250%22%20x2%3D%22260%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22220%22%20y1%3D%2250%22%20x2%3D%22280%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22240%22%20y1%3D%2250%22%20x2%3D%22300%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22260%22%20y1%3D%2250%22%20x2%3D%22320%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22280%22%20y1%3D%2250%22%20x2%3D%22340%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22300%22%20y1%3D%2250%22%20x2%3D%22360%22%20y2%3D%22150%22%20%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E',
}, {
    spec: 'pultruded',
    title: "Pultruded Carbon Fibre Tube",
    description: "",
    svg: 'data:image/svg+xml,%3Csvg%20width%3D%22200%22%20height%3D%22100%22%20viewBox%3D%220%200%20400%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3C!--%20Tube%20background%20--%3E%3Crect%20x%3D%2220%22%20y%3D%2250%22%20width%3D%22360%22%20height%3D%22100%22%20fill%3D%22%23f8f9fa%22%20stroke%3D%22%23aaa%22%20stroke-width%3D%222%22%20rx%3D%2210%22%2F%3E%3C!--%20%2B45%C2%B0%20windings%20--%3E%3Cg%20stroke%3D%22%23000%22%20stroke-width%3D%221%22%3E%3Cline%20x1%3D%2220%22%20y1%3D%22150%22%20x2%3D%2280%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%2240%22%20y1%3D%22150%22%20x2%3D%22100%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%2260%22%20y1%3D%22150%22%20x2%3D%22120%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%2280%22%20y1%3D%22150%22%20x2%3D%22140%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22100%22%20y1%3D%22150%22%20x2%3D%22160%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22120%22%20y1%3D%22150%22%20x2%3D%22180%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22140%22%20y1%3D%22150%22%20x2%3D%22200%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22160%22%20y1%3D%22150%22%20x2%3D%22220%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22180%22%20y1%3D%22150%22%20x2%3D%22240%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22200%22%20y1%3D%22150%22%20x2%3D%22260%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22220%22%20y1%3D%22150%22%20x2%3D%22280%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22240%22%20y1%3D%22150%22%20x2%3D%22300%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22260%22%20y1%3D%22150%22%20x2%3D%22320%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22280%22%20y1%3D%22150%22%20x2%3D%22340%22%20y2%3D%2250%22%20%2F%3E%3Cline%20x1%3D%22300%22%20y1%3D%22150%22%20x2%3D%22360%22%20y2%3D%2250%22%20%2F%3E%3C%2Fg%3E%3C!--%20-45%C2%B0%20windings%20--%3E%3Cg%20stroke%3D%22%23555%22%20stroke-width%3D%221%22%3E%3Cline%20x1%3D%2220%22%20y1%3D%2250%22%20x2%3D%2280%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%2240%22%20y1%3D%2250%22%20x2%3D%22100%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%2260%22%20y1%3D%2250%22%20x2%3D%22120%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%2280%22%20y1%3D%2250%22%20x2%3D%22140%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22100%22%20y1%3D%2250%22%20x2%3D%22160%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22120%22%20y1%3D%2250%22%20x2%3D%22180%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22140%22%20y1%3D%2250%22%20x2%3D%22200%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22160%22%20y1%3D%2250%22%20x2%3D%22220%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22180%22%20y1%3D%2250%22%20x2%3D%22240%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22200%22%20y1%3D%2250%22%20x2%3D%22260%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22220%22%20y1%3D%2250%22%20x2%3D%22280%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22240%22%20y1%3D%2250%22%20x2%3D%22300%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22260%22%20y1%3D%2250%22%20x2%3D%22320%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22280%22%20y1%3D%2250%22%20x2%3D%22340%22%20y2%3D%22150%22%20%2F%3E%3Cline%20x1%3D%22300%22%20y1%3D%2250%22%20x2%3D%22360%22%20y2%3D%22150%22%20%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E',
}, {
    spec: 'rubber_injection_mold',
    title: "Injection Rubber Molding",
    description: "",
    svg: 'data:image/svg+xml,%3Csvg%20width%3D%22200%22%20height%3D%22100%22%20viewBox%3D%220%200%20200%20100%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3C!--%20Mold%20base%20--%3E%3Crect%20x%3D%2250%22%20y%3D%2230%22%20width%3D%22100%22%20height%3D%2240%22%20fill%3D%22none%22%20stroke%3D%22black%22%20stroke-width%3D%222%22%2F%3E%3C!--%20Mold%20cavity%20--%3E%3Crect%20x%3D%2280%22%20y%3D%2240%22%20width%3D%2240%22%20height%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22black%22%20stroke-width%3D%222%22%2F%3E%3C!--%20Injection%20nozzle%20--%3E%3Cline%20x1%3D%2230%22%20y1%3D%2250%22%20x2%3D%2250%22%20y2%3D%2250%22%20stroke%3D%22black%22%20stroke-width%3D%222%22%2F%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2250%22%20r%3D%223%22%20fill%3D%22black%22%2F%3E%3C!--%20Rubber%20flow%20arrows%20--%3E%3Cline%20x1%3D%2240%22%20y1%3D%2245%22%20x2%3D%2280%22%20y2%3D%2250%22%20stroke%3D%22black%22%20stroke-width%3D%221%22%20marker-end%3D%22url(%23arrow)%22%2F%3E%3Cline%20x1%3D%2240%22%20y1%3D%2255%22%20x2%3D%2280%22%20y2%3D%2250%22%20stroke%3D%22black%22%20stroke-width%3D%221%22%20marker-end%3D%22url(%23arrow)%22%2F%3E%3C!--%20Arrow%20marker%20definition%20--%3E%3Cdefs%3E%3Cmarker%20id%3D%22arrow%22%20markerWidth%3D%226%22%20markerHeight%3D%226%22%20refX%3D%225%22%20refY%3D%223%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M0%2C0%20L6%2C3%20L0%2C6%20L1%2C3%20Z%22%20fill%3D%22black%22%2F%3E%3C%2Fmarker%3E%3C%2Fdefs%3E%3C%2Fsvg%3E',
}, {
    spec: 'rubber_compression_mold',
    title: "Compression Rubber Molding",
    description: "",
    svg: 'data:image/svg+xml,%3Csvg%20width%3D%22200%22%20height%3D%22100%22%20viewBox%3D%220%200%20200%20100%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3C!--%20Bottom%20mold%20--%3E%3Crect%20x%3D%2250%22%20y%3D%2250%22%20width%3D%22100%22%20height%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22black%22%20stroke-width%3D%222%22%2F%3E%3C!--%20Rubber%20preform%20--%3E%3Cellipse%20cx%3D%22100%22%20cy%3D%2245%22%20rx%3D%2220%22%20ry%3D%2210%22%20fill%3D%22none%22%20stroke%3D%22black%22%20stroke-width%3D%222%22%2F%3E%3C!--%20Top%20mold%20--%3E%3Crect%20x%3D%2250%22%20y%3D%2220%22%20width%3D%22100%22%20height%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22black%22%20stroke-width%3D%222%22%2F%3E%3C!--%20Pressing%20arrows%20--%3E%3Cline%20x1%3D%22100%22%20y1%3D%2220%22%20x2%3D%22100%22%20y2%3D%2250%22%20stroke%3D%22black%22%20stroke-width%3D%222%22%20marker-end%3D%22url(%23arrow)%22%2F%3E%3Cline%20x1%3D%2290%22%20y1%3D%2220%22%20x2%3D%2290%22%20y2%3D%2250%22%20stroke%3D%22black%22%20stroke-width%3D%221%22%20marker-end%3D%22url(%23arrow)%22%2F%3E%3Cline%20x1%3D%22110%22%20y1%3D%2220%22%20x2%3D%22110%22%20y2%3D%2250%22%20stroke%3D%22black%22%20stroke-width%3D%221%22%20marker-end%3D%22url(%23arrow)%22%2F%3E%3C!--%20Arrow%20marker%20definition%20--%3E%3Cdefs%3E%3Cmarker%20id%3D%22arrow%22%20markerWidth%3D%226%22%20markerHeight%3D%226%22%20refX%3D%225%22%20refY%3D%223%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M0%2C0%20L6%2C3%20L0%2C6%20L1%2C3%20Z%22%20fill%3D%22black%22%2F%3E%3C%2Fmarker%3E%3C%2Fdefs%3E%3C%2Fsvg%3E'
}, {
    spec: 'rubber_overmold',
    title: "Rubber Overmolding",
    description: "",
    svg: 'data:image/svg+xml,%3Csvg%20width%3D%22200%22%20height%3D%22100%22%20viewBox%3D%220%200%20200%20100%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3C!--%20Base%20part%20--%3E%3Crect%20x%3D%2270%22%20y%3D%2240%22%20width%3D%2260%22%20height%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22black%22%20stroke-width%3D%222%22%2F%3E%3C!--%20Mold%20cavity%20--%3E%3Crect%20x%3D%2260%22%20y%3D%2230%22%20width%3D%2280%22%20height%3D%2240%22%20fill%3D%22none%22%20stroke%3D%22black%22%20stroke-width%3D%222%22%2F%3E%3C!--%20Injection%20nozzle%20--%3E%3Cline%20x1%3D%2230%22%20y1%3D%2250%22%20x2%3D%2260%22%20y2%3D%2250%22%20stroke%3D%22black%22%20stroke-width%3D%222%22%2F%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2250%22%20r%3D%223%22%20fill%3D%22black%22%2F%3E%3C!--%20Rubber%20flow%20arrows%20--%3E%3Cline%20x1%3D%2245%22%20y1%3D%2245%22%20x2%3D%2260%22%20y2%3D%2250%22%20stroke%3D%22black%22%20stroke-width%3D%221%22%20marker-end%3D%22url(%23arrow)%22%2F%3E%3Cline%20x1%3D%2245%22%20y1%3D%2255%22%20x2%3D%2260%22%20y2%3D%2250%22%20stroke%3D%22black%22%20stroke-width%3D%221%22%20marker-end%3D%22url(%23arrow)%22%2F%3E%3C!--%20Arrow%20marker%20definition%20--%3E%3Cdefs%3E%3Cmarker%20id%3D%22arrow%22%20markerWidth%3D%226%22%20markerHeight%3D%226%22%20refX%3D%225%22%20refY%3D%223%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M0%2C0%20L6%2C3%20L0%2C6%20L1%2C3%20Z%22%20fill%3D%22black%22%2F%3E%3C%2Fmarker%3E%3C%2Fdefs%3E%3C%2Fsvg%3E'
}, {
    spec: 'rubber_transfer_mold',
    title: "Rubber Transfer Molding",
    description: "",
    svg: 'data:image/svg+xml,%3Csvg%20width%3D%22200%22%20height%3D%22100%22%20viewBox%3D%220%200%20200%20100%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3C!--%20Mold%20cavity%20--%3E%3Crect%20x%3D%22100%22%20y%3D%2240%22%20width%3D%2270%22%20height%3D%2230%22%20fill%3D%22none%22%20stroke%3D%22black%22%20stroke-width%3D%222%22%2F%3E%3C!--%20Transfer%20pot%20--%3E%3Crect%20x%3D%2230%22%20y%3D%2235%22%20width%3D%2240%22%20height%3D%2230%22%20fill%3D%22none%22%20stroke%3D%22black%22%20stroke-width%3D%222%22%2F%3E%3Cellipse%20cx%3D%2250%22%20cy%3D%2250%22%20rx%3D%2215%22%20ry%3D%2210%22%20fill%3D%22none%22%20stroke%3D%22black%22%20stroke-width%3D%222%22%2F%3E%3C!--%20Transfer%20channel%20--%3E%3Cline%20x1%3D%2270%22%20y1%3D%2250%22%20x2%3D%22100%22%20y2%3D%2255%22%20stroke%3D%22black%22%20stroke-width%3D%222%22%20marker-end%3D%22url(%23arrow)%22%2F%3E%3C!--%20Pressing%20arrows%20inside%20mold%20--%3E%3Cline%20x1%3D%22120%22%20y1%3D%2240%22%20x2%3D%22120%22%20y2%3D%2270%22%20stroke%3D%22black%22%20stroke-width%3D%221%22%20marker-end%3D%22url(%23arrow)%22%2F%3E%3C!--%20Arrow%20marker%20definition%20--%3E%3Cdefs%3E%3Cmarker%20id%3D%22arrow%22%20markerWidth%3D%226%22%20markerHeight%3D%226%22%20refX%3D%225%22%20refY%3D%223%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M0%2C0%20L6%2C3%20L0%2C6%20L1%2C3%20Z%22%20fill%3D%22black%22%2F%3E%3C%2Fmarker%3E%3C%2Fdefs%3E%3C%2Fsvg%3E',
}, {
    spec: 'laminate_sheet',
    title: "CFRP Sheet",
    description: "",
    svg: `${import.meta.env.BASE_URL}assets/sheet.svg`,
}, {
    spec: '3dp',
    title: "3D Printing",
    description: "",
    svg: `${import.meta.env.BASE_URL}assets/3d.svg`,
},
];

interface SpecDropdownProps {
    selection: string;
    onChange?: (option: string) => void;
    specTypes: string[];
}

export function SpecDropdown({selection, onChange, specTypes}: SpecDropdownProps) {
    let options = specOptions;
    if (specTypes.length > 0) {
        options = options.filter((o) => specTypes.includes(o.spec));
    }

    const selectedOption = options.find((o) => o.spec === selection);
    const dropdownOptions = options.map((o, i) => {
        return <li className={styles.dropdownli} key={i}>
            <a className="dropdown-item" onClick={() => onChange && onChange(o.spec)}>
                <div className={styles.dropdownItemContent}>
                    <img
                        src={o.svg}
                        alt="Selected"
                        style={{height: '60px', minWidth: '150px'}}/>
                    <div className="dropdown-item-text">
                        <div className="fw-bold">{o.title}</div>
                        <small className="text-muted">{o.description}</small>
                    </div>
                </div>
            </a>
        </li>
    })

    return <div className={styles.productDropdown}>
        <button className="btn btn-outline-primary dropdown-toggle dropdown-toggle-large"
                type="button"
                data-bs-toggle="dropdown" aria-expanded="false">
            {selectedOption && <><img
                src={selectedOption.svg}
                style={{height: '80px'}}
                alt="Selected"/>
                <div className={styles.dropdownToggleText}>
                    <div className="title">{selectedOption.title}</div>
                    <small className="text-muted">{selectedOption.description}</small>
                </div>
            </>}
            {!selectedOption && "Add to Quote"}
        </button>
        <ul className="dropdown-menu dropdown-large dropdown-menu-end p-2">
            {dropdownOptions}
        </ul>
    </div>
}
