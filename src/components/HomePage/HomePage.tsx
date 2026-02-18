import { Container, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { Logo } from "../ui/Logo";
import { LanguageSelector } from "../ui/LanguageSelector";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserInput } from "./UserInput";
import { WelcomeBack } from "./WelcomeBack";
import { CreateAccount } from "./CreateAccount";
import { Features } from "./Features";

interface HomePageProps {
  onUserLogin: () => void;
}

export const HomePage = ({ onUserLogin }: HomePageProps) => {
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
      <Container
        size="sm"
        style={{ paddingTop: "2rem", paddingBottom: "2rem", position: "relative" }}
      >
        <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
          <LanguageSelector />
        </div>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Logo order={1} size="h1" style={{ marginBottom: "0.5rem" }} />
          <Text size="lg" c="dimmed" style={{ marginBottom: "1rem" }}>
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
      <Container
        size="sm"
        style={{ paddingTop: "2rem", paddingBottom: "2rem", position: "relative" }}
      >
        <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
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
      <Container
        size="sm"
        style={{ paddingTop: "2rem", paddingBottom: "2rem", position: "relative" }}
      >
        <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
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
    <Container size="sm" style={{ paddingTop: "2rem", paddingBottom: "2rem", position: "relative" }}>
      <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
        <LanguageSelector />
      </div>

      <div style={{ textAlign: "center" }}>
        <Logo order={1} size="h1" style={{ marginBottom: "1rem" }} />
        <Text>{t("loading")}</Text>
      </div>
    </Container>
  );
};
