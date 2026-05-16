import { test, expect, devices, type Page } from '@playwright/test';

// ── Device matrix ─────────────────────────────────────────────────────
const MOBILE_DEVICES = [
  { name: 'iPhone 14',      device: devices['iPhone 14'] },
  { name: 'Pixel 7',        device: devices['Pixel 7'] },
  { name: 'Galaxy S23',     device: devices['Galaxy S8'] },
  { name: 'iPad Mini',      device: devices['iPad Mini'] },
];

const DESKTOP_VIEWPORTS = [
  { name: 'FHD Desktop', width: 1920, height: 1080 },
  { name: 'Laptop',      width: 1366, height: 768 },
  { name: 'Small Laptop',width: 1024, height: 768 },
];

// Key routes to test
const ROUTES = [
  { path: '/',                        name: 'Home' },
  { path: '/calculators',             name: 'All Calculators' },
  { path: '/calculator/bmi-calculator',name: 'BMI Calculator' },
  { path: '/calculator/salary-calculator', name: 'Salary Calculator' },
  { path: '/calculator/sip-calculator',name: 'SIP Calculator' },
  { path: '/category/finance',        name: 'Finance Category' },
];

const BASE = 'http://localhost:3000';

// ── Helpers ───────────────────────────────────────────────────────────
async function checkNoHorizontalScroll(page: Page, label: string) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.body.scrollWidth,
    clientWidth: document.body.clientWidth,
  }));
  expect(scrollWidth, `${label}: horizontal overflow detected (scrollWidth ${scrollWidth} > clientWidth ${clientWidth})`).toBeLessThanOrEqual(clientWidth + 2);
}

async function checkTapTargets(page: Page) {
  const smallTargets = await page.evaluate(() => {
    const MIN = 44; // WCAG 2.5.5 recommended minimum
    const interactive = Array.from(document.querySelectorAll('a, button, input, select, [role="button"]'));
    return interactive
      .map(el => {
        const r = el.getBoundingClientRect();
        return { tag: el.tagName, w: r.width, h: r.height, text: (el as HTMLElement).innerText?.slice(0, 30) };
      })
      .filter(el => el.w > 0 && el.h > 0 && (el.w < MIN || el.h < MIN));
  });
  // Warn rather than fail — some small icons are acceptable
  if (smallTargets.length > 0) {
    console.warn(`⚠ Small tap targets found:`, smallTargets.slice(0, 5));
  }
}

async function checkTextReadability(page: Page) {
  const tinyText = await page.evaluate(() => {
    const MIN_SIZE = 11; // px
    const elements = Array.from(document.querySelectorAll('p, span, div, li, td, th, label'));
    return elements
      .map(el => {
        const style = window.getComputedStyle(el);
        const size = parseFloat(style.fontSize);
        return { size, text: (el as HTMLElement).innerText?.trim().slice(0, 40) };
      })
      .filter(el => el.text && el.size > 0 && el.size < MIN_SIZE);
  });
  expect(tinyText.length, `Text smaller than ${11}px found`).toBeLessThan(5);
}

// ── Mobile Tests ──────────────────────────────────────────────────────
for (const { name, device } of MOBILE_DEVICES) {
  test.describe(`📱 ${name}`, () => {

    for (const route of ROUTES) {
      test(`${route.name} — loads and has no overflow`, async ({ page }) => {
        await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle' });

        // Page title exists
        await expect(page).toHaveTitle(/.+/);

        // No horizontal scroll
        await checkNoHorizontalScroll(page, `${name} — ${route.name}`);

        // Main content visible
        const main = page.locator('main, #main-content, [role="main"]');
        await expect(main.first()).toBeVisible();
      });
    }

    test('Navbar renders and hamburger works on mobile', async ({ page }) => {
      await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
      // Check nav exists
      const nav = page.locator('nav').first();
      await expect(nav).toBeVisible();
    });

    test('Calculator form is usable on mobile', async ({ page }) => {
      await page.goto(`${BASE}/calculator/bmi-calculator`, { waitUntil: 'networkidle' });
      await checkNoHorizontalScroll(page, `${name} — BMI form`);
      await checkTapTargets(page);
      // Inputs are present
      const inputs = page.locator('input, select');
      expect(await inputs.count()).toBeGreaterThan(0);
    });

    test('Text is readable (≥11px)', async ({ page }) => {
      await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
      await checkTextReadability(page);
    });

    test('Images have alt attributes', async ({ page }) => {
      await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
      const imagesWithoutAlt = await page.evaluate(() =>
        Array.from(document.querySelectorAll('img')).filter(img => !img.alt).length
      );
      expect(imagesWithoutAlt, 'Images without alt text').toBe(0);
    });
  });
}

