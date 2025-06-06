import "dotenv/config";

import { test as base, type BrowserContext, type Page } from "@playwright/test";

// Declare the types of your fixtures.
type MyFixtures = {
  adminPage: Page;
  userPage: Page;
};

type AppOptions = {};

export function createOptions(options: Partial<AppOptions>) {
  return JSON.stringify({});
}

export async function setOptions(
  context: BrowserContext,
  options: Partial<AppOptions>,
) {
  await context.addCookies([
    {
      name: "options",
      url: "http://localhost:3000",
      value: createOptions(options),
    },
  ]);
}

export * from "@playwright/test";
export const test = base.extend<MyFixtures>({  userPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: ".auth/user.json",
    });
    const userPage = await context.newPage();
    await use(userPage);
    await context.close();
  },
});
export const test2 = base.extend<MyFixtures>({  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: ".auth/admin.json",
    });
    const adminPage = await context.newPage();
    await use(adminPage);
    await context.close();
  },
});
