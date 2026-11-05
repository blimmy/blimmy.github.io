import { test, expect } from "@playwright/test";

test("navigation has a single destination and keeps the heading below the fixed menu", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle cinematic motion" }).click();
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
  await page.getByRole("button", { name: "Toggle cinematic motion" }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await expect(page).toHaveURL(/#projects$/);
  const movement = await page
    .getByRole("button", { name: "Next project" })
    .evaluate(async (button) => {
      const before = scrollY;
      (button as HTMLButtonElement).click();
      const immediate = scrollY;
      const samples: number[] = [];
      const start = performance.now();
      await new Promise<void>((resolve) => {
        const sample = () => {
          samples.push(scrollY);
          if (performance.now() - start < 900) requestAnimationFrame(sample);
          else resolve();
        };
        requestAnimationFrame(sample);
      });
      return { before, immediate, samples };
    });
  // Assert behavior without assuming the CI machine's frame rate.
  expect(Math.abs(movement.immediate - movement.before)).toBeLessThan(2);
  expect(new Set(movement.samples).size).toBeGreaterThan(4);
  await expect
    .poll(async () => (await page.locator("#linux-shell").boundingBox())!.x)
    .toBeGreaterThanOrEqual(0);
  await expect
    .poll(async () => (await page.locator("#linux-shell").boundingBox())!.x)
    .toBeLessThan(100);
  await page.waitForTimeout(200);
  const settled = await page.evaluate(() => scrollY);
  expect(settled - movement.before).toBeGreaterThan(500);
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
  await page.getByRole("button", { name: "Toggle cinematic motion" }).click();
  await expect(page.locator(".pin-spacer")).toHaveCount(2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Toggle cinematic motion" }),
  ).toHaveAttribute("aria-pressed", "false");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".pin-spacer")).toHaveCount(2);
});

test("cinematic motion starts and cleans up when resizing between mobile and desktop", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle cinematic motion" }).click();
  await expect(page.locator(".pin-spacer")).toHaveCount(2);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  for (let i = 0; i < 2; i++) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await expect(page.locator(".pin-spacer")).toHaveCount(2);
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await expect(page.locator("html")).not.toHaveAttribute("data-cinematic");
  }
});

test("pausing during a slow motion download prevents late activation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  let release!: () => void;
  const gate = new Promise<void>((resolve) => (release = resolve));
  let requested!: () => void;
  const download = new Promise<void>((resolve) => (requested = resolve));
  await page.route("**/_next/static/chunks/*.js", async (route) => {
    requested();
    await gate;
    await route.continue();
  });
  try {
    await page.getByRole("button", { name: "Toggle cinematic motion" }).click();
    await download;
    const toggle = page.getByRole("button", {
      name: "Toggle cinematic motion",
    });
    await toggle.click();
    release();
    await page.waitForLoadState("networkidle");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await toggle.click();
    await expect(page.locator(".pin-spacer")).toHaveCount(2);
    expect(errors).toEqual([]);
  } finally {
    release();
  }
});

test("navigation stays at its destination when the motion engine arrives late", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  let release!: () => void;
  const gate = new Promise<void>((resolve) => (release = resolve));
  await page.route("**/_next/static/chunks/*.js", async (route) => {
    await gate;
    await route.continue();
  });
  try {
    await page.getByRole("button", { name: "Toggle cinematic motion" }).click();
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Experience", exact: true })
      .click();
    const destinationY = async () =>
      Math.round((await page.locator("#experience").boundingBox())!.y);
    await expect.poll(destinationY).toBeLessThan(100);
    release();
    await expect(page.locator("html")).toHaveAttribute(
      "data-cinematic",
      "true",
    );
    await page.waitForLoadState("networkidle");
    await expect.poll(destinationY).toBeGreaterThanOrEqual(85);
    await expect.poll(destinationY).toBeLessThan(100);
  } finally {
    release();
  }
});
