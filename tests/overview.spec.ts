import { test, expect } from "@playwright/test";

for (const cpuRate of [1, 4]) {
  test(`switching motion views keeps the same project in view (${cpuRate}x CPU slowdown)`, async ({
    page,
    context,
  }) => {
    const cdp = await context.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpuRate });
    await page.goto("/#linux-shell");
    const project = page.locator("#linux-shell");
    // A role can enter the viewport while the native anchor scroll is still
    // passing the previous project. Wait for the destination before switching.
    await expect
      .poll(() =>
        project.evaluate((element) => {
          const padding = parseFloat(
            getComputedStyle(document.documentElement).scrollPaddingTop,
          ) || 0;
          const margin = parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
          return Math.abs(element.getBoundingClientRect().top - padding - margin);
        }),
      )
      .toBeLessThan(1);
    await expect(project.locator(".project-role")).toBeInViewport();
    const motion = page.getByRole("button", { name: "Toggle cinematic motion" });
    await motion.click();
    await expect(page.locator(".pin-spacer")).toHaveCount(2);
    await expect
      .poll(async () => (await project.boundingBox())!.x)
      .toBeGreaterThanOrEqual(0);
    await expect
      .poll(async () => (await project.boundingBox())!.x)
      .toBeLessThan(100);
    await expect(project.locator(".project-role")).toBeInViewport();
    const before = (await project.boundingBox())!.y;
    await motion.click();
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await expect
      .poll(async () => Math.abs((await project.boundingBox())!.y - before))
      .toBeLessThan(5);
  });
}

test("the default view exposes hiring essentials and keeps projects readable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reading");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  const hero = page.locator("#home");
  await expect(hero).toContainText("Siriphanaphorn Sirikun");
  await expect(hero).toContainText("Cybersecurity · IT Audit");
  await expect(
    hero.getByRole("link", { name: /Download resume/ }),
  ).toBeInViewport();
  await expect(
    hero.getByRole("link", { name: "blimmyw@gmail.com" }),
  ).toBeInViewport();
  await expect(
    hero.getByRole("link", { name: /Download resume/ }),
  ).toHaveAttribute("download", "");
  await expect(page.locator("#about")).toContainText("Expected 2027");
  await expect(page.locator("#about")).toContainText(
    "ACIS Professional Center",
  );
  await expect(page.locator(".project-role")).toHaveCount(3);
  await expect(page.locator("#projects details[open]")).toHaveCount(0);
  await page
    .locator(".project-jump-links")
    .getByRole("link", { name: /Linux Shell in C/ })
    .click();
  await expect(page).toHaveURL(/#linux-shell$/);
  await expect(page.locator("#linux-shell .project-role")).toContainText(
    "Built the shell",
  );
  await page.locator("#linux-shell summary").click();
  await expect(page.locator("#linux-shell details")).toContainText(
    "Signal handling",
  );
  const sections = await page
    .locator("main > section")
    .evaluateAll((items) => items.map((item) => item.id));
  expect(sections.indexOf("experience")).toBeLessThan(
    sections.indexOf("projects"),
  );
  expect(sections.indexOf("projects")).toBeLessThan(
    sections.indexOf("terminal"),
  );
});

test("returning to reading view preserves the section being read", async ({
  page,
}) => {
  await page.goto("/");
  const motion = page.getByRole("button", { name: "Toggle cinematic motion" });
  await expect(motion).toHaveAttribute("aria-pressed", "false");
  await motion.click();
  await expect(page.locator(".pin-spacer")).toHaveCount(2);
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Experience", exact: true })
    .click();
  await expect(page).toHaveURL(/#experience$/);
  const before = (await page.locator("#experience").boundingBox())!.y;
  await motion.click();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reading");
  await expect
    .poll(async () =>
      Math.abs((await page.locator("#experience").boundingBox())!.y - before),
    )
    .toBeLessThan(5);
});
