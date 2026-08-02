# Career Bridge Technical Architecture & System Blueprint

```
                     ┌────────────────────────────────┐
                     │     Next.js Web / React Native │
                     └───────────────┬────────────────┘
                                     │
                        HTTP / REST  │  WebSockets
                                     ▼
                     ┌────────────────────────────────┐
                     │   Career Bridge Gateway (Node) │
                     └───────────────┬────────────────┘
                                     │
                     ┌───────────────┴────────────────┐
                     ▼                                ▼
        ┌─────────────────────────┐      ┌─────────────────────────┐
        │ Python Intelligence API │      │ Shared Packages Engine  │
        └─────────────────────────┘      └─────────────────────────┘
```
