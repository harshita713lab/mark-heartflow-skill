// tests/confidence-boundary.test.js
// Task 2: Confidence Boundary Tests

const { HeartFlow } = require('../src/core/heartflow.js');

const hf = new HeartFlow();

try {
  hf.start();
  console.log('✅ HeartFlow started successfully');
} catch(e) {
  console.log('⚠️ HeartFlow start error:', e.message);
}

let passed = 0, failed = 0;

async function test(name, fn) {
  try {
    const result = await fn();
    if (result === false) {
      console.log('❌ FAIL:', name);
      failed++;
    } else {
      console.log('✅ PASS:', name);
      passed++;
    }
  } catch(e) {
    console.log('❌ ERROR:', name, '→', e.message.slice(0, 80));
    failed++;
  }
}

async function runTests() {
  console.log('\n=== Confidence Boundary Tests ===\n');

  // Test 1: Empty string
  await test('hf.think("") → should return error or hold decision', async () => {
    const result = await hf.think('');
    // Check if result has error OR decision.type is 'hold' with low confidence
    if (result.error) return true;
    return result?.decision?.type === 'hold' && result?.decision?.confidence < 0.5;
  });

  // Test 2: Null input → should handle gracefully
  await test('hf.think(null) → should handle gracefully', async () => {
    const result = await hf.think(null);
    return result && (result.error || result.cognition !== undefined);
  });

  // Test 3: Undefined input → should handle gracefully
  await test('hf.think(undefined) → should handle gracefully', async () => {
    const result = await hf.think(undefined);
    return result && (result.error || result.cognition !== undefined);
  });

  // Test 4: Whitespace-only → should return hold with low confidence
  await test('hf.think("   ") → should return hold decision with low confidence', async () => {
    const result = await hf.think('   ');
    // Whitespace returns valid response with decision.hold and confidence 0.3
    return result?.cognition?.decision?.type === 'hold' && 
           result?.cognition?.decision?.confidence < 0.4;
  });

  // Test 5: Single character "a" → should return valid response
  await test('hf.think("a") → should return valid response with cognition', async () => {
    const result = await hf.think('a');
    return result && result.cognition !== undefined && result.cognition.whatIsThis !== undefined;
  });

  // Test 6: Valid input "hello" → should have confidence >= 0.5
  await test('hf.think("hello") → should have confidence >= 0.5', async () => {
    const result = await hf.think('hello');
    const confidence = result?.decision?.confidence || result?.cognition?.decision?.confidence || 0;
    return confidence >= 0.5;
  });

  // Test 7: Very long string (10KB) → no crash
  await test('hf.think(10KB string) → no crash', async () => {
    const longString = 'a'.repeat(10240);
    const result = await hf.think(longString);
    return result !== undefined && result !== null;
  });

  // Test 8: Valid input should have decision.type
  await test('hf.think("hello") → should have decision.type', async () => {
    const result = await hf.think('hello');
    const decisionType = result?.decision?.type || result?.cognition?.decision?.type;
    return decisionType !== undefined && decisionType !== null;
  });

  console.log(`\n=== Results: ${passed}/${passed + failed} passed ===\n`);

  if (failed > 0) {
    console.log(`❌ ${failed} test(s) failed`);
    process.exit(1);
  } else {
    console.log('🎉 All confidence boundary tests passed!');
    console.log('✅ Task 2: Confidence Boundary Tests COMPLETED');
    process.exit(0);
  }
}

runTests();