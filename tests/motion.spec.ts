import { test, expect } from "@playwright/test";

test("navigation has a single destination and keeps the heading below the fixed menu", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-cinematic", "true");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Experience", exact: true })
    .click();
  await expect(page).toHaveURL(/#experience$/);
  await expect
    .poll(async () =>
      Math.round((await page.locator("#experience").boundingBox())!.y),
    )
    .toBeGreaterThanOrEqual(85);
  expect((await page.locator("#experience").boundingBox())!.y).toBeLessThan(
    100,
  );
  await expect(page.locator("#experience")).toBeFocused();
});

test("project buttons animate and pointer focus does not jump to another scroll position", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await expect(page).toHaveURL(/#projects$/);
  const before = await page.evaluate(() => scrollY);
  // A synthetic click lets us inspect the first animation frame instead of
  // waiting for Playwright's mouse stabilization time.
  await page
    .getByRole("button", { name: "Next project" })
    .evaluate((button) => (button as HTMLButtonElement).click());
  const firstFrame = await page.evaluate(
    () =>
      new Promise<number>((resolve) =>
        requestAnimationFrame(() => resolve(scrollY)),
      ),
  );
  expect(firstFrame - before).toBeLessThan(150);
  await expect
    .poll(async () => (await page.locator("#linux-shell").boundingBox())!.x)
    .toBeGreaterThanOrEqual(0);
  await expect
    .poll(async () => (await page.locator("#linux-shell").boundingBox())!.x)
    .toBeLessThan(100);
  await page.waitForTimeout(200);
  const settled = await page.evaluate(() => scrollY);
  expect(settled - before).toBeGreaterThan(500);
  await page.locator("#linux-shell summary").click();
  await expect(page.locator("#linux-shell details")).toHaveAttribute(
    "open",
    "",
  );
  await page.waitForTimeout(250);
  expect(Math.abs((await page.evaluate(() => scrollY)) - settled)).toBeLessThan(
    5,
  );
});

test("OS motion preference disables cinematic scrolling while the page is open", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Toggle cinematic motion" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".pin-spacer")).toHaveCount(2);
});
