import test from 'node:test';
import assert from 'node:assert/strict';
import { extractAndParseJSON } from './jsonParser';

test('parses pure clean JSON string', () => {
  const result = extractAndParseJSON('{"name":"Product A","score":95}');
  assert.equal(result.name, 'Product A');
  assert.equal(result.score, 95);
});

test('strips markdown codeblocks and parses inner JSON', () => {
  const raw = '```json\n{\n  "products": [{"id": 1, "title": "Gadget"}]\n}\n```';
  const result = extractAndParseJSON(raw);
  assert.equal(result.products.length, 1);
  assert.equal(result.products[0].title, 'Gadget');
});

test('handles surrounding conversational text and fixes trailing commas', () => {
  const raw = 'Here is the analysis:\n{\n  "verdict": "MUST LAUNCH",\n  "reasons": ["high demand", "low cogs",],\n}\nHope this helps!';
  const result = extractAndParseJSON(raw);
  assert.equal(result.verdict, 'MUST LAUNCH');
  assert.equal(result.reasons.length, 2);
});

test('throws error on empty or invalid input', () => {
  assert.throws(() => extractAndParseJSON(''), /Empty or non-string/);
  assert.throws(() => extractAndParseJSON('Just plain text without braces'), /Failed to parse/);
});
