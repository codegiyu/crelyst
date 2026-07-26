import { describe, expect, it } from 'vitest';
import {
  bbsPublishTooltip,
  getBbsContentPublishState,
  mapVercelDeployState,
  resolveBbsPublishUiState,
} from './bbsPublishStatus';

describe('getBbsContentPublishState', () => {
  it('returns unpublished when lastPublishedAt is missing', () => {
    expect(
      getBbsContentPublishState({
        contentUpdatedAt: '2026-07-26T12:00:00.000Z',
        lastPublishedAt: null,
      })
    ).toBe('unpublished');
  });

  it('returns unpublished when content is newer than last publish', () => {
    expect(
      getBbsContentPublishState({
        contentUpdatedAt: '2026-07-26T13:00:00.000Z',
        lastPublishedAt: '2026-07-26T12:00:00.000Z',
      })
    ).toBe('unpublished');
  });

  it('returns published when content is not newer than last publish', () => {
    expect(
      getBbsContentPublishState({
        contentUpdatedAt: '2026-07-26T12:00:00.000Z',
        lastPublishedAt: '2026-07-26T12:00:00.000Z',
      })
    ).toBe('published');
  });

  it('returns unknown when content timestamp is missing', () => {
    expect(
      getBbsContentPublishState({
        contentUpdatedAt: null,
        lastPublishedAt: '2026-07-26T12:00:00.000Z',
      })
    ).toBe('unknown');
  });
});

describe('mapVercelDeployState + resolveBbsPublishUiState', () => {
  it('maps building deploy over published content', () => {
    expect(mapVercelDeployState('BUILDING')).toBe('building');
    expect(
      resolveBbsPublishUiState({
        contentState: 'published',
        deployState: 'building',
      })
    ).toBe('building');
  });

  it('shows unpublished when content is ahead and deploy is idle', () => {
    expect(
      resolveBbsPublishUiState({
        contentState: 'unpublished',
        deployState: 'idle',
      })
    ).toBe('unpublished');
  });

  it('shows error for failed deploy', () => {
    expect(mapVercelDeployState('ERROR')).toBe('error');
    expect(
      resolveBbsPublishUiState({
        contentState: 'unpublished',
        deployState: 'error',
      })
    ).toBe('error');
  });
});

describe('bbsPublishTooltip', () => {
  it('returns actionable copy per state', () => {
    expect(bbsPublishTooltip('unpublished')).toMatch(/changes since/i);
    expect(bbsPublishTooltip('building')).toMatch(/in progress/i);
    expect(bbsPublishTooltip('published')).toMatch(/live/i);
    expect(bbsPublishTooltip('error')).toMatch(/failed/i);
  });
});
