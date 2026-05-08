from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 800})

    console_errors = []
    page.on("console", lambda msg: console_errors.append(f"[{msg.type}] {msg.text}") if msg.type == "error" else None)

    page.on("pageerror", lambda err: console_errors.append(f"[PAGE ERROR] {err}"))

    page.goto('http://localhost:5173/', timeout=10000)
    page.wait_for_load_state('networkidle', timeout=15000)
    page.wait_for_timeout(3000)

    print("=== Console Errors ===")
    for err in console_errors:
        print(err)

    if not console_errors:
        print("No console errors")

    page.screenshot(path='/tmp/app_screenshot.png', full_page=False)
    print("\n✓ Screenshot saved to /tmp/app_screenshot.png")

    page_content = page.content()
    print(f"\nPage content length: {len(page_content)} chars")

    if "error" in page_content.lower():
        print("⚠ Found 'error' in page content")
    else:
        print("✓ No error text found in page")

    browser.close()
