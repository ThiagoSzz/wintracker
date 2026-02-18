import { Menu, Button, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_CONFIG } from '../../../types/Language';
import { useLanguageSelectorStyles } from './LanguageSelector.styles';

const languages = Object.values(LANGUAGE_CONFIG);

export const LanguageSelector = () => {
  const classes = useLanguageSelectorStyles();
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
          className={classes.button}
        >
          <span className={classes.flag}>
            {currentLanguage.flag}
          </span>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {languages.map((language) => (
          <Menu.Item
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={i18n.language === language.code ? classes.menuItemSelected : classes.menuItemDefault}
          >
            <Group gap="xs" className={classes.menuGroup}>
              <span className={classes.menuFlag}>{language.flag}</span>
              <span>{language.label}</span>
            </Group>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};