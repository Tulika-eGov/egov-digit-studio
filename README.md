# egov-digit-studio — laptop-local DIGIT (Compose + Tilt)

Run a **DIGIT core** stack on your laptop with **Docker Compose** and optional **Tilt** (dashboard, grouped resources, nav buttons). This is the same operational model as `digit-2.9lts-core-storm`, but oriented toward **[DIGIT-DevOps](https://github.com/egovernments/DIGIT-DevOps)** (`unified-demo` branch) for Helm values and platform configuration — **not** a full copy of the cloud `unified-demo` footprint (that would require Kubernetes and shared RDS/Kafka/ES).

## What you get locally

- Postgres (seeded), Redis, Redpanda (Kafka-compatible), MinIO, Elasticsearch 7.x (for inbox)  
- Core services: MDMS v2, ENC, IDGEN, User, Workflow v2, Localization, Boundary v2, Access Control, Persister, Filestore, HRMS, URL shortening, boundary management (Node)  
- **Studio** (Helm-aligned envs): health-individual, health-service-request, public-service-init, public-service, egov-otp, user-otp, egov-notification-sms, pdf-service, studio-pdf, digit-studio, inbox — plus Kong routes under the same path prefixes. Service maps for inbox live in `configs/studio/inbox.env` (search URLs rewritten to `http://kong:8000/...` so you can add matching routes later).  
- Kong on **http://localhost:18000**, DIGIT UI on **http://localhost:18000/digit-ui/**

Override images via `.env` or the shell using variables listed in the header comment of `docker-compose.yml` (e.g. `IMAGE_DIGIT_STUDIO`, `IMAGE_PUBLIC_SERVICE`, …).

PGR / complaint APIs are **not** included in this compose file (add a service + Kong routes if you need them).

## Prerequisites

1. Docker with Compose v2  
2. [Tilt](https://tilt.dev/) (optional but recommended)  
3. **Patched Tilt** (same as `digit-2.9lts-core-storm`) if you want correct wait semantics for Compose health checks — see [Installing Patched Tilt](#installing-patched-tilt) below.

## Quick start

```bash
cd egov-digit-studio

# Optional: clone DIGIT-DevOps next to this repo for reference (Helm env: unified-demo)
# git clone -b unified-demo https://github.com/egovernments/DIGIT-DevOps.git ../DIGIT-DevOps

tilt up
# or: docker compose up -d
```

- Tilt UI: http://localhost:10350/  
- App via Kong: http://localhost:18000/digit-ui/

### Verify

```bash
./scripts/health-check.sh
./scripts/smoke-tests.sh
```

Postman: `scripts/run-postman.sh core` runs `digit-core-validation` against direct service ports. The `complaints` collection expects PGR on Kong and will not pass unless you add `pgr-services` back.

## DIGIT-DevOps (`unified-demo`)

- **Helm / env files**: `deploy-as-code/helm/environments/unified-demo.yaml` (and related) describe how DIGIT is wired in Kubernetes (image overrides, configmaps, ingress).  
- **This repo** runs a **curated subset** with **localhost** URLs and container names; image tags in `docker-compose.yml` are pinned for a stable laptop experience. When you change versions in DevOps, update the corresponding `image:` lines here (or add a small script later to sync tags from chart defaults).

Set `DIGIT_DEVOPS_PATH` if your clone is not at `../DIGIT-DevOps` — Tilt prints a hint when the directory exists.

## API examples (via Kong)

```bash
curl -X POST "http://localhost:18000/mdms-v2/v1/_search" \
  -H "Content-Type: application/json" \
  -d '{"MdmsCriteria":{"tenantId":"pg","moduleDetails":[{"moduleName":"tenant","masterDetails":[{"name":"tenants"}]}]},"RequestInfo":{"apiId":"Rainmaker"}}'
```

## Database

```bash
docker exec -it docker-postgres psql -U egov -d egov
```

## Tilt-only notes

- Nav buttons: Health Check, Smoke Tests, Nuke DB, Kong test, Re-seed MDMS, etc.  
- `tilt down` / `docker compose down` to stop.  
- `docker compose down -v` resets volumes.

## Installing patched Tilt

Same rationale as `digit-2.9lts-core-storm`: stock Tilt can treat Compose containers as “ready” before health checks pass. Use the health-check–aware build from the README of that project, or unpack the binary into `./bin/tilt` and run `./bin/tilt up`.

## Alternative: Compose only

```bash
docker compose up -d
docker compose logs -f
docker compose down
```

## Project layout

```
egov-digit-studio/
├── docker-compose.yml   # Service definitions
├── Tiltfile              # Tilt wiring (Compose only, no app hot-reload)
├── kong/kong.yml
├── nginx/               # digit-ui proxy + globalConfigs.js
├── db/                  # init SQL (e.g. full-dump.sql)
├── configs/persister/
└── scripts/             # health-check.sh, smoke-tests.sh, …
```

## Resource usage

Roughly **~4 GB RAM** for Docker (similar to the reference core stack). Adjust `deploy.resources` in `docker-compose.yml` if your machine is constrained.
