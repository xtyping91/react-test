import React from 'react';
import { useTranslation } from 'react-i18next';

const Language = () => {
  const { t, i18n } = useTranslation();
  // const { t } = useTranslation();

  return (
    <div>
      {i18n.language}
      <br />
      {t('test')}
      <button
        onClick={() => {
          i18n.changeLanguage('ko-KR');
        }}
      >
        한국어
      </button>
      <button
        onClick={() => {
          i18n.changeLanguage('en-US');
        }}
      >
        영어
      </button>
      <button
        onClick={() => {
          i18n.changeLanguage('id-ID');
        }}
      >
        인도네시아
      </button>
      <button
        onClick={() => {
          i18n.changeLanguage('vi-VN');
        }}
      >
        베트남어
      </button>
    </div>
  );
};

export default Language;
