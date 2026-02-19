/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { Match } from '../types/Match';
import { generateReportData, generateReportImage } from '../utils/reportGenerator';
import reportTemplateHtml from '../assets/report_template.html?raw';

export const useReportGeneration = () => {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportImageUrl, setReportImageUrl] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  const generateReport = useCallback(async (matches: Match[], userName: string) => {
    if (matches.length === 0) {
      setReportError(t('noMatchesFound'));
      return;
    }

    setIsGenerating(true);
    setReportError(null);

    try {
      const reportData = generateReportData(matches, userName);

      if (!reportData.hasEnoughDataForWins && !reportData.hasEnoughDataForLosses) {
        setReportError(t('insufficientDataForReport'));
        return;
      }

      const imageDataUrl = await generateReportImage(reportData);
      setReportImageUrl(imageDataUrl);
      setShowReportModal(true);
    } catch (error) {
      setReportError(t('reportGenerationError'));
    } finally {
      setIsGenerating(false);
    }
  }, [t]);

  const downloadReport = useCallback(() => {
    if (!reportImageUrl) return;

    const link = document.createElement('a');
    link.href = reportImageUrl;
    link.download = `wintracker-report-${new Date().toISOString().split('T')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [reportImageUrl]);

  const openInNewPage = useCallback(() => {
    if (!reportImageUrl) return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      fetch(reportImageUrl)
        .then(response => response.blob())
        .then(blob => {
          const blobUrl = URL.createObjectURL(blob);
          const newWindow = window.open(blobUrl, '_blank');
          if (!newWindow) {
            window.location.href = blobUrl;
          }
        })
        .catch(() => {
          window.open(reportImageUrl, '_blank');
        });
    } else {
      const newWindow = window.open();
      if (newWindow) {
        const htmlContent = reportTemplateHtml.replace('{{IMAGE_URL}}', reportImageUrl);
        newWindow.document.write(htmlContent);
        newWindow.document.close();
      }
    }
  }, [reportImageUrl]);

  const closeReportModal = useCallback(() => {
    setShowReportModal(false);
    setReportImageUrl(null);
  }, []);

  const clearReportError = useCallback(() => {
    setReportError(null);
  }, []);

  return {
    isGenerating,
    reportImageUrl,
    showReportModal,
    reportError,
    generateReport,
    downloadReport,
    openInNewPage,
    closeReportModal,
    clearReportError,
  };
};
