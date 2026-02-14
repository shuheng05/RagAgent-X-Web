import { Stack, createListCollection } from '@chakra-ui/react';
import { useBgUrl } from '@/context/bgurl-context';
import { settingStyles } from './setting-styles';
import { useConfig } from '@/context/character-config-context';
import { useGeneralSettings } from '@/hooks/sidebar/setting/use-general-settings';
import { useWebSocket } from '@/context/websocket-context';
import { SelectField, SwitchField, InputField } from './common';

interface GeneralProps {
  onSave?: (callback: () => void) => () => void
  onCancel?: (callback: () => void) => () => void
}

// Data collection definition
const useCollections = () => {
  const { backgroundFiles } = useBgUrl() || {};
  const { configFiles } = useConfig();

  const languages = createListCollection({
    items: [
      { label: 'English', value: 'en' },
      { label: '中文', value: 'zh' },
    ],
  });

  const backgrounds = createListCollection({
    items: backgroundFiles?.map((filename) => ({
      label: String(filename),
      value: `/bg/${filename}`,
    })) || [],
  });

  const characterPresets = createListCollection({
    items: configFiles.map((config) => ({
      label: config.name,
      value: config.filename,
    })),
  });

  return {
    languages,
    backgrounds,
    characterPresets,
  };
};

function General({ onSave, onCancel }: GeneralProps): JSX.Element {
  const bgUrlContext = useBgUrl();
  const { confName, setConfName } = useConfig();
  const {
    wsUrl, setWsUrl, baseUrl, setBaseUrl,
  } = useWebSocket();
  const collections = useCollections();

  const {
    settings,
    handleSettingChange,
    handleCameraToggle,
    handleCharacterPresetChange,
    showSubtitle,
    setShowSubtitle,
  } = useGeneralSettings({
    bgUrlContext,
    confName,
    setConfName,
    baseUrl,
    wsUrl,
    onWsUrlChange: setWsUrl,
    onBaseUrlChange: setBaseUrl,
    onSave,
    onCancel,
  });

  return (
    <Stack {...settingStyles.common.container}>
      {/*<SelectField*/}
      {/*  label="Language"*/}
      {/*  value={settings.language}*/}
      {/*  onChange={(value) => handleSettingChange('language', value)}*/}
      {/*  collection={collections.languages}*/}
      {/*  placeholder="Select language"*/}
      {/*/>*/}

      <SwitchField
        label="使用相机背景"
        checked={settings.useCameraBackground}
        onChange={handleCameraToggle}
      />

      <SwitchField
        label="显示字幕"
        checked={showSubtitle}
        onChange={setShowSubtitle}
      />

      {!settings.useCameraBackground && (
        <>
          <SelectField
            label="背景图像"
            value={settings.selectedBgUrl}
            onChange={(value) => handleSettingChange('selectedBgUrl', value)}
            collection={collections.backgrounds}
            placeholder="从可用背景中选择"
          />

          <InputField
            label="或输入自定义背景 URL"
            value={settings.customBgUrl}
            onChange={(value) => handleSettingChange('customBgUrl', value)}
            placeholder="输入图像 URL"
          />
        </>
      )}

      <SelectField
        label="角色预设"
        value={settings.selectedCharacterPreset}
        onChange={handleCharacterPresetChange}
        collection={collections.characterPresets}
        placeholder={confName || '选择角色预设'}
      />

      {/*<InputField*/}
      {/*  label="WebSocket URL"*/}
      {/*  value={settings.wsUrl}*/}
      {/*  onChange={(value) => handleSettingChange('wsUrl', value)}*/}
      {/*  placeholder="Enter WebSocket URL"*/}
      {/*/>*/}

      {/*<InputField*/}
      {/*  label="Base URL"*/}
      {/*  value={settings.baseUrl}*/}
      {/*  onChange={(value) => handleSettingChange('baseUrl', value)}*/}
      {/*  placeholder="Enter Base URL"*/}
      {/*/>*/}
    </Stack>
  );
}

export default General;
