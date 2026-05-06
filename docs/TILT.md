# Tilt — install, PATH, and optional `./bin/tilt`

Everything about **installing the Tilt CLI** and fixing **`tilt: command not found`** for **egov-digit-studio** lives in this file. Day-to-day commands (`tilt up`, URLs) are in **[QUICK-SETUP.md](../QUICK-SETUP.md)**.

This repo uses Tilt with **Docker Compose only**. You do **not** need a local Kubernetes cluster for this project (ignore Kubernetes-focused notes on the upstream Tilt install page unless you use Tilt elsewhere).

**Official reference (all platforms and package managers):** [https://docs.tilt.dev/install.html](https://docs.tilt.dev/install.html)

---

## Install

### Linux

Official install script (often uses Homebrew or another package manager when available; otherwise it downloads the binary and places it in **a directory that is already on your `PATH`**—commonly **`~/.local/bin`**, **`/usr/local/bin`**, or **`~/bin`**, depending on your OS and what exists—not always `/usr/local/bin`):

```bash
curl -fsSL https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.sh | bash
command -v tilt    # see where it landed
tilt version
```

Or with [Homebrew](https://brew.sh/) on Linux:

```bash
brew install tilt
tilt version
```

### macOS

Same script as Linux (often picks up Homebrew automatically):

```bash
curl -fsSL https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.sh | bash
tilt version
```

Or Homebrew only:

```bash
brew install tilt
tilt version
```

### Windows

In **PowerShell**:

```powershell
iex ((new-object net.webclient).DownloadString('https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.ps1'))
```

Open a new terminal, then:

```powershell
tilt version
```

[Scoop](https://scoop.sh/) and other options: [install page](https://docs.tilt.dev/install.html).

---

## Verify

```bash
command -v tilt
tilt version
```

---

## `./bin/` in this repository

- The Tilt installer **does not** create **`./bin/tilt`** here. **`./bin/`** is optional and usually **absent** until you add something.
- **Normal setup:** `tilt` on your system **`PATH`** (e.g. `/usr/local/bin/tilt` or `~/.local/bin/tilt`).
- **Name collision:** a Ruby gem also named **`tilt`** installs a **`tilt`** executable that is **not** [tilt.dev](https://tilt.dev). If `./bin/tilt` or `tilt up` prints errors like **`template type not given`** or **`template engine not found`**, you have the wrong program. Remove it and use the real CLI (install section above), or copy only the **ELF/static binary** from the **same path** the real CLI uses (never hardcode `/usr/local/bin`—your install may be under **`~/.local/bin`** or elsewhere):

  ```bash
  rm -f ./bin/tilt
  mkdir -p bin
  TILT_BIN="$(command -v tilt)"        # must be the tilt.dev CLI (check: tilt version works before this)
  cp "$TILT_BIN" ./bin/tilt
  file ./bin/tilt                      # should say "executable" / "ELF", not "Ruby script"
  ./bin/tilt version                   # should print e.g. "v0.37.x, built ..."
  ./bin/tilt up
  ```

  If **`command -v tilt`** still resolves to the wrong program, call **`cp`** with the full path to the binary you intend (e.g. the path printed by the install script, or **`/usr/local/bin/tilt`** on your machine only after you have confirmed **`file`** shows the real CLI).

Some Tilt releases may mark Compose resources as “ready” before every container health check has passed. If the UI is misleading, try another version from the [official install page](https://docs.tilt.dev/install.html) or keep a known-good **tilt.dev** binary at **`./bin/tilt`** and run **`./bin/tilt up`**.

---

## `tilt: command not found`

1. **Search common locations:**

   ```bash
   ls -la ~/.local/bin/tilt /usr/local/bin/tilt /usr/bin/tilt 2>/dev/null
   command -v tilt
   ```

2. **`~/.local/bin/tilt` exists but `command -v` is empty** — add `~/.local/bin` to `PATH`, then open a **new** terminal:

   ```bash
   echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
   source ~/.bashrc
   ```

   Use **`~/.zshrc`** instead of **`~/.bashrc`** if you use Zsh.

3. **Re-run the installer** and read the path it prints:

   ```bash
   curl -fsSL https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.sh | bash
   tilt version
   ```

4. **IDE integrated terminals** sometimes get a shorter `PATH` than a login shell. Compare `echo $PATH` where `tilt` fails vs an external terminal, or log out and back in.

---

## More than one `tilt` binary (`/usr/bin` vs `/usr/local/bin`)

`command -v tilt` runs whichever **`tilt` appears first in your `PATH`**. It is common to have:

- **`/usr/local/bin/tilt`** — from the official install script or a manual install (often newer), and  
- **`/usr/bin/tilt`** — from a distribution package (sometimes older).

Compare versions explicitly:

```bash
/usr/local/bin/tilt version
/usr/bin/tilt version
```

If you want the **`/usr/local/bin`** build to win, ensure **`/usr/local/bin` appears before `/usr/bin`** in `PATH`, or remove the distro package that provides `/usr/bin/tilt` if you no longer need it.

---

## Port 10350 already in use

Tilt’s UI listens on **10350** by default. This error means **another Tilt (or process) is already bound** there—often an older `tilt up` you did not stop.

1. **Prefer a clean stop** from the directory where that session was started (or any terminal):

   ```bash
   tilt down
   # or: ./bin/tilt down
   ```

2. **If you cannot find that terminal**, see what owns the port and stop it:

   ```bash
   ss -tlnp | grep 10350
   # or: lsof -i :10350
   ```

   End the **`tilt`** process shown (from another shell: `kill <pid>`, or close the IDE task that is still running Tilt).

3. **Run a second Tilt on another port** (only if you really need two sessions):

   ```bash
   TILT_PORT=10351 ./bin/tilt up
   ```

   Then open **`http://localhost:10351/`** instead of 10350.

---

## Related

- **[QUICK-SETUP.md](../QUICK-SETUP.md)** — `tilt up`, access URLs, `tilt down`, Compose-only appendix  
- **[README.md](../README.md)** — project overview  
- **`Tiltfile`** — resource groups, links, nav buttons
