<template>
  <div class="flex flex-col gap-2">
    <label class="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        class="toggle toggle-primary toggle-sm"
        :checked="modelValue.clipMode"
        @change="onToggle"
      />
      <span class="label-text font-medium">{{ t('media.steps.configure.clip.toggle') }}</span>
    </label>

    <div v-if="modelValue.clipMode" class="flex flex-col gap-2 pl-1">
      <div v-if="isPlaylist" class="text-warning text-xs">
        {{ t('media.steps.configure.clip.playlistWarning') }}
      </div>

      <div class="flex gap-2 flex-wrap">
        <div class="flex flex-col gap-1">
          <span class="label-text text-xs opacity-70">{{ t('media.steps.configure.clip.startTime') }}</span>
          <input
            type="text"
            class="input input-primary input-sm w-28"
            :class="{ 'input-error': errors.start }"
            :value="modelValue.clipStart ?? ''"
            :placeholder="t('media.steps.configure.clip.startPlaceholder')"
            @input="onStartInput"
            @blur="validate"
          />
          <span v-if="errors.start" class="text-error text-xs">{{ errors.start }}</span>
        </div>

        <div class="flex flex-col gap-1">
          <span class="label-text text-xs opacity-70">{{ t('media.steps.configure.clip.endTime') }}</span>
          <input
            type="text"
            class="input input-primary input-sm w-28"
            :class="{ 'input-error': errors.end }"
            :value="modelValue.clipEnd ?? ''"
            :placeholder="t('media.steps.configure.clip.endPlaceholder')"
            @input="onEndInput"
            @blur="validate"
          />
          <span v-if="errors.end" class="text-error text-xs">{{ errors.end }}</span>
        </div>

        <div class="flex flex-col gap-1">
          <span class="label-text text-xs opacity-70">{{ t('media.steps.configure.clip.quality') }}</span>
          <select
            class="select select-primary select-sm"
            :value="modelValue.clipQuality ?? 720"
            @change="onQualityChange"
          >
            <option :value="360">{{ t('media.steps.configure.clip.qualityOptions.360') }}</option>
            <option :value="480">{{ t('media.steps.configure.clip.qualityOptions.480') }}</option>
            <option :value="720">{{ t('media.steps.configure.clip.qualityOptions.720') }}</option>
            <option :value="1080">{{ t('media.steps.configure.clip.qualityOptions.1080') }}</option>
          </select>
        </div>
      </div>

      <span v-if="errors.range" class="text-error text-xs">{{ errors.range }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { DownloadOptions } from '../../tauri/types/media.ts';

const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: Object as PropType<DownloadOptions>,
    required: true,
  },
  isPlaylist: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  'update:modelValue': [DownloadOptions];
}>();

const errors = reactive<{ start?: string; end?: string; range?: string }>({});

const TIME_RE = /^(\d{1,2}:)?\d{1,2}:\d{2}$/;

function parseSeconds(time: string): number {
  const parts = time.split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

function validate(): boolean {
  errors.start = undefined;
  errors.end = undefined;
  errors.range = undefined;

  const start = props.modelValue.clipStart ?? '';
  const end = props.modelValue.clipEnd ?? '';

  if (start && !TIME_RE.test(start)) {
    errors.start = t('media.steps.configure.clip.errors.invalidStart');
  }
  if (end && !TIME_RE.test(end)) {
    errors.end = t('media.steps.configure.clip.errors.invalidEnd');
  }
  if (!errors.start && !errors.end && start && end) {
    if (parseSeconds(end) <= parseSeconds(start)) {
      errors.range = t('media.steps.configure.clip.errors.endBeforeStart');
    }
  }

  return !errors.start && !errors.end && !errors.range;
}

function patch(partial: Partial<DownloadOptions>) {
  emit('update:modelValue', { ...props.modelValue, ...partial });
}

function onToggle(event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  patch({ clipMode: checked });
}

function onStartInput(event: Event) {
  patch({ clipStart: (event.target as HTMLInputElement).value });
}

function onEndInput(event: Event) {
  patch({ clipEnd: (event.target as HTMLInputElement).value });
}

function onQualityChange(event: Event) {
  patch({ clipQuality: Number((event.target as HTMLSelectElement).value) });
}
</script>
