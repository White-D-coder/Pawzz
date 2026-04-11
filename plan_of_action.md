# 🚀 PAWZZ — HYPER-DETAILED END-TO-END DEVELOPER BLUEPRINT

## 0. NON-NEGOTIABLE EXECUTION RULES
Before writing any code, understand the entire product flow end to end. The final system must not feel like isolated pages stitched together. It should feel like one coherent product with consistent design language, strict access control, predictable state transitions, and clear separation of responsibilities between frontend, backend, database, and background workers.

* Generate code that is directly usable.
* Keep all features aligned with the stated requirements.
* Use the specified stack only unless a supporting utility is necessary.
* Do not invent product features outside the brief.
* Do not remove or weaken any listed functionality.
* Prefer maintainable patterns over clever shortcuts.
* Make sure the system is secure by default.
* Ensure that data flow is explicit and traceable.
* Ensure that user experience remains simple even if the backend logic is complex.
* Structure the code so each feature can be tested independently.
* Add comments where architectural decisions need explanation.
* Separate concerns cleanly across app routes, reusable components, services, middleware, utilities, and models.
* Every async flow must have loading, success, and error states.
* Every sensitive action must have authorization checks.
* Every critical database write must be atomic or safely handled with conflict logic.
* Every user-facing form must validate input before submission and again on the server.

## 10. PROJECT STRUCTURE AND CODE ORGANIZATION
The codebase must be organized to make navigation obvious.

**Frontend**
* /app
* /components
* /components/ui
* /components/layout
* /components/forms
* /components/modals
* /context
* /hooks
* /lib
* /services
* /styles
* /types

**Backend**
* /controllers
* /routes
* /models
* /middlewares
* /workers
* /utils
* /config
* /services
* /validators

## 13. REQUIRED OUTPUT FORMAT
When generating the project, output in this order:
1. Brief architecture overview.
2. Complete directory structure.
3. Tailwind configuration.
4. Shared types and utilities.
5. Frontend pages and components.
6. Backend routes, controllers, middleware, models, and services.
7. Worker thread implementation.
8. Environment variables example.
9. Deployment notes.
10. Any critical assumptions or limitations.

## 14. FINAL SYSTEM OBJECTIVE
The final system should feel like a real veterinary service platform that can be launched, tested, and extended. It should allow users to discover providers, book slots, submit volunteer applications, and let admins moderate content securely. Every feature must feel internally consistent. Every state transition must be deliberate. Every sensitive action must be guarded. Every database write must be defensible. Every public-facing page must be understandable without login, while protected details remain locked until authorization is granted.
