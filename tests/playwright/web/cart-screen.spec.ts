import { test, expect } from './fixture';
import {seed} from "@repo/db/seed"

test.describe('cart Screen', () => { 
  test.beforeAll(async () => {
    await seed();
  });
  test("Loading when un authenticated", async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page.getByText("You need to be logged in to have a cart")).toBeVisible();
  })

  

})
