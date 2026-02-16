import { Container, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { Logo } from "../ui/Logo";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useFormValidation } from "../../hooks/useFormValidation";
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
  usePageTitle("wintracker | Home");
  
  const { name, setName, sanitizedName, error, validateAndSanitize, reset } = useFormValidation();
  const { 
    state, 
    error: authError, 
    isLoading, 
    checkUser, 
    confirmExistingUser, 
    confirmNewUser, 
    goBack 
  } = useUserAuth();

  const handleSubmit = async () => {
    const validatedName = validateAndSanitize(name);
    if (validatedName) {
      await checkUser(validatedName);
    }
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
    reset();
  };

  if (state === 'input') {
    return (
      <Container size="sm" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Logo 
            order={1} 
            size="h1" 
            style={{ marginBottom: "0.5rem" }}
          />
          <Text size="lg" c="dimmed" style={{ marginBottom: "1rem" }}>
            {t("tagline")}
          </Text>
        </div>

        <UserInput
          name={name}
          onNameChange={setName}
          onSubmit={handleSubmit}
          error={error}
          isLoading={isLoading}
        />

        <Features />
      </Container>
    );
  }

  if (state === 'confirming-existing') {
    return (
      <Container size="sm" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
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

  if (state === 'confirming-new') {
    return (
      <Container size="sm" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
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
    <Container size="sm" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
      <div style={{ textAlign: "center" }}>
        <Logo 
          order={1} 
          size="h1" 
          style={{ marginBottom: "1rem" }}
        />
        <Text>{t("loading")}</Text>
      </div>
    </Container>
  );
};