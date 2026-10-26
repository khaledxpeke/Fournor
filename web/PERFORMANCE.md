# Performance

Lighthouse mobile, simulated slow 4G, scores the homepage at 2.7s LCP and 96 Performance. The same trace, before simulation, is about 668ms: 7ms to first byte, 12ms of load delay, 474ms to download the hero, and 175ms of render delay. 96 is enough to ship. Field data after launch decides whether more work is needed.

Two levers are left. Neither is implemented.

## Self-host the Google Fonts

The page still waits on `fonts.googleapis.com` and `fonts.gstatic.com` for Montserrat, Amiri, and IBM Plex Sans Arabic. Gotham Pro is already a local face. Hosting the three Google families from this site removes that connection and the stylesheet request from the critical path.

## Inline critical CSS

The layout stylesheet is render-blocking. Inlining the CSS needed for the first screen, and loading the rest after, shortens the render delay that sits after the hero bytes arrive.
