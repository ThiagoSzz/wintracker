import { Menu, Button, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_CONFIG } from '../../types/Language';

const languages = Object.values(LANGUAGE_CONFIG);

export const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <Menu shadow="md" width={120} position="bottom-end" withArrow offset={2}>
      <Menu.Target>
        <Button
          variant="subtle"
          size="sm"
          style={{
            padding: '4px 8px',
            height: 'auto',
            minHeight: '32px',
            backgroundColor: 'transparent',
          }}
        >
          <span style={{ fontSize: '18px' }}>
            {currentLanguage.flag}
          </span>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {languages.map((language) => (
          <Menu.Item
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            style={{
              backgroundColor: i18n.language === language.code ? '#f1f3f4' : 'transparent',
            }}
          >
            <Group gap="xs" style={{ fontSize: '14px' }}>
              <span style={{ fontSize: '16px' }}>{language.flag}</span>
              <span>{language.label}</span>
            </Group>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};