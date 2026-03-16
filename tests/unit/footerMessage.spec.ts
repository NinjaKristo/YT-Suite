import { describe, it, expect } from 'vitest';
import { useMediaGroupStore } from '../../src/stores/media/group';
import { useMediaStateStore, MediaState } from '../../src/stores/media/state';
import TheFooter from '../../src/components/TheFooter.vue';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import en from '../../src/locales/en.json';

describe('TheFooter progress message', () => {
  it('shows ready items count excluding completed items', () => {
    const groupStore = useMediaGroupStore();
    const stateStore = useMediaStateStore();

    groupStore.createGroup({
      id: 'g1',
      url: 'g1',
      total: 2,
      processed: 2,
      errored: 0,
      isCombined: true,
      audioCodecs: [],
      formats: [],
      filesize: 0,
      items: {
        a: { id: 'a', url: 'a', title: 'A', audioCodecs: [], formats: [], filesize: 0, isLeader: true },
        b: { id: 'b', url: 'b', title: 'B', audioCodecs: [], formats: [], filesize: 0 },
      },
    });

    stateStore.setState('a', MediaState.done);
    stateStore.setState('b', MediaState.configure);

    const wrapper = mount(TheFooter, {
      global: {
        plugins: [
          createI18n({
            legacy: false,
            locale: 'en',
            fallbackLocale: 'en',
            messages: { en },
          }),
        ],
        stubs: {
          BaseProgress: { template: '<div><slot /></div>' },
          BaseButton: { template: '<button><slot /></button>' },
          BaseToggleButton: { template: '<button><slot /><slot name="on"/><slot name="off"/></button>' },
          FolderIcon: true,
          TrashIcon: true,
          LockOpenIcon: true,
          LockClosedIcon: true,
          ChatBubbleBottomCenterIcon: true,
          ChatBubbleBottomCenterTextIcon: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Ready to download! 1 item queued.');
  });
});
