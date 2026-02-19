import { Modal, Group, Button, Image } from "@mantine/core";
import { IconDownload, IconExternalLink } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useReportModalStyles } from "./ReportModal.styles";


interface ReportModalProps {
  opened: boolean;
  onClose: () => void;
  imageUrl: string | null;
  onDownload: () => void;
  onOpenInNewPage: () => void;
}

export const ReportModal = ({
  opened,
  onClose,
  imageUrl,
  onDownload,
  onOpenInNewPage,
}: ReportModalProps) => {
  const classes = useReportModalStyles();
  const { t } = useTranslation();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t("generatedReport")}
      size="lg"
      centered
      classNames={{
        body: classes.modalBody,
      }}
    >
      {imageUrl && (
        <div className={classes.imageContainer}>
          <Image
            src={imageUrl}
            alt="Generated Report"
            className={classes.reportImage}
            fit="contain"
          />
        </div>
      )}

      <Group justify="center" gap="sm" className={classes.buttonGroup}>
        <Button
          variant="outline"
          leftSection={<IconExternalLink size={16} />}
          onClick={onOpenInNewPage}
          className={classes.button}
        >
          {t("openInNewPage")}
        </Button>

        <Button
          leftSection={<IconDownload size={16} />}
          onClick={onDownload}
          className={classes.button}
        >
          {t("download")}
        </Button>
      </Group>
    </Modal>
  );
};