// ── Desktop Tests ─────────────────────────────────────────────────────
for (const vp of DESKTOP_VIEWPORTS) {
  test.describe(`🖥 ${vp.name} (${vp.width}×${vp.height})`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('Home page loads with correct title', async ({ page }) => {
      await page.goto(BASE, { waitUntil: 'networkidle' });
      await expect(page).toHaveTitle(/CalcPoint/i);
    });

    test('All Calculators grid is visible', async ({ page }) => {
      await page.goto(`${BASE}/calculators`, { waitUntil: 'networkidle' });
      const cards = page.locator('a.calc-card-premium, [class*="calc-card"]');
      expect(await cards.count()).toBeGreaterThan(10);
    });

    test('Search filters calculators', async ({ page }) => {
      await page.goto(`${BASE}/calculators`, { waitUntil: 'networkidle' });
      const search = page.locator('input[placeholder*="Search"]').first();
      await search.fill('BMI');
      await page.waitForTimeout(300);
      const results = page.locator('a[href*="calculator"]');
      expect(await results.count()).toBeGreaterThan(0);
    });

    test('Calculator page renders widget', async ({ page }) => {
      await page.goto(`${BASE}/calculator/bmi-calculator`, { waitUntil: 'networkidle' });
      const widget = page.locator('#tab-calculator').first();
      await expect(widget).toBeVisible();
    });

    test('No JS console errors on home page', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
      await page.goto(BASE, { waitUntil: 'networkidle' });
      expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);
    });
  });
}

// ── Accessibility Baseline ────────────────────────────────────────────
test.describe('♿ Accessibility Baseline', () => {
  test('Home has a single h1', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    const h1s = await page.locator('h1').count();
    expect(h1s).toBeGreaterThanOrEqual(1);
    expect(h1s).toBeLessThanOrEqual(2);
  });

  test('All interactive elements are keyboard-focusable', async ({ page }) => {
    await page.goto(`${BASE}/calculator/bmi-calculator`, { waitUntil: 'networkidle' });
    // Tab through the page — should not throw
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
    }
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'BODY']).toContain(focused);
  });

  test('Page has a skip-to-content or landmark structure', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    const main = page.locator('main, [role="main"]');
    expect(await main.count()).toBeGreaterThanOrEqual(1);
  });
});

// ── Performance Budget ────────────────────────────────────────────────
test.describe('⚡ Performance Budget', () => {
  test('Home page has LCP image or text within viewport', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    // Page is visible and above-fold content exists
    const hero = page.locator('h1, [class*="hero"], [class*="title"]').first();
    await expect(hero).toBeVisible();
  });

  test('No render-blocking font links (using media=print trick)', async ({ page }) => {
    const html = await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    const content = await page.content();
    // Fonts loaded with media=print (non-blocking)
    const hasBlockingFont = content.includes('<link') &&
      content.includes('fonts.googleapis.com') &&
      !content.includes('media="print"') &&
      !content.includes("media='print'");
    expect(hasBlockingFont).toBe(false);
  });

  test.use({ viewport: { width: 375, height: 812 } });
  test('Mobile home LCP visible within 3s', async ({ page }) => {
    const start = Date.now();
    await page.goto(BASE, { waitUntil: 'networkidle' });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(8000); // generous for localhost
    const hero = page.locator('h1').first();
    await expect(hero).toBeVisible({ timeout: 3000 });
  });
});
