import { Container, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { Logo } from "../../components/shared/Logo/Logo";
import { LanguageSelector } from "../../components/shared/LanguageSelector/LanguageSelector";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserInput } from "../../components/Home/UserInput/UserInput";
import { WelcomeBack } from "../../components/Home/WelcomeBack/WelcomeBack";
import { CreateAccount } from "../../components/Home/CreateAccount/CreateAccount";
import { Features } from "../../components/Home/Features/Features";
import { useHomeStyles } from "./Home.styles";

interface HomeProps {
  onUserLogin: () => void;
}

export const Home = ({ onUserLogin }: HomeProps) => {
  const classes = useHomeStyles();
  const { t } = useTranslation();
  usePageTitle(t("homePageTitle"));

  const { 
    state, 
    error: authError, 
    isLoading, 
    sanitizedName,
    checkUser, 
    confirmExistingUser, 
    confirmNewUser, 
    goBack 
  } = useUserAuth();

  const handleSubmit = async (validatedName: string) => {
    await checkUser(validatedName);
  };

  const handleExistingUserConfirm = () => {
    confirmExistingUser();
    onUserLogin();
  };

  const handleNewUserConfirm = async () => {
    await confirmNewUser(sanitizedName);
    onUserLogin();
  };

  const handleBack = () => {
    goBack();
  };

  if (state === "input") {
    return (
      <Container size="sm" className={classes.container}>
        <div className={classes.languageSelector}>
          <LanguageSelector />
        </div>

        <div className={classes.header}>
          <Logo order={1} size="h1" className={classes.logo} />
          <Text size="lg" c="dimmed" className={classes.tagline}>
            {t("tagline")}
          </Text>
        </div>

        <UserInput onSubmit={handleSubmit} isLoading={isLoading} />

        <Features />
      </Container>
    );
  }

  if (state === "confirming-existing") {
    return (
      <Container size="sm" className={classes.container}>
        <div className={classes.languageSelector}>
          <LanguageSelector />
        </div>

        <WelcomeBack
          name={sanitizedName}
          onContinue={handleExistingUserConfirm}
          onBack={handleBack}
          error={authError}
          isLoading={isLoading}
        />
      </Container>
    );
  }

  if (state === "confirming-new") {
    return (
      <Container size="sm" className={classes.container}>
        <div className={classes.languageSelector}>
          <LanguageSelector />
        </div>

        <CreateAccount
          name={sanitizedName}
          onCreate={handleNewUserConfirm}
          onBack={handleBack}
          error={authError}
          isLoading={isLoading}
        />
      </Container>
    );
  }

  return (
    <Container size="sm" className={classes.container}>
      <div className={classes.languageSelector}>
        <LanguageSelector />
      </div>

      <div className={classes.loadingContainer}>
        <Logo order={1} size="h1" className={classes.loadingLogo} />
        <Text>{t("loading")}</Text>
      </div>
    </Container>
  );
};
