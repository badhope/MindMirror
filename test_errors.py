from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    console_errors = []
    page.on("console", lambda msg: console_errors.append(f"[{msg.type}] {msg.text}") if msg.type == "error" else None)

    page.on("pageerror", lambda err: console_errors.append(f"[PAGE ERROR] {err}"))

    try:
        page.goto('http://localhost:5173/', timeout=10000)
        page.wait_for_load_state('networkidle', timeout=15000)
        page.wait_for_timeout(2000)
    except Exception as e:
        print(f"Navigation error: {e}")

    print("=== Console Errors ===")
    for err in console_errors:
        print(err)

    if not console_errors:
        print("No console errors found")

    try:
        content = page.content()
        if "react" in content.lower():
            print("\n✓ React app loaded successfully")
        else:
            print("\n✗ React may not have loaded")
    except Exception as e:
        print(f"\nContent check error: {e}")

    browser.close()
