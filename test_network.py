from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 800})

    all_logs = []
    page.on("console", lambda msg: all_logs.append(f"[{msg.type}] {msg.text}"))

    page.on("pageerror", lambda err: all_logs.append(f"[PAGE ERROR] {err}"))

    page.on("requestfailed", lambda req: all_logs.append(f"[REQUEST FAILED] {req.url} - {req.failure}"))

    network_errors = []
    page.on("response", lambda res: network_errors.append(f"[{res.status}] {res.url}") if res.status >= 400 else None)

    page.goto('http://localhost:5173/', timeout=15000)
    page.wait_for_load_state('networkidle', timeout=20000)
    page.wait_for_timeout(3000)

    print("=== All Console Logs ===")
    for log in all_logs:
        print(log)

    print("\n=== Network Errors (4xx/5xx) ===")
    for err in network_errors:
        print(err)

    if not network_errors:
        print("No network errors")

    visible_text = page.locator('body').inner_text()
    lines = visible_text.split('\n')[:50]
    print("\n=== Visible Text (first 50 lines) ===")
    for line in lines:
        if line.strip():
            print(line.strip())

    browser.close()
