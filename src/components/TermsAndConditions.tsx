import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useTranslation } from "react-i18next";

const TermsAndConditions: React.FC = () => {
  const { t } = useTranslation();

  console.log("Terms and Conditions component rendering");

  return (
    <>
      <Header />

      {/* Terms and Conditions Section with Background Color */}
      <section className="relative py-12 px-4 font-mandali overflow-hidden" style={{ backgroundImage: "url('/lovable-uploads/About1.jpg')" }}>
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-blue-100 bg-opacity-90"></div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {t("termsAndConditions.title")}
            </h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          {/* Enhanced Card containing Terms and Conditions Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden max-w-6xl mx-auto">
            <div className="p-6 lg:p-8">
              <div className="space-y-6 text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-xl border-l-4 border-blue-500">
                  <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                    {t("termsAndConditions.lastUpdated")}
                  </h3>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    {t("termsAndConditions.companyName")}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {t("termsAndConditions.intro1")}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mt-4">
                    {t("termsAndConditions.intro2")}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">
                      {t("termsAndConditions.section1Title")}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {t("termsAndConditions.section1Content")}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">
                      {t("termsAndConditions.section2Title")}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{t("termsAndConditions.section2Intro")}</p>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{t("termsAndConditions.section2Agreement")}</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                      <li>{t("termsAndConditions.section2Item1")}</li>
                      <li>{t("termsAndConditions.section2Item2")}</li>
                      <li>{t("termsAndConditions.section2Item3")}</li>
                    </ul>
                    <p className="text-gray-700 dark:text-gray-300">
                      {t("termsAndConditions.section2Disclaimer")}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">
                      {t("termsAndConditions.section3Title")}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{t("termsAndConditions.section3Intro")}</p>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{t("termsAndConditions.section3MustNot")}</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                      <li>{t("termsAndConditions.section3Item1")}</li>
                      <li>{t("termsAndConditions.section3Item2")}</li>
                      <li>{t("termsAndConditions.section3Item3")}</li>
                      <li>{t("termsAndConditions.section3Item4")}</li>
                      <li>{t("termsAndConditions.section3Item5")}</li>
                    </ul>
                    <p className="text-gray-700 dark:text-gray-300">
                      {t("termsAndConditions.section3Reserve")}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">
                      {t("termsAndConditions.section4Title")}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{t("termsAndConditions.section4Intro")}</p>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{t("termsAndConditions.section4License")}</p>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{t("termsAndConditions.section4MustNot")}</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                      <li>{t("termsAndConditions.section4Item1")}</li>
                      <li>{t("termsAndConditions.section4Item2")}</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">
                      {t("termsAndConditions.section5Title")}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{t("termsAndConditions.section5Intro")}</p>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{t("termsAndConditions.section5BySubmitting")}</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                      <li>{t("termsAndConditions.section5Item1")}</li>
                      <li>{t("termsAndConditions.section5Item2")}</li>
                    </ul>
                    <p className="text-gray-700 dark:text-gray-300">
                      {t("termsAndConditions.section5Reserve")}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">
                      {t("termsAndConditions.section6Title")}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{t("termsAndConditions.section6Intro")}</p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {t("termsAndConditions.section6Advice")}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">
                      {t("termsAndConditions.section7Title")}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{t("termsAndConditions.section7Intro")}</p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {t("termsAndConditions.section7Consent")}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">
                      {t("termsAndConditions.section8Title")}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {t("termsAndConditions.section8Content")}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">
                      {t("termsAndConditions.section9Title")}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{t("termsAndConditions.section9Intro")}</p>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{t("termsAndConditions.section9Warranties")}</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                      <li>{t("termsAndConditions.section9Item1")}</li>
                      <li>{t("termsAndConditions.section9Item2")}</li>
                      <li>{t("termsAndConditions.section9Item3")}</li>
                    </ul>
                    <p className="text-gray-700 dark:text-gray-300">
                      {t("termsAndConditions.section9Discretion")}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">
                      {t("termsAndConditions.section10Title")}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{t("termsAndConditions.section10Intro")}</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                      <li>{t("termsAndConditions.section10Item1")}</li>
                      <li>{t("termsAndConditions.section10Item2")}</li>
                      <li>{t("termsAndConditions.section10Item3")}</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">
                      {t("termsAndConditions.section11Title")}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {t("termsAndConditions.section11Content")}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">
                      {t("termsAndConditions.section12Title")}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {t("termsAndConditions.section12Content")}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">
                      {t("termsAndConditions.section13Title")}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{t("termsAndConditions.section13Intro")}</p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {t("termsAndConditions.section13Acceptance")}
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-xl border-l-4 border-blue-500">
                    <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">
                      {t("termsAndConditions.contactTitle")}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      {t("termsAndConditions.contactDesc")}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 font-semibold">
                      {t("termsAndConditions.copyright")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default TermsAndConditions;
