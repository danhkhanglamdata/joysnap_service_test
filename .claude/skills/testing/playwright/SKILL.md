# Playwright E2E Testing Skill

End-to-end testing patterns and best practices using Playwright.

## Overview

Playwright is a modern E2E testing framework supporting Chrome, Firefox, and WebKit with a single API.

## Version

Playwright 1.50+ with MCP integration

## When to Use

- Full user flow testing (login, checkout, forms)
- Cross-browser compatibility testing
- Visual regression testing
- API + UI integration testing
- Accessibility testing
- Component testing

## Setup

```bash
# Install
npm init playwright@latest

# Or add to existing project
npm install -D @playwright/test
npx playwright install
```

## Project Structure

```
tests/
├── e2e/
│   ├── auth.spec.ts       # Authentication flows
│   ├── checkout.spec.ts   # Purchase flows
│   └── navigation.spec.ts # Page navigation
├── components/
│   └── button.spec.ts     # Component tests
├── fixtures/
│   └── test-data.ts       # Shared test data
└── playwright.config.ts   # Configuration
```

## Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['iPhone 14'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Test Patterns

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Act
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Assert
    await expect(page.getByText('Welcome')).toBeVisible();
  });
});
```

### Authentication Flow

```typescript
test('user can login', async ({ page }) => {
  await page.goto('/login');
  
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('securepass');
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  // Wait for navigation
  await page.waitForURL('/dashboard');
  
  // Verify logged in state
  await expect(page.getByTestId('user-menu')).toBeVisible();
});
```

### Form Testing

```typescript
test('form validation works', async ({ page }) => {
  await page.goto('/register');
  
  // Submit empty form
  await page.getByRole('button', { name: 'Register' }).click();
  
  // Check validation errors
  await expect(page.getByText('Email is required')).toBeVisible();
  await expect(page.getByText('Password is required')).toBeVisible();
  
  // Fill valid data
  await page.getByLabel('Email').fill('new@example.com');
  await page.getByLabel('Password').fill('ValidPass123!');
  await page.getByRole('button', { name: 'Register' }).click();
  
  // Verify success
  await expect(page.getByText('Registration successful')).toBeVisible();
});
```

### API Mocking

```typescript
test('handles API errors gracefully', async ({ page }) => {
  // Mock API to return error
  await page.route('**/api/users', route => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Server error' }),
    });
  });
  
  await page.goto('/users');
  
  await expect(page.getByText('Failed to load users')).toBeVisible();
});

// Mock successful response
test('displays user data', async ({ page }) => {
  await page.route('**/api/users', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
      ]),
    });
  });
  
  await page.goto('/users');
  await expect(page.getByText('John Doe')).toBeVisible();
});
```

### Visual Testing

```typescript
test('homepage matches snapshot', async ({ page }) => {
  await page.goto('/');
  
  // Full page screenshot
  await expect(page).toHaveScreenshot('homepage.png');
  
  // Component screenshot
  const header = page.getByRole('banner');
  await expect(header).toHaveScreenshot('header.png');
});

// With threshold for minor differences
test('product card visual', async ({ page }) => {
  await page.goto('/products/1');
  const card = page.getByTestId('product-card');
  await expect(card).toHaveScreenshot('product-card.png', {
    maxDiffPixels: 100,
  });
});
```

### Accessibility Testing

```typescript
import AxeBuilder from '@axe-core/playwright';

test('page should be accessible', async ({ page }) => {
  await page.goto('/');
  
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  
  expect(accessibilityScanResults.violations).toEqual([]);
});

// Check specific WCAG rules
test('form accessibility', async ({ page }) => {
  await page.goto('/contact');
  
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  
  expect(results.violations).toEqual([]);
});
```

### Component Testing

```typescript
// tests/components/button.spec.ts
import { test, expect } from '@playwright/experimental-ct-react';
import { Button } from '../../src/components/Button';

test('button renders correctly', async ({ mount }) => {
  const component = await mount(<Button>Click me</Button>);
  
  await expect(component).toContainText('Click me');
  await expect(component).toBeVisible();
});

