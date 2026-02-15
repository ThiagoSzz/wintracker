import { useState } from "react";
import { Container, Title, TextInput, Button, Alert, Text, SimpleGrid } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { Logo } from "../ui";
import { useCreateUser } from "../../hooks/useUser";
import { useUserStore } from "../../store/userStore";
import { validateName, sanitizeName } from "../../lib/validations";
import { getUserByName } from "../../database/queries/users";
import type { User } from "../../types";
interface HomePageProps {
  onUserLogin: () => void;
}

type HomePageState = 'input' | 'confirming-existing' | 'confirming-new' | 'processing';

export const HomePage = ({ onUserLogin }: HomePageProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [sanitizedName, setSanitizedName] = useState("");
  const [state, setState] = useState<HomePageState>('input');
  const [error, setError] = useState<string | null>(null);
  const [foundUser, setFoundUser] = useState<User | null>(null);

  const { setCurrentUser } = useUserStore();
  const createUserMutation = useCreateUser();

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const sanitized = sanitizeName(name);
    const validationError = validateName(sanitized);

    if (validationError) {
      setError(t(validationError));
      return;
    }

    setSanitizedName(sanitized);
    setState('processing');

    try {
      const user = await getUserByName(sanitized);
      
      if (user) {
        setFoundUser(user);
        setState('confirming-existing');
      } else {
        setState('confirming-new');
      }
    } catch {
      setError(t("networkError"));
      setState('input');
    }
  };

  const handleExistingUserConfirm = () => {
    setCurrentUser(foundUser);
    onUserLogin();
  };

  const handleNewUserConfirm = async () => {
    setState('processing');
    
    try {
      const newUser = await createUserMutation.mutateAsync({
        name: sanitizedName,
      });
      setCurrentUser(newUser);
      onUserLogin();
    } catch {
      setError(t("networkError"));
      setState('confirming-new');
    }
  };

  const handleBack = () => {
    setState('input');
    setError(null);
    setFoundUser(null);
    setSanitizedName("");
  };

  const isLoading = state === 'processing' || createUserMutation.isPending;

  // Input State
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

        <form onSubmit={handleInitialSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <TextInput
              label={t("enterName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="lg"
              disabled={isLoading}
              style={{ marginBottom: "1rem" }}
            />
          </div>

          {error && (
            <Alert color="red" style={{ marginBottom: "1rem" }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={isLoading}
            disabled={!name.trim()}
          >
            {t("goButton")}
          </Button>
        </form>

        {/* Features Section */}
        <div style={{ marginTop: "4rem" }}>
          <Title order={3} size="h4" style={{ textAlign: "center", marginBottom: "1.5rem", color: "#1c7ed6" }}>
            {t("featuresTitle")}
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            <Alert color="blue" variant="light" style={{ border: "none", backgroundColor: "#e7f5ff" }}>
              <Text size="sm" fw={500}>
                {t("featureTrackWins")}
              </Text>
            </Alert>
            <Alert color="blue" variant="light" style={{ border: "none", backgroundColor: "#e7f5ff" }}>
              <Text size="sm" fw={500}>
                {t("featureAddOpponents")}
              </Text>
            </Alert>
            <Alert color="blue" variant="light" style={{ border: "none", backgroundColor: "#e7f5ff" }}>
              <Text size="sm" fw={500}>
                {t("featureEditResults")}
              </Text>
            </Alert>
          </SimpleGrid>
        </div>
      </Container>
    );
  }

  // Confirming Existing User State
  if (state === 'confirming-existing') {
    return (
      <Container size="sm" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Logo 
            order={1} 
            size="h1" 
            style={{ marginBottom: "1rem" }}
          />
        </div>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Title order={2} size="h3" style={{ marginBottom: "0.5rem" }}>
            {t("welcomeBack", { name: sanitizedName })}
          </Title>
          <Text size="lg" c="dimmed">
            {t("clickToContinue")}
          </Text>
        </div>

        {error && (
          <Alert color="red" style={{ marginBottom: "1rem" }}>
            {error}
          </Alert>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
          <Button
            size="lg"
            fullWidth
            loading={isLoading}
            onClick={handleExistingUserConfirm}
          >
            {t("continueButton")}
          </Button>

          <Button
            variant="subtle"
            size="md"
            fullWidth
            onClick={handleBack}
            disabled={isLoading}
            style={{ 
              whiteSpace: 'normal', 
              minHeight: '44px',
              height: 'auto',
              padding: '8px 16px',
              display: 'block',
              width: '100%'
            }}
          >
            {t("notYou")}
          </Button>
        </div>
      </Container>
    );
  }

  // Confirming New User State
  if (state === 'confirming-new') {
    return (
      <Container
        size="sm"
        style={{ paddingTop: "2rem", paddingBottom: "2rem" }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Logo 
          order={1} 
          size="h1" 
          style={{ marginBottom: "1rem" }}
        />
        </div>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Title order={2} size="h3" style={{ marginBottom: "0.5rem" }}>
            {t("createAccountFor", { name: sanitizedName })}
          </Title>
          <Text size="lg" c="dimmed">
            {t("clickToCreate")}
          </Text>
        </div>

        {error && (
          <Alert color="red" style={{ marginBottom: "1rem" }}>
            {error}
          </Alert>
        )}u 

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
          <Button
            size="lg"
            fullWidth
            loading={isLoading}
            onClick={handleNewUserConfirm}
          >
            {t("createAccountButton")}
          </Button>

          <Button
            variant="subtle"
            size="md"
            fullWidth
            onClick={handleBack}
            disabled={isLoading}
            style={{
              whiteSpace: "normal !important",
              wordBreak: "break-word",
              minHeight: "44px",
              height: "auto !important",
              padding: "8px 16px",
              textOverflow: "visible !important",
              overflow: "visible !important",
              lineHeight: "1.4",
            }}
          >
            {t("alreadyHaveAccount1")}
            <br/>
            {t("alreadyHaveAccount2")}
          </Button>
        </div>
      </Container>
    );
  }

  // Processing state - should not be visible as it transitions quickly
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