import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("resume content, safe terminal, history, autocomplete and clear", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "hi, my name is blimmy !!!" }),
  ).toBeVisible();
  const input = page.getByRole("textbox", { name: "Terminal command" });
  await input.fill("whoami");
  await input.press("Enter");
  await expect(page.getByRole("log")).toContainText("Siriphanaphorn Sirikun");
  await input.fill("ach");
  await input.press("Tab");
  await expect(input).toHaveValue("achievements");
  await input.press("Enter");
  await expect(page.getByRole("log")).toContainText("163 / 1,602");
  await input.press("ArrowUp");
  await expect(input).toHaveValue("achievements");
  await input.press("ArrowUp");
  await expect(input).toHaveValue("whoami");
  await input.press("ArrowDown");
  await expect(input).toHaveValue("achievements");
  await input.press("ArrowDown");
  await expect(input).toHaveValue("");
  await input.fill("<script>alert(1)</script>");
  await input.press("Enter");
  await expect(page.getByRole("log")).toContainText(
    "Command not found: <script>",
  );
  await input.fill("cat resume.txt");
  await input.press("Enter");
  await expect(page.getByRole("log")).toContainText("ACIS Professional Center");
  await expect(page.getByRole("log")).toContainText("blimmyw@gmail.com");
  await input.fill("clear");
  await input.press("Enter");
  await expect(page.getByRole("log")).toBeEmpty();
  expect(errors).toEqual([]);
});
test("credentials filtering, accessible modal and research filters", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const section = page.locator("#certificates");
  await expect(section.locator(".certificate-card")).toHaveCount(4);
  await section
    .getByRole("button", { name: "Networking", exact: true })
    .click();
  await expect(section.locator(".certificate-card")).toHaveCount(1);
  await section
    .getByRole("button", { name: "View Networking Basics & Ethical Hacking" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText(
    "CERTIFICATE IMAGE — PENDING",
  );
  await expect(
    page.getByRole("button", { name: "Zoom in", exact: true }),
  ).toBeDisabled();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  const research = page.locator("#research");
  await research
    .getByRole("button", { name: "Cryptography", exact: true })
    .click();
  await expect(research).toContainText("Research in progress.");
  await research.getByRole("button", { name: "Reset filters" }).click();
  await expect(
    research.getByRole("link", { name: /Inside the investigation/ }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Search research" })
    .fill("no matching record");
  await expect(research).toContainText("No matching records.");
  await page.getByRole("button", { name: "C/C++", exact: true }).click();
  await expect(page.locator("#skill-evidence-code")).toBeVisible();
});
test("MDX detail has static content, expandable explanation and code copy", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/research/writeup-template/");
  await expect(
    page.getByRole("heading", { name: "Inside the investigation." }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, follow",
  );
  await page.getByText("01 / Initial observations", { exact: true }).click();
  await expect(page.getByText(/Describe the provided files/)).toBeVisible();
  await page.getByRole("button", { name: "Copy code" }).click();
  await expect(page.getByRole("status")).toHaveText("Copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "def investigation_notes",
  );
  expect(errors).toEqual([]);
});
test("mobile menu, no overflow and no pinned layout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Experience" })
    .click();
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeVisible();
  await expect(page).toHaveURL(/#experience$/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
});
test("desktop cinematic scroll and gallery keyboard reachability", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForTimeout(700);
  await expect(page.locator(".pin-spacer")).toHaveCount(2);
  await page.screenshot({ path: "test-results/desktop.png" });
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(800);
  expect(
    await page
      .locator(".hero-title")
      .evaluate((el) => getComputedStyle(el).transform),
  ).not.toBe("none");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await page.waitForTimeout(1500);
  await page.getByRole("button", { name: "Next project" }).click();
  await page.waitForTimeout(1000);
  expect(
    await page
      .locator(".project-track")
      .evaluate((el) => getComputedStyle(el).transform),
  ).not.toBe("none");
  await page.locator("#matrix").focus();
  await page.waitForTimeout(600);
  const box = await page.locator("#matrix").boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x).toBeLessThan(1440);
  await page.getByRole("button", { name: "Toggle cinematic motion" }).click();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
});
test("WCAG checks with motion reduced", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForTimeout(250);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
test("content remains available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("#experience")).toContainText("ACIS");
  await expect(page.locator("#projects")).toContainText(
    "Matrix Multiplication",
  );
  const box = await page.locator("#matrix").boundingBox();
  expect(box!.x).toBeLessThan(1280);
  await context.close();
});
