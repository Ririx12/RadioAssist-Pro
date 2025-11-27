# RadioAssist Pro - Testing Guide

Complete testing documentation for unit tests, integration tests, and E2E tests.

---

## 📋 Table of Contents

1. [Testing Stack](#testing-stack)
2. [Running Tests](#running-tests)
3. [Unit Tests](#unit-tests)
4. [E2E Tests](#e2e-tests)
5. [Coverage](#coverage)
6. [CI/CD Integration](#cicd-integration)

---

## 🛠️ Testing Stack

- **Unit/Integration Tests**: Vitest + happy-dom
- **E2E Tests**: Playwright
- **Coverage**: Vitest Coverage (v8)

---

## 🚀 Running Tests

### Quick Start

```bash
# Install dependencies
npm install

# Run all unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run E2E tests
npm run test:e2e

# Run all tests with coverage
npm run test:coverage
```

### Test Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all unit tests |
| `npm test -- --watch` | Run tests in watch mode |
| `npm run test:ui` | Open Vitest UI |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Open Playwright UI |

---

## 🧪 Unit Tests

### Test Files

```
src/
├── utils/
│   ├── codeJauneValidator.test.js    ✅ 15+ tests
│   └── protocolTemplates.test.js     ✅ 25+ tests
└── services/
    └── history.test.js                ✅ 20+ tests
```

### Code Jaune Validator Tests

**File**: `src/utils/codeJauneValidator.test.js`

Tests critical medical safety validation for stroke protocols.

**Coverage:**
- ✅ Non-Code Jaune cases
- ✅ Code Jaune detection (case-insensitive, "CJ" abbreviation)
- ✅ Complete Code Jaune validation
- ✅ Incomplete Code Jaune detection
- ✅ Missing field identification (NIHSS, symptom onset, clinical signs)
- ✅ Error message generation
- ✅ Edge cases and real-world scenarios

**Example:**
```bash
npm test codeJauneValidator
```

**Key Tests:**
- `should detect "Code Jaune" text`
- `should validate complete Code Jaune with all fields`
- `should detect missing NIHSS score`
- `should block incomplete Code Jaune for patient safety`

---

### Protocol Templates Tests

**File**: `src/utils/protocolTemplates.test.js`

Tests all CT protocol templates for medical accuracy.

**Coverage:**
- ✅ All 19 protocol templates
- ✅ Contrast agent substitution (Xenetix vs Iomeron)
- ✅ Medical terminology correctness
- ✅ Anatomical planes and slice thickness
- ✅ Reconstruction techniques (MIP, MPR, VRT)
- ✅ Real-world medical scenarios

**Example:**
```bash
npm test protocolTemplates
```

**Key Templates Tested:**
- Encéphale (Brain): natif, injecté, angio TSA
- Thorax: natif, natif+injecté, mixte
- Abdomen-Pelvis: natif, injecté, natif+injecté
- TAP (Thoraco-Abdomino-Pelvis)
- Aorte + Membres Inférieurs

---

### History Service Tests

**File**: `src/services/history.test.js`

Tests localStorage-based history management.

**Coverage:**
- ✅ Save/retrieve history
- ✅ Delete specific items
- ✅ Clear all history
- ✅ 10-item limit enforcement
- ✅ Timestamp formatting
- ✅ localStorage corruption handling
- ✅ Complete workflow scenarios

**Example:**
```bash
npm test history
```

---

## 🌐 E2E Tests

### Test Files

```
tests/e2e/
├── reformulation.spec.js    ✅ 12 tests (General workflow)
└── codeJaune.spec.js        ✅ 4 tests (Medical safety)
```

### Reformulation Workflow Tests

**File**: `tests/e2e/reformulation.spec.js`

Tests complete user workflow from input to export.

**Coverage:**
- ✅ Medical disclaimer display
- ✅ Settings panel functionality
- ✅ History panel with badge
- ✅ Input validation
- ✅ Protocol builder interaction
- ✅ Contrast agent toggling
- ✅ Copy functionality

**Example:**
```bash
npm run test:e2e reformulation
```

---

### Code Jaune E2E Tests

**File**: `tests/e2e/codeJaune.spec.js`

Tests critical stroke protocol safety features.

**Coverage:**
- ✅ Incomplete Code Jaune blocking
- ✅ Complete Code Jaune validation
- ✅ Stroke protocol selection
- ✅ Medical disclaimer warnings

**Example:**
```bash
npm run test:e2e codeJaune
```

---

## 📊 Coverage

### Generate Coverage Report

```bash
npm run test:coverage
```

**Coverage Output:**
- HTML report: `coverage/index.html`
- JSON report: `coverage/coverage-final.json`
- Text summary in terminal

### Coverage Targets

| Category | Target | Current |
|----------|--------|---------|
| Statements | >80% | - |
| Branches | >75% | - |
| Functions | >80% | - |
| Lines | >80% | - |

### Critical Coverage Areas

**Must have 100% coverage:**
- ✅ Code Jaune Validator
- ✅ Protocol Templates
- ✅ History Service

**Should have >90% coverage:**
- API services (OpenAI, Gemini)
- Clipboard service

---

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run test:e2e
      - run: npm run test:coverage
```

---

## 🧰 Writing New Tests

### Unit Test Template

```javascript
// src/utils/myFeature.test.js
import { describe, it, expect } from 'vitest';
import { myFunction } from './myFeature';

describe('My Feature', () => {
  it('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });

  it('should handle edge cases', () => {
    expect(myFunction(null)).toBe(null);
  });
});
```

### E2E Test Template

```javascript
// tests/e2e/myFeature.spec.js
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display correctly', async ({ page }) => {
    await expect(page.getByText('My Feature')).toBeVisible();
  });
});
```

---

## 🐛 Debugging Tests

### Unit Tests

```bash
# Run specific test file
npm test -- codeJauneValidator

# Run tests matching pattern
npm test -- --grep "Code Jaune"

# Run with detailed output
npm test -- --reporter=verbose

# Debug in VS Code
# Add breakpoint and use "JavaScript Debug Terminal"
```

### E2E Tests

```bash
# Run with UI mode
npm run test:e2e:ui

# Run in headed mode (see browser)
npx playwright test --headed

# Debug specific test
npx playwright test --debug reformulation

# Run specific browser
npx playwright test --project=chromium
```

---

## 📝 Test Organization Best Practices

### Unit Tests

1. **Co-locate with source**: Place `.test.js` next to source file
2. **Descriptive names**: Use `describe` and `it` clearly
3. **Arrange-Act-Assert**: Structure tests in 3 parts
4. **Test edge cases**: Empty, null, invalid inputs
5. **Mock external dependencies**: Don't call real APIs

### E2E Tests

1. **Use Page Object Model**: Extract selectors
2. **Independent tests**: Each test should work alone
3. **Clean state**: Reset between tests
4. **Realistic scenarios**: Test user workflows
5. **Mobile testing**: Test responsive design

---

## 🎯 Testing Checklist

Before deploying to production:

### Unit Tests
- [ ] All Code Jaune validator tests pass
- [ ] All protocol template tests pass
- [ ] All history service tests pass
- [ ] Coverage >80% for critical modules
- [ ] No failing tests in watch mode

### E2E Tests
- [ ] Reformulation workflow tests pass
- [ ] Code Jaune medical safety tests pass
- [ ] Tests pass in all browsers (Chromium, Firefox, Safari)
- [ ] Mobile viewport tests pass

### Manual Testing
- [ ] Test with real API keys
- [ ] Test Code Jaune validation with incomplete data
- [ ] Test history save/restore
- [ ] Test protocol generation accuracy
- [ ] Test copy functionality across browsers

---

## 📚 Resources

- **Vitest Docs**: https://vitest.dev
- **Playwright Docs**: https://playwright.dev
- **Testing Best Practices**: https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

---

## 🆘 Troubleshooting

### Tests Fail Locally

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vitest cache
npx vitest --clearCache

# Update Playwright browsers
npx playwright install
```

### E2E Tests Timeout

```bash
# Increase timeout in playwright.config.js
timeout: 30000  // 30 seconds

# Or set per-test
test('my test', async ({ page }) => {
  test.setTimeout(60000);
  // ...
});
```

### Coverage Not Generated

```bash
# Install coverage provider
npm install -D @vitest/coverage-v8

# Run with explicit coverage
npx vitest --coverage
```

---

**All tests passing = Production ready! ✅**
