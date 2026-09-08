// Run: node --experimental-strip-types --test tests/rewardCardMerge.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { canActivateRewardCard, canMergeRewardCard, createMergedRewardCard, getRewardCardExpiryTime } from '../src/utils/rewardCardMerge.ts';

const card = (id, overrides = {}) => ({ id, milestoneDay: 0, title: id, currency: 'activity-silver', status: 'inactive', amount: 1000, currentBalance: 600, totalTurnover: 200, turnoverTarget: 10000, conversionLimit: 800, expiresAt: '2026/12/31', convertedAmount: 0, recoveredAmount: 0, convertedAt: '', ...overrides });
const now = new Date(2026, 8, 8);
const merge = (cards, time = now) => createMergedRewardCard(cards, cards.map(item => item.id), 'new', time);

test('72-hour cutoff is inclusive; activation remains available before expiry', () => {
    const c = card('a');
    const cutoff = getRewardCardExpiryTime(c) - 72 * 3600000;
    assert.equal(canMergeRewardCard(c, new Date(cutoff - 1)), true);
    for (const time of [cutoff, cutoff + 1, getRewardCardExpiryTime(c) - 1]) {
        assert.equal(canMergeRewardCard(c, new Date(time)), false);
        assert.equal(canActivateRewardCard(c, new Date(time)), true);
    }
    assert.equal(canActivateRewardCard(c, new Date(getRewardCardExpiryTime(c))), false);
});

test('sums all five raw values and chooses earliest expiry, without recalculating multipliers', () => {
    const a = card('a');
    const b = card('b', { amount: 3000, currentBalance: 3500, totalTurnover: 4000, turnoverTarget: 60000, conversionLimit: 2500, expiresAt: '2026/11/30' });
    const result = merge([a, b]);
    assert.deepEqual([result.amount, result.currentBalance, result.turnoverTarget, result.totalTurnover, result.conversionLimit], [4000, 4100, 70000, 4200, 3300]);
    assert.equal(result.expiresAt, '2026/11/30');
    assert.equal(result.status, 'inactive');
    assert.equal(a.status, 'inactive');
    const again = merge([{ ...result, id: 'previous' }, card('c', { expiresAt: '2027/01/31' })]);
    assert.equal(again.expiresAt, '2026/11/30');
    assert.equal(again.sourceCount, 3);
});

test('no selection upper bound; rejects fewer than two, duplicate, missing or reused IDs', () => {
    assert.equal(merge(Array.from({ length: 100 }, (_, i) => card(String(i)))).sourceCount, 100);
    assert.equal(merge([card('a')]), null);
    assert.equal(createMergedRewardCard([card('a')], ['a', 'a'], 'new', now), null);
    assert.equal(createMergedRewardCard([card('a')], ['a', 'missing'], 'new', now), null);
    assert.equal(createMergedRewardCard([card('a'), card('b')], ['a', 'b'], 'a', now), null);
});

test('active card must be paused; historical, expired and invalid-date cards are rejected', () => {
    for (const status of ['active', 'converted', 'merged']) assert.equal(merge([card('a', { status }), card('b')]), null);
    assert.ok(merge([card('a', { status: 'paused' }), card('b')]));
    for (const expiresAt of ['2020/01/01', 'invalid', '2026/02/30']) assert.equal(merge([card('a', { expiresAt }), card('b')]), null);
});

test('rechecks cutoff when confirming a previously valid preview', () => {
    const cards = [card('a'), card('b')];
    const cutoff = getRewardCardExpiryTime(cards[0]) - 72 * 3600000;
    assert.ok(merge(cards, new Date(cutoff - 1)));
    assert.equal(merge(cards, new Date(cutoff)), null);
});
