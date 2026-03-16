import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import MediaClipOptions from '../../src/components/media-card/MediaClipOptions.vue';
import en from '../../src/locales/en.json';
import { DownloadOptions, TrackType } from '../../src/tauri/types/media';

const BASE: DownloadOptions = { trackType: TrackType.both };

function makeWrapper(modelValue: Partial<DownloadOptions>, isPlaylist = false) {
  const merged: DownloadOptions = { ...BASE, ...modelValue };
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: { en },
  });

  return mount(MediaClipOptions, {
    props: { modelValue: merged, isPlaylist },
    global: { plugins: [i18n] },
  });
}

describe('MediaClipOptions', () => {
  it('renders the clip mode toggle', () => {
    const wrapper = makeWrapper({ clipMode: false });
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true);
  });

  it('hides time inputs when clip mode is off', () => {
    const wrapper = makeWrapper({ clipMode: false });
    expect(wrapper.find('input[type="text"]').exists()).toBe(false);
  });

  it('shows time inputs when clip mode is on', () => {
    const wrapper = makeWrapper({ clipMode: true });
    const inputs = wrapper.findAll('input[type="text"]');
    expect(inputs).toHaveLength(2);
  });

  it('emits update:modelValue with clipMode true when toggled on', async () => {
    const wrapper = makeWrapper({ clipMode: false });
    const checkbox = wrapper.find('input[type="checkbox"]');
    await checkbox.setValue(true);
    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    expect((emitted![0][0] as DownloadOptions).clipMode).toBe(true);
  });

  it('emits update:modelValue with clipMode false when toggled off', async () => {
    const wrapper = makeWrapper({ clipMode: true, clipStart: '00:10', clipEnd: '01:00' });
    const checkbox = wrapper.find('input[type="checkbox"]');
    await checkbox.setValue(false);
    const emitted = wrapper.emitted('update:modelValue');
    expect((emitted![0][0] as DownloadOptions).clipMode).toBe(false);
  });

  it('emits updated clipStart on start input', async () => {
    const wrapper = makeWrapper({ clipMode: true });
    const [startInput] = wrapper.findAll('input[type="text"]');
    await startInput.setValue('00:30');
    const emitted = wrapper.emitted('update:modelValue');
    expect((emitted![0][0] as DownloadOptions).clipStart).toBe('00:30');
  });

  it('emits updated clipEnd on end input', async () => {
    const wrapper = makeWrapper({ clipMode: true });
    const [, endInput] = wrapper.findAll('input[type="text"]');
    await endInput.setValue('01:30');
    const emitted = wrapper.emitted('update:modelValue');
    expect((emitted![0][0] as DownloadOptions).clipEnd).toBe('01:30');
  });

  it('shows start time format error on blur with invalid value', async () => {
    const wrapper = makeWrapper({ clipMode: true, clipStart: 'abc', clipEnd: '' });
    const [startInput] = wrapper.findAll('input[type="text"]');
    await startInput.trigger('blur');
    expect(wrapper.text()).toContain('Invalid start time');
  });

  it('shows end time format error on blur with invalid value', async () => {
    const wrapper = makeWrapper({ clipMode: true, clipStart: '', clipEnd: 'xyz' });
    const [, endInput] = wrapper.findAll('input[type="text"]');
    await endInput.trigger('blur');
    expect(wrapper.text()).toContain('Invalid end time');
  });

  it('shows range error when end time is before start time', async () => {
    const wrapper = makeWrapper({ clipMode: true, clipStart: '01:00', clipEnd: '00:30' });
    const [startInput] = wrapper.findAll('input[type="text"]');
    await startInput.trigger('blur');
    expect(wrapper.text()).toContain('End time must be after start time');
  });

  it('shows no error for valid start < end times', async () => {
    const wrapper = makeWrapper({ clipMode: true, clipStart: '00:30', clipEnd: '01:00' });
    const [startInput] = wrapper.findAll('input[type="text"]');
    await startInput.trigger('blur');
    expect(wrapper.find('.text-error').exists()).toBe(false);
  });

  it('shows playlist warning when isPlaylist is true', () => {
    const wrapper = makeWrapper({ clipMode: true }, true);
    expect(wrapper.find('.text-warning').exists()).toBe(true);
  });

  it('does not show playlist warning when isPlaylist is false', () => {
    const wrapper = makeWrapper({ clipMode: true }, false);
    expect(wrapper.find('.text-warning').exists()).toBe(false);
  });

  it('emits numeric clipQuality when quality is changed', async () => {
    const wrapper = makeWrapper({ clipMode: true, clipQuality: 720 });
    const select = wrapper.find('select');
    await select.setValue('480');
    const emitted = wrapper.emitted('update:modelValue');
    expect((emitted![0][0] as DownloadOptions).clipQuality).toBe(480);
  });

  it('defaults quality select to 720 when clipQuality is unset', () => {
    const wrapper = makeWrapper({ clipMode: true });
    const select = wrapper.find('select');
    expect((select.element as HTMLSelectElement).value).toBe('720');
  });
});