test('button handles click', async ({ mount }) => {
  let clicked = false;
  const component = await mount(
    <Button onClick={() => clicked = true}>Click me</Button>
  );
  
  await component.click();
  expect(clicked).toBe(true);
});
```

### Drag and Drop

```typescript
test('drag and drop items', async ({ page }) => {
  await page.goto('/kanban');
  
  const source = page.getByTestId('task-1');
  const target = page.getByTestId('column-done');
  
  await source.dragTo(target);
  
  await expect(target).toContainText('Task 1');
});
```

### File Upload

```typescript
test('upload file', async ({ page }) => {
  await page.goto('/upload');
  
  const fileInput = page.getByLabel('Upload file');
  await fileInput.setInputFiles('tests/fixtures/test-file.pdf');
  
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('File uploaded successfully')).toBeVisible();
});
```

### Multi-tab Testing

```typescript
test('opens link in new tab', async ({ page, context }) => {
  await page.goto('/');
  
  // Wait for new page
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: 'External Link' }).click(),
  ]);
  
  await newPage.waitForLoadState();
  expect(newPage.url()).toContain('external-site.com');
});
```

---

## Playwright MCP Tools

When using Playwright MCP server, these tools are available:

### browser_navigate
Navigate to a URL.
```javascript
{ name: 'browser_navigate', arguments: { url: 'https://example.com' } }
```

### browser_snapshot
Capture accessibility tree snapshot.
```javascript
{ name: 'browser_snapshot', arguments: {} }
```

### browser_click
Click an element by reference.
```javascript
{ 
  name: 'browser_click', 
  arguments: { 
    element: 'Submit button', 
    ref: 'e6',
    doubleClick: false,
    button: 'left',
    modifiers: ['Control']
  } 
}
```

### browser_type
Type text into an element.
```javascript
{ 
  name: 'browser_type', 
  arguments: { 
    element: 'Email textbox', 
    ref: 'e3', 
    text: 'user@example.com',
    submit: true,
    slowly: false
  } 
}
```

### browser_resize
Resize browser window.
```javascript
{ name: 'browser_resize', arguments: { width: 1920, height: 1080 } }
```

### browser_evaluate
Execute JavaScript on page.
```javascript
{ 
  name: 'browser_evaluate', 
  arguments: { 
    function: '() => document.title',
    element: 'Page body',
    ref: 'body'
  } 
}
```

### browser_drag
Drag and drop between elements.
```javascript
{ 
  name: 'browser_drag', 
  arguments: { 
    startElement: 'Draggable item',
    startRef: '#draggable',
    endElement: 'Drop target',
    endRef: '#droppable'
  } 
}
```

### browser_navigate_back
Go back in history.
```javascript
{ name: 'browser_navigate_back', arguments: {} }
```

---

## Locator Strategies (Priority Order)

1. **Role-based** (preferred): `getByRole('button', { name: 'Submit' })`
2. **Label**: `getByLabel('Email')`
3. **Placeholder**: `getByPlaceholder('Enter email')`
4. **Text**: `getByText('Welcome')`
5. **Test ID**: `getByTestId('submit-btn')`
6. **CSS** (last resort): `locator('.submit-button')`

## Best Practices

### DO
- Use role-based locators for accessibility
- Test user-visible behavior, not implementation
- Keep tests independent and isolated
- Use `test.describe` for grouping related tests
- Add `data-testid` for complex components
- Run tests in CI with retries
- Use Page Object Model for complex apps
- Test accessibility with axe-core

### DON'T
- Don't use `page.waitForTimeout()` - use proper waits
- Don't test third-party services directly
- Don't share state between tests
- Don't use brittle CSS selectors
- Don't ignore flaky tests - fix them
- Don't hardcode test data

## Page Object Model

```typescript
// pages/login.page.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

// Usage in test
test('login flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  await expect(page).toHaveURL('/dashboard');
});
```

## Commands

```bash
# Run all tests
npx playwright test

# Run specific file
npx playwright test auth.spec.ts

# Run in headed mode
npx playwright test --headed

# Run specific browser
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug

# UI mode (interactive)
npx playwright test --ui

# Generate tests (codegen)
npx playwright codegen localhost:3000

# View report
npx playwright show-report

# Update snapshots
npx playwright test --update-snapshots
```

## CI Integration

```yaml
# .github/workflows/e2e.yml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## Comparison with Other Tools

| Feature | Playwright | Cypress | Selenium |
|---------|------------|---------|----------|
| Cross-browser | ✅ All | ⚠️ Limited | ✅ All |
| Speed | Fast | Fast | Slow |
| Auto-wait | ✅ Built-in | ✅ Built-in | ❌ Manual |
| Network mocking | ✅ Full | ✅ Full | ⚠️ Limited |
| Mobile emulation | ✅ Yes | ⚠️ Viewport only | ⚠️ Limited |
| Parallel | ✅ Native | ⚠️ Paid | ✅ Grid |
| Component testing | ✅ Yes | ✅ Yes | ❌ No |
| Accessibility | ✅ axe-core | ✅ axe-core | ⚠️ Manual |

## Resources

- [Playwright Docs](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Playwright MCP](https://github.com/microsoft/playwright-mcp)
