from playwright.sync_api import sync_playwright
import time

def take_screenshots():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        
        print("正在访问网站...")
        page.goto('http://localhost:5173/', timeout=30000)
        page.wait_for_load_state('networkidle', timeout=30000)
        page.wait_for_timeout(3000)
        
        print("正在截图...")
        page.screenshot(path='/tmp/mindmirror_home.png', full_page=True)
        
        content = page.content()
        print(f"页面标题: {page.title()}")
        print(f"页面长度: {len(content)} 字符")
        
        print("\n正在尝试滚动...")
        page.evaluate("window.scrollBy(0, 500)")
        page.wait_for_timeout(1000)
        page.screenshot(path='/tmp/mindmirror_scrolled.png', full_page=True)
        
        print("\n检查是否有导航菜单...")
        try:
            nav_elements = page.locator('nav, header, [class*="nav"], [class*="menu"]').all()
            print(f"找到 {len(nav_elements)} 个导航元素")
        except Exception as e:
            print(f"检查导航时出错: {e}")
        
        print("\n检查主要按钮...")
        try:
            buttons = page.locator('button').all()
            print(f"找到 {len(buttons)} 个按钮")
            for i, btn in enumerate(buttons[:5]):
                try:
                    text = btn.inner_text()
                    print(f"  按钮 {i+1}: {text[:50] if text else '无文本'}")
                except:
                    pass
        except Exception as e:
            print(f"检查按钮时出错: {e}")
        
        print("\n检查主要链接...")
        try:
            links = page.locator('a[href]').all()
            print(f"找到 {len(links)} 个链接")
            for i, link in enumerate(links[:10]):
                try:
                    href = link.get_attribute('href')
                    text = link.inner_text()
                    print(f"  链接 {i+1}: {text[:30] if text else '无文本'} -> {href}")
                except:
                    pass
        except Exception as e:
            print(f"检查链接时出错: {e}")
        
        browser.close()
        print("\n截图已保存到 /tmp/mindmirror_home.png 和 /tmp/mindmirror_scrolled.png")

if __name__ == "__main__":
    take_screenshots()
